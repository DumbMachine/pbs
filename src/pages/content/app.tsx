import React, { useCallback, useState } from "react";
import { createRoot } from "react-dom/client";

import Pallete from "../popup/pallete";

import * as utils from "./utils";

import { useDebouncedCallback } from "use-debounce";

import { IPC_EVENTS } from "../background/types";
import { AppContext } from "../popup/context";
import { Actions } from "./actions";
import { useCaretHints } from "./caretHints";
import CheatSheet from "./component/cheatsheet";
import { IShortcut, ShortcutType } from "./types";
import { SUB_STRING_SIZE, generateAllShortcuts } from "./util/util";
import Toast from "./toast";

export const Component = () => {
  // const _ = useCaretHints();

  const appCtx = React.useContext(AppContext);
  const [state, setState] = React.useState<{
    show: boolean;
    options: string[];
    // actions: Map<string, () => void>;
    actions: {
      [key: string]: (element: HTMLElement) => Promise<void>;
    };
  }>({
    show: false,
    options: [],
    actions: {},
  });
  const [hints, setShowHints] = useState<boolean>(false);
  const [cheat, showCheat] = useState<boolean>(false);
  const [pallete, showPallete] = useState<boolean>(false);
  const [keys, setKeys] = useState<string>("");

  const hintsRef = React.useRef(hints);
  const keyRef = React.useRef(keys);
  const stateRef = React.useRef(state);

  const showRef = React.useRef({ cheat });

  keyRef.current = keys;
  stateRef.current = state;
  hintsRef.current = hints;

  const regexShorty: {
    [key: string]: IShortcut;
  } = {
    "t\\d+": {
      title: "Open tab",
      type: ShortcutType.shortcut,
      // @ts-ignore
      action: (input: string) => {
        const cleanInput = input.replaceAll("+", "").replace("t", "");
        console.log("swwitching to tab: ", cleanInput);
        if (cleanInput)
          chrome.runtime.sendMessage({
            type: IPC_EVENTS.SWITCH_TO_TAB,
            payload: { tabID: cleanInput },
          });
      },
    },
  };

  const shorty: {
    [key: string]: IShortcut;
  } = {
    "meta+/": {
      title: "Open pallete",
      type: ShortcutType.shortcut,
      action: (_) => {
        // setShowHints((prev) => !prev);
        // showCheat((prev) => !prev);
        showPallete(true);
      },
    },
    "meta+.": {
      title: "See this cheatsheet",
      type: ShortcutType.shortcut,
      action: (_) => {
        // setShowHints((prev) => !prev);
        // showCheat((prev) => !prev);
        showCheat(true);
      },
    },
    j: {
      title: "Scroll down",
      type: ShortcutType.shortcut,
      action: Actions.scrollDownALittle,
    },
    k: {
      title: "Scroll up",
      type: ShortcutType.shortcut,
      action: Actions.scrollUpALittle,
    },
    "g+g": {
      title: "Scroll to up",
      type: ShortcutType.shortcut,
      action: Actions.scrollToTop,
    },
    // TODO: make this shift+g
    "shift+g": {
      title: "Scroll to bottom",
      type: ShortcutType.shortcut,
      action: Actions.scrollToBottom,
    },
    r: {
      title: "Refresh",
      type: ShortcutType.shortcut,
      action: Actions.documentReload,
    },
    // NOTE: might as well just use the browser's default, <cmd>+[]
    // "[": {
    //   title: "Previous tab",
    //   action: Actions.goBackInHistory,
    // },
    // "]": {
    //   title: "Next tab",
    //   action: Actions.goForwardInHistory,
    // },
  };

  const concatShortcuts = (shortcuts: string[]) => {
    return shortcuts.filter((_) => _.length > 0).join("+");
  };

  // I'm something of a functional programmer myself
  const isKeyMemberOfShorty = (key: string) => {
    return Object.keys(shorty)
      .map((_) => (_.includes("+") ? _.split("+").flat() : _.split("").flat()))
      .flat()
      .includes(key);
  };

  const updateKeys = useCallback(
    (event: KeyboardEvent) => {
      const stopPropagation = () => {
        if (appCtx.WebSettings.PropagateAll) {
          return;
        }

        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();
      };

      const isContentEditable = (element: EventTarget | null) => {
        if (element instanceof HTMLElement) {
          return element.isContentEditable;
        }
        return false;
      };

      const isFromForm =
        event.target instanceof HTMLFormElement ||
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement;

      const isFromContentEditable = isContentEditable(event.target);

      if (isFromForm || isFromContentEditable) return;

      let key: string;
      // key = event.key.toLowerCase();
      if (event.shiftKey) {
        key = concatShortcuts(["shift", event.key.toLowerCase()]);
      } else if (event.ctrlKey) {
        key = "ctrl+" + event.key.toLowerCase();
      } else if (event.metaKey) {
        key = "meta+" + event.key.toLowerCase();
      } else {
        key = event.key.toLowerCase();
      }

      console.debug("[key press]: ", key, event.target);

      const isHintsKeys = key === "f";

      // if (appCtx.WebSettings.PropagateNone) stopPropagation();

      // EVENT: ENABLE_HINTS
      if (isHintsKeys && !hintsRef.current) {
        // hints are not toggled, and this is the toggle event
        console.debug("enabling hints");
        setShowHints(true);
        stopPropagation();
        clearKeysNow();
        return;
      }

      // EVENT: DISABLE_HINTS
      if (
        hintsRef.current &&
        key === "escape" &&
        // AFAIK keyCode 229 means that user pressed some button, but input method is still processing that
        // ref: https://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
        event.keyCode !== 229
      ) {
        // hints are enabled, and this is the toggle event
        console.debug("disabling hints");
        setShowHints(false);
        stopPropagation();
        return;
      }

      // EVENT: DISABLE_CHEATSHEET
      if (showRef.current.cheat && key === "escape" && event.keyCode !== 229) {
        console.debug("disabling cheatsheet");
        showCheat(false);
        stopPropagation();
        return;
      }

      const newCombo = concatShortcuts([keyRef.current, key]);
      console.debug({ key, newCombo });

      // EVENT: IS_VALID_HINT
      if (
        hintsRef.current &&
        stateRef.current.options
          .map((_) => concatShortcuts(_.split("")))
          .includes(newCombo)
      ) {
        const action = stateRef.current.actions[newCombo.split("+").join("")];
        if (action) {
          action(document.body).then(() => {
            setShowHints(false);
            clearKeysNow();
          });
        }
        appCtx.WebSettings.PropagateAllExceptHints && stopPropagation();
        return;
      }

      // EVENT: IS_SHOTY_SHORTCUT
      // If hints are not toggled, the keystroke/s can be part of the shoty shortcut
      // EVENT: IS_SHOTY_SHORTCUT_SINGLE
      if (
        !hintsRef.current &&
        // isKeyMemberOfShorty(key) &&
        Object.keys(shorty).includes(key)
      ) {
        console.log("found valid shortcut for single keys: ", key);
        const action = shorty[key];
        if (action) {
          shorty[key].action(document.body);
          stopPropagation();
          clearKeysNow();
          return;
        }
      }

      // EVENT: IS_SHOTY_SHORTCUT_COMBINATION
      if (
        !hintsRef.current &&
        // isKeyMemberOfShorty(newCombo) &&
        Object.keys(shorty).includes(newCombo)
      ) {
        console.log("found valid shortcut for key combination: ", newCombo);

        const action = shorty[newCombo];
        if (action) {
          shorty[newCombo].action(document.body);
          stopPropagation();
          clearKeysNow();
          return;
        }
      }

      // EVENT: SHORTCUT_BY_REGEX
      const regexShortcuts = Object.keys(regexShorty).find((_) =>
        new RegExp(_).test(newCombo.replaceAll("+", ""))
      );
      if (!hintsRef.current && regexShortcuts) {
        console.log("regex: ", newCombo);

        const action = regexShorty[regexShortcuts];
        if (action) {
          regexShorty[regexShortcuts].action(newCombo);
          stopPropagation();
          clearKeysNow();
          return;
        }
      }

      // EVENT: SHORTCUT_KEY_OVERFLOW
      // +2 for indices on the shortcuts, i.e max 21 of the same shortcut keys
      if (newCombo.replace("+", "").length > SUB_STRING_SIZE + 2) {
        // max lenght reached, clear keys instantly
        console.debug("[overflow] clear keys");
        setKeys(key);
        // clearing keys
        return;
      }

      // there was not match for the event, stopPropagation if hints are enabled
      // so mid hint activation, no native browser shortcuts are triggered
      if (hintsRef.current) {
        stopPropagation();
      }

      // no valid hits, just store the key in memory
      setKeys(newCombo);
      clearKeys();

      return;
    },
    [state, keys]
  );

  const clearKeys = useDebouncedCallback(() => {
    setKeys("");
  }, 1000);

  const clearKeysNow = () => {
    setKeys("");
  };

  const setOptions = React.useCallback(
    (options: string[]) => {
      setState((prev) => ({ ...prev, options }));
    },
    [setState]
  );

  const setNewShortcut = (options: IShortcut[]) => {
    const newActions = options.reduce((acc, { key, action }) => {
      return {
        ...acc,
        [key]: action,
      };
    }, {});

    setState((old) => {
      return {
        ...old,
        actions: newActions,
        options: options.map((_) => _.key),
      };
    });
  };

  const removeAllHints = () => {
    // remove all id="hint"
    const elements = document.querySelectorAll("#hint");
    elements.forEach((element) => {
      element.remove();
    });
  };

  React.useEffect(() => {
    if (!hints) {
      removeAllHints();
      return;
    }
    console.debug("generating hints");

    function isHidden(el: Element) {
      const style = window.getComputedStyle(el);
      return style.display === "none" || style.visibility === "tw-hidden";
    }

    // const genShortcut = new SubstringGenerator();
    const bodyRect = document.body.getBoundingClientRect();

    // check if a htmlnode has valid text content
    const isValidTextContent = (element: HTMLElement) => {
      // const t = element.textContent?.trim().replace(/^[A-Za-z]+$/g, " ") ?? "";
      // const t =
      //   element.textContent
      //     ?.trim()
      //     .match(/^[A-Za-z]+$/)
      //     ?.join("") ?? "";
      let base: string = element.textContent?.trim() ?? "";

      if (element.tagName == "INPUT") {
        base = (element as HTMLInputElement).placeholder;
        // fallback to id of the input element
        if (base.length == 0) base = (element as HTMLInputElement).id;
      }

      if (
        base.length == 0 &&
        (element.tagName.toLowerCase() == "button" ||
          element.tagName.toLowerCase() == "div")
      ) {
        base = (element as HTMLButtonElement).title;
        if (base.length == 0 && element.ariaLabel) base = element.ariaLabel;
      }

      if (base.length == 0) base = (element as unknown as { alt: string }).alt;

      // I think this replaes all non alphabets
      return base?.replace(/[^a-zA-Z]+/g, "") ?? "";
    };

    const items = // NOTE: this function doens't capture input elements
      (
        [
          ...(
            Array.from(
              document.querySelectorAll(utils.getCssSelectorsOfEditable())
            ) as HTMLElement[]
          ).filter((_) => _.tagName.toLowerCase() == "input"),
          ...(utils.getClickableElements("*") as HTMLElement[]),
        ] as HTMLElement[]
      )
        .filter((element) => {
          // filter out elements not inthe view port
          // NOTE: this is a disgusting hack
          const rect = element.getBoundingClientRect();
          const inViewPort =
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <=
              (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <=
              (window.innerWidth || document.documentElement.clientWidth);
          return inViewPort;
        })
        .filter(
          (x) =>
            appCtx.Settings.FallbackToRandomShortcut ||
            isValidTextContent(x).length > 0
        )
        .map((elm) => {
          // console.log(
          //   elm,
          //   elm.textContent,
          //   isValidTextContent(elm).toLowerCase()
          // );
          console.log(appCtx.Settings.FallbackToRandomShortcut);
          const r = elm.getBoundingClientRect();

          return {
            element: elm,
            text: isValidTextContent(elm).toLowerCase(),
            rect: {
              left: Math.max(r.left - bodyRect.x, 0),
              top: Math.max(r.top - bodyRect.y, 0),
              right: Math.min(r.right - bodyRect.x, document.body.clientWidth),
              bottom: Math.min(
                r.bottom - bodyRect.y,
                document.body.clientHeight
              ),
            },
          };
        });

    const shortcuts: string[] = items.map((item) => item.text);
    const betterShortcuts = generateAllShortcuts(
      shortcuts,
      true
      // appCtx.Settings.FallbackToRandomShortcut
    );

    const xtems = items.map((item, iter) => {
      const container = document.createElement("div");
      const root = createRoot(container);
      document.body.appendChild(container);
      // TODO: Render in a single root.render call, rather than creating a new root for each hint
      // Maybe create common root and render all hints in that
      root.render(
        <div
          id="shorty-app"
          // className="tw-outline-none tw-border-2 tw-border-red-500"
          style={{
            position: "absolute",
            left: item.rect.left + "px",
            top: item.rect.top + "px",
            width: item.rect.right - item.rect.left + "px",
            height: item.rect.bottom - item.rect.top + "px",
            pointerEvents: "none",
            zIndex: 9147483647,
          }}
        >
          <KeyboardShorty text={betterShortcuts[iter]} />
        </div>
      );

      return [
        betterShortcuts[iter],
        async () => {
          switch (item.element.tagName.toLowerCase()) {
            case "input": {
              console.debug("dispatching as input");
              const elm = item.element as HTMLInputElement;
              elm.scrollIntoView();
              elm.focus();
              elm.select();
              break;
            }
            case "select":
              {
                console.debug("dispatching as select");
                const elm = item.element as HTMLSelectElement;
                const event = new MouseEvent("mousedown");
                elm.dispatchEvent(event);
              }
              // item.element.focus();
              break;
            default:
              console.debug("dispatching as default");
              item.element.click();
          }
        },
        async () => {
          const mouseOverEvent = new MouseEvent("mouseover", {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: item.rect.left,
            clientY: item.rect.top,
          });
          item.element.dispatchEvent(mouseOverEvent);
        },
      ];
    });

    setNewShortcut(
      xtems.map(([key, action, hover]): IShortcut => {
        return {
          key,
          type: ShortcutType.hint,
          // @ts-ignore
          action,
          // @ts-ignore
          hover,
        };
      })
    );
  }, [hints]);

  //   update hotkeys, if options change
  // React.useEffect(() => {
  //   const keys = state.options
  //     .map((_) => {
  //       const len = _.length;
  //       // return _.slice(0, len > 3 ? 3 : len);
  //       return _[0];
  //     })
  //     .join(",");

  //   // console.log("keys", state);
  // }, [state]);

  React.useEffect(() => {
    const isEnabled = appCtx.Settings.Enabled;
    if (!isEnabled) {
      console.debug(
        "[placeholder] settings `disabled`, not attaching key listener"
      );
      return;
    }

    if (!appCtx.WebSettings.Enabled) {
      console.debug(
        "[placeholder] website settings `disabled`, not attaching key listener"
      );
      return;
    }

    console.debug("attaching key listener for shortcuts");

    // const handler = (response: { type: string; payload: any }) => {
    //   console.debug("received message", response);
    //   switch (response.type) {
    //     case "SETTINGS_UPDATE":
    //       console.log("global settings updated: ", response.payload);
    //       break;
    //     case "SETTINGS_UPDATE_WEBSITE":
    //       console.log("website settings updated: ", response.payload);
    //       break;
    //     default:
    //       // ignore
    //       return;
    //   }
    // };

    // true, to capture the event in the capturing phase
    document.addEventListener("keydown", updateKeys, true);
    // chrome.runtime.onMessage.addListener(handler);

    return () => {
      document.removeEventListener("keydown", updateKeys, true);
      // chrome.runtime.onMessage.removeListener(handler);
    };
  }, [appCtx.Settings, appCtx.WebSettings]);

  return (
    <>
      {/* <CheatSheet open={cheat} onClose={() => showCheat(false)} /> */}
      <Pallete _open={pallete} close={() => showPallete(false)} />
      <Toast
        open={false}
        onClose={() => {
          return;
        }}
        notification={{
          Primary: "Shorty is enabled",
          Secondary: "Press <meta>+/ to open pallete",
        }}
      />
      <div
        //  ref={compRef}
        id="shorty-app"
        className="tw-absolute"
      >
        {/* <div className="tw-absolute tw-top-0 tw-text-xs tw-text-black tw-bg-blue-200 tw-z-50">
          {hints} content script loaded {keys}
          Is enabled? :{" "}
          {JSON.stringify({
            enabled: appCtx.Settings.Enabled,
            webenabled: appCtx.WebSettings.Enabled,
          })}
        </div> */}
      </div>
    </>
  );
};

const KeyboardShorty = ({ text }: { text: string }) => {
  return (
    <div
      id="hint"
      className="text-[12px] tw-z-50 tw-justify-center tw-items-center tw-bg-transparent"
    >
      <span className="tw-font-semibold tw-text-black bg-[#fbbd23] tw-rounded-md">
        {text}
      </span>
    </div>
  );
};

function getCssSelector(element: HTMLElement) {
  if (!(element instanceof Element)) {
    return null;
  }

  const path = [];
  while (element.nodeType === Node.ELEMENT_NODE) {
    let selector = element.nodeName.toLowerCase();

    if (element.id) {
      selector += `#${element.id}`;
      path.unshift(selector);
      break;
    } else {
      const siblings = element.parentNode?.childNodes;
      if (siblings && siblings.length > 1) {
        let index = 1;
        for (let i = 0; i < siblings.length; i++) {
          const sibling = siblings[i];
          if (sibling === element) {
            selector += `:nth-child(${index})`;
            break;
          }
          if (
            sibling.nodeType === Node.ELEMENT_NODE &&
            sibling.nodeName === element.nodeName
          ) {
            index++;
          }
        }
      }
    }

    path.unshift(selector);
    element = element.parentNode as HTMLElement;
  }

  return path.join(" > ");
}

export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise((resolve) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
};

function getCSSSelector(element: Element): string {
  let selector = element.tagName.toLowerCase();

  if (element.id) {
    selector += `#${element.id}`;
  }

  element.classList.forEach((cls: string) => {
    selector += `.${cls}`;
  });

  let sibling: Element | null = element;
  let siblingCount = 1;
  while ((sibling = sibling.previousElementSibling)) {
    if (
      sibling.tagName === element.tagName &&
      sibling.id === element.id &&
      Array.from(sibling.classList).every((cls) =>
        element.classList.contains(cls)
      )
    ) {
      siblingCount++;
    }
  }

  selector += `:nth-of-type(${siblingCount})`;

  return selector;
}
