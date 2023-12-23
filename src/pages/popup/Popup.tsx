import React from "react";
import { GenericSwitch } from "../content/component/cheatsheet/Toggle";
import { Button } from "../content/component/cheatsheet/Button";
import { Settings, WebsiteSettings } from "../content/settings";
import { Checkbox } from "../content/component/cheatsheet/Radio";
import { EXT_WEB_SETTING_SET_REQUEST, handlers } from "../background/events";
import clsx from "clsx";
import { IPC_EVENTS } from "../background/types";
import { imgSrc } from "../background/constantines";

// import "../content/style.css";
// import "@assets/styles/tailwind.css";

export default function Popup(): JSX.Element {
  return (
    <div className="tw-absolute tw-top-0 tw-left-0 tw-right-0 tw-bottom-0 tw-text-center tw-h-full tw-p-3 tw-bg-blend-soft-light tw-bg-slate-800">
      <SettingsForWebsite />
    </div>
  );
}

const SettingsForWebsite = () => {
  const [state, setState] = React.useState<{
    url?: string;
    globalSetting?: Settings;
    settings?: WebsiteSettings;
  }>({});

  React.useEffect(() => {
    // NOTE: this current-tab won't work if tab changes after popup is opened
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // send message to current tab
      // chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
      //   //Be aware that `tab` is an array of Tabs
      // parse domain from url
      const url = new URL(tabs[0].url ?? "");
      setState({ url: url.hostname });

      url &&
        handlers[IPC_EVENTS.EXT_WEB_SETTING_GET](url.hostname).then(
          (response) => {
            setState((old) => ({ ...old, settings: response }));
            return;
          }
        );

      handlers[IPC_EVENTS.EXT_SETTING_GET]().then((response) => {
        setState((old) => ({ ...old, globalSetting: response }));
        return;
      });
    });
  }, []);

  // const thisSettings: WebsiteSettings = {
  //   Enabled: true,
  //   PropagateAll: true,
  //   PropagateAllExceptHints: true,
  //   PropagateNone: true,
  // };

  const protectedPage = !(state.url ? state.url.length > 0 : false);

  return (
    <div className="tw-flex tw-flex-col tw-justify-between tw-h-full">
      <div className="tw-flex tw-flex-row tw-w-full tw-justify-between tw-mb-4">
        {/* <div className="text-black text-2xl uppercase">
          <code>Placeholder</code>
        </div> */}
        <img className="tw-h-[64px]" src={`data:image/png;base64,${imgSrc}`} />
        <div
          title={"Enable/Disable Placeholder"}
          className="tw-w-1/3 tw-flex tw-flex-col tw-justify-center tw-items-center"
        >
          <GenericSwitch
            on={state.globalSetting?.Enabled ?? false}
            onClick={(val: boolean) => {
              setState((old) => ({
                ...old,
                globalSetting: {
                  ...old.globalSetting,
                  Enabled: val,
                  FallbackToRandomShortcut: false,
                },
              }));
              handlers[IPC_EVENTS.EXT_SETTING_SET]({
                Enabled: val,
              } as Settings).then(null);
            }}
          />
          <small
            className={clsx(
              "tw-text-[12px]"
              // state.globalSetting?.Enabled ? "text-gray-500" : "text-red-400"
            )}
          >
            <span>(⌘ + ⇧ + d )</span>
          </small>
        </div>
      </div>
      {protectedPage && (
        <div className="tw-flex tw-justify-center tw-border tw-border-red-500 tw-text-gray-200 tw-rounded-md">
          disabled on protected pages
        </div>
      )}
      <div
        className={clsx(
          "tw-flex tw-flex-col tw-justify-between",
          (protectedPage || !state.globalSetting?.Enabled) && "tw-opacity-25"
        )}
      >
        <div className="tw-w-full tw-flex tw-flex-col tw-justify-center">
          <div className="tw-flex tw-flex-row tw-w-full">
            {/* current website toggle */}
            <div className="tw-flex tw-flex-col tw-w-full">
              <div className="tw-flex tw-flex-row tw-border-2 tw-border-accent tw-rounded-xl tw-justify-between">
                <span
                  className={clsx(
                    "tw-ml-2",
                    "tw-text-gray-100",
                    state.settings?.Enabled
                      ? "tw-text-opacity-100"
                      : "tw-text-opacity-25"
                  )}
                >
                  {state.url}
                </span>
                <GenericSwitch
                  disabled={protectedPage}
                  on={protectedPage ? false : state.settings?.Enabled ?? false}
                  onClick={(val: boolean) => {
                    const newSettings: WebsiteSettings = {
                      Enabled: val,
                      // old
                      PropagateAll: state.settings?.PropagateAll ?? false,
                      PropagateAllExceptHints:
                        state.settings?.PropagateAllExceptHints ?? false,
                      // PropagateNone: state.settings?.PropagateNone ?? false,
                    };
                    setState((old) => ({ ...old, settings: newSettings }));
                    handlers[IPC_EVENTS.EXT_WEB_SETTING_SET]({
                      url: state.url ?? "",
                      setting: newSettings,
                    } as EXT_WEB_SETTING_SET_REQUEST).then(null);
                  }}
                />
              </div>
              <span className="tw-text-xs tw-text-gray-400">
                disable for this website only
              </span>
            </div>
          </div>
        </div>
        <div className="tw-divider tw-pt-4"></div>
        <div
          className={clsx(
            state.globalSetting?.Enabled &&
              !state.settings?.Enabled &&
              "tw-opacity-25",
            "tw-flex tw-flex-col tw-border-2 tw-rounded-md tw-p-1 tw-text-white"
          )}
        >
          {/* {typeof state.settings != "undefined" ? ( */}
          {state.settings ? (
            <>
              {/* <div className="border-y-2"></div> */}
              {Object.keys(state.settings)
                .filter(
                  // handled by toggle
                  (key) => key != "Enabled"
                )
                .map((key) => {
                  return (
                    <div
                      key={key}
                      className="tw-flex tw-flex-row tw-justify-between"
                    >
                      <div className="tw-flex tw-flex-col tw-text-left tw-gap-y-0">
                        <span>{key}</span>
                        <p className="tw-text-[9px]">some description</p>
                      </div>
                      <div className="tw-flex tw-flex-col tw-py-auto tw-align-middle tw-items-center">
                        <Checkbox
                          disabled={protectedPage}
                          defaultChecked={state.settings && state.settings[key]}
                          option={{
                            value: "true",
                            label:
                              state.settings && state.settings[key]
                                ? "Enabled"
                                : "Disabled",
                          }}
                          onChange={(val: string) => {
                            if (state.settings) {
                              const newSet = { ...state.settings };
                              newSet[key] = val == "true";
                              setState((old) => ({
                                ...old,
                                settings: newSet,
                              }));

                              handlers[IPC_EVENTS.EXT_WEB_SETTING_SET]({
                                url: state.url ?? "",
                                setting: newSet,
                              } as EXT_WEB_SETTING_SET_REQUEST).then(
                                (response) => {
                                  console.log({ response });
                                  return;
                                }
                              );
                            }
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </>
          ) : (
            <>Loading settings</>
          )}
        </div>
      </div>
      <div className="tw-flex tw-flex-col tw-mt-2">
        {/* <Footer /> */}
        <div className="tw-flex tw-flex-row tw-w-full tw-gap-x-2 tw-justify-center">
          <Button.Square
            onClick={() => {
              console.log("check me");
              chrome.tabs.create({
                active: true,
                url: "https://github.com/dumbMachine/pbs/",
              });
            }}
          >
            Feedback
          </Button.Square>
          <Button.Square>
            <span className="tw-flex tw-items-center">
              Advanced Settings
              <svg
                id="right-arrow"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="tw-w-6 tw-h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </span>
          </Button.Square>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <div className="tw-flex tw-flex-row tw-w-full tw-gap-x-2 tw-justify-center">
      {[
        {
          title: "privacy",
          link: "",
        },
        {
          title: "github",
          link: "",
        },
        {
          title: "help",
          link: "",
        },
      ].map((_) => (
        <span key={_.title}>
          <a href={_.link}>{_.title}</a>
        </span>
      ))}
    </div>
  );
};
