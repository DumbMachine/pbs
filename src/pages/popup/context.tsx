import React, { ReactNode } from "react";
import {
  SETTING_KEY,
  Settings,
  WebsiteSettings,
  defaultSettings,
} from "../content/settings";

import {
  EXT_WEB_SETTING_SET_REQUEST,
  defaultWebSettings,
  handlers,
} from "../background/events";
import { IPC_EVENTS } from "../background/types";

// App context with settings informatin
interface IContext {
  // global settings
  Settings: Settings;
  WebSettings: WebsiteSettings;
  UpdateSettings: (newSettings: Settings) => Promise<null>;
}

const defaultContext: IContext = {
  Settings: defaultSettings,
  WebSettings: defaultWebSettings,
  UpdateSettings: async (newSettings: Settings) => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ settings: newSettings }, () => {
        resolve(null);
      });
    });
  },
};

export const AppContext = React.createContext(defaultContext);
export const AppContextProvider: React.FC<{ children: ReactNode }> = (
  props
) => {
  const [settings, setSettings] = React.useState<Settings>(defaultSettings);
  const [webSettings, setWebSettings] =
    React.useState<WebsiteSettings>(defaultWebSettings);

  React.useEffect(() => {
    // first load
    handlers[IPC_EVENTS.EXT_SETTING_GET]().then((settings) => {
      console.debug("getting settings", { settings });
      setSettings(settings);
      return;
    });

    const hostname = new URL(document.URL).hostname;

    handlers[IPC_EVENTS.EXT_WEB_SETTING_GET](hostname).then((settings) => {
      console.debug("getting web settings", { url: hostname, settings });
      setWebSettings(settings);
      return;
    });

    const externalUpdateHandler = (newSettings: Settings) => {
      setSettings(newSettings);
    };

    // chrome.storage.session.setAccessLevel({
    //   accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS",
    // });

    const changeHandler = (changes: any) => {
      console.log(changes);
      if (changes[SETTING_KEY]) {
        console.log(
          "settings changed, document",
          document.URL,
          changes[SETTING_KEY].newValue
        );
        externalUpdateHandler(changes[SETTING_KEY].newValue);
      }
      if (changes[hostname]) {
        console.log(
          "detected website settings change",
          changes[hostname].newValue
        );
        setWebSettings(changes[hostname].newValue);
      }
    };

    chrome.storage.local.onChanged.addListener(changeHandler);

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.type === "SETTINGS_UPDATE") {
        console.log("settings update", request);
        externalUpdateHandler(request.payload);
      }
      if (request.type === "SETTINGS_UPDATE_WEBSITE") {
        console.log("web settings update", request);
        setWebSettings(request.payload);
      }
    });

    return () => {
      chrome.storage.local.onChanged.removeListener(changeHandler);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        Settings: settings,
        WebSettings: webSettings,
        UpdateSettings: async (newSettings) => {
          setSettings(newSettings);
          handlers[IPC_EVENTS.EXT_SETTING_SET](newSettings);
          return null;
        },
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
