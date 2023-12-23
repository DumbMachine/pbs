export const SETTING_KEY = "settings";
export const defaultSettings: Settings = {
  Enabled: true,
  FallbackToRandomShortcut: true,
};

interface booleanSettings {
  [key: string]: boolean;
}

// I think I did the extends to have valid string:bool index signature
export interface WebsiteSettings extends booleanSettings {
  // Is extension enabled on this website
  Enabled: boolean;

  // Propagate all key inputs to webpage, even if it interferes with the extension
  PropagateAll: boolean;

  // // Propagate no key inputs to webpage
  // PropagateNone: boolean;

  // Propgate all key inputs to webpage, except if the key combination is used by the extension
  PropagateAllExceptHints: boolean;
}

export interface Settings {
  // global: enable/disable extension
  Enabled: boolean;

  // If a predictable hint cannot be generated for an elenet, fallback to a random unique hint
  FallbackToRandomShortcut: boolean;
}

// let storage = chrome.storage.local;

const getStorage = () => {
  return new Promise<Settings>((resolve, reject) => {
    chrome.storage.local.get([SETTING_KEY], (result) => {
      if (result[SETTING_KEY]) {
        resolve(result[SETTING_KEY]);
      } else {
        resolve(defaultSettings);
      }
    });
  });
};

const updateSettings = async (newSettings: Settings) => {
  return new Promise<Settings>((resolve, reject) => {
    chrome.storage.local.set({ SETTING_KEY: newSettings }, () => {
      resolve(newSettings);
    });
  });
};
