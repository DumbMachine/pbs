// IPC EVENTS
// import { Settings, WebsiteSettings } from "../content/settings";
import { faviconURL, getBrowserInfo } from "../content/util/util";
import { SEARCH_TARGET, SEARCH_TARGET_REGEX } from "./constantines";
import { SearchEngine } from "./search";
import {
  BookmarkSearchResult,
  BrowserType,
  HistorySearchResult,
  IPC_EVENTS,
  SearchResult,
  TabSearchResult,
} from "./types";

interface Settings {
  Enabled: boolean;
  FallbackToRandomShortcut: boolean;
}

interface WebsiteSettings {
  Enabled: boolean;
  PropagateAll: boolean;
  PropagateAllExceptHints: boolean;
}

// default global settings
export const defaultSettings: Settings = {
  Enabled: true,
  FallbackToRandomShortcut: true,
};

export const defaultWebSettings: WebsiteSettings = {
  Enabled: true,
  PropagateAll: false,
  // PropagateNone: true,
  PropagateAllExceptHints: false,
};

export interface EXT_WEB_SETTING_SET_REQUEST {
  url: string;
  setting: WebsiteSettings;
}

export const STORAGE_KEYS = {
  SETTINGS: "settings",
};

const searchBookmarks = async (
  query: string
): Promise<BookmarkSearchResult[]> => {
  return new Promise((resolve, reject) => {
    chrome.bookmarks.getTree;
    chrome.bookmarks.search(query, (results) => {
      console.log("[bookmarks]", { results });
      const foundBookmarks = results
        .filter((_) => (_ as any).type != "folder")
        .map(
          (result) =>
            ({
              id: result.id,
              title: result.title,
              url: result.url,
              favicon: faviconURL(result.url!),
              secondary: result.url,
              bookmarkID: result.id,
              folderID: result.parentId ?? "",
              // TODO: get folder title
              folderTitle: result.parentId ?? "",
            } as BookmarkSearchResult)
        );
      resolve(foundBookmarks);
    });
  });
};

const searchHistory = async (query: string): Promise<HistorySearchResult[]> => {
  return SearchEngine.fn(query);
};

const searchTabs = async (query: string): Promise<TabSearchResult[]> => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(
      {
        currentWindow: true,
      },
      (tabs) => {
        const foundTabs = tabs
          .filter(
            (tab) =>
              tab.url?.toLowerCase().includes(query.toLowerCase()) ||
              tab.title?.toLowerCase().includes(query.toLowerCase())
          )
          .map(
            (tab) =>
              ({
                id: tab.id ?? "",
                url: tab.url ?? "",
                title: tab.title,
                favicon: tab.favIconUrl,
                tabID: tab.id ?? 0,
              } as TabSearchResult)
          );
        resolve(foundTabs ?? []);
      }
    );
  });
};

export const handlers = {
  [IPC_EVENTS.OPEN_IN_NEW_TAB]: (payload: { url: string }) => {
    console.log("opening in new tab", payload.url);
    chrome.tabs.create({ url: payload.url });
  },

  // [IPC_EVENTS.RequestImage]: (payload: { url: string }, sender, sendResponse) => {
  [IPC_EVENTS.RequestImage]: (payload: { url: string }) => {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      img.crossOrigin = "Anonymous";
      img.src = payload.url;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.height = img.naturalHeight;
        canvas.width = img.naturalWidth;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        const dataURL = canvas.toDataURL();
        resolve(dataURL);
      };

      img.onerror = (error) => {
        reject(error);
      };
    });
  },
  [IPC_EVENTS.SWITCH_TO_TAB]: (payload: { tabID: string }) => {
    chrome.tabs.update(parseInt(payload.tabID), { active: true });
  },
  [IPC_EVENTS.TOGGLE_READERMODE]: (payload: { tabID: string }) => {
    // NOTE: this only works in firefox, aka the famous `my-machine`
    const thisBrowserType = getBrowserInfo();
    if (thisBrowserType == BrowserType.FIREFOX) {
      (chrome.tabs as any).toggleReaderMode(parseInt(payload.tabID));
    }
    console.error(
      "could not toggle reader mode. this is a firefox only feature for now"
    );
  },
  [IPC_EVENTS.SEARCH]: async (payload: {
    query: string;
  }): Promise<[SEARCH_TARGET, SearchResult[]]> => {
    const extractSearchQuery = (query: string) => {
      if (SEARCH_TARGET_REGEX.EITHER.test(query)) {
        const match = SEARCH_TARGET_REGEX.EITHER.exec(query);
        if (match) {
          return match[1];
        }
        return "";
      }
      return query;
    };

    const searchQuery = extractSearchQuery(payload.query);

    let resultType = SEARCH_TARGET.TAB;
    let fn: (query: string) => Promise<any[]> = searchTabs;

    if (SEARCH_TARGET_REGEX.HISTORY.test(payload.query)) {
      resultType = SEARCH_TARGET.HISTORY;
      fn = searchHistory;
    }
    if (SEARCH_TARGET_REGEX.BOOKMARK.test(payload.query)) {
      resultType = SEARCH_TARGET.BOOKMARK;
      fn = searchBookmarks;
    }
    if (SEARCH_TARGET_REGEX.TAB.test(payload.query)) {
      resultType = SEARCH_TARGET.TAB;
      fn = searchTabs;
    }
    const results = await fn(searchQuery);

    return [resultType, results];
  },
  //   get tab by it's title or such
  [IPC_EVENTS.EXT_SETTING_GET]: (): Promise<Settings> => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(STORAGE_KEYS.SETTINGS, (result) => {
        console.log({ result });
        if (
          Object.keys(result).length > 0 &&
          result[STORAGE_KEYS.SETTINGS] !== undefined
        ) {
          resolve(result[STORAGE_KEYS.SETTINGS] as Settings);
        } else {
          resolve(defaultSettings);
        }
      });
    });
  },
  [IPC_EVENTS.EXT_SETTING_SET]: (payload: Settings) => {
    return new Promise((resolve, reject) => {
      const obj: {
        [key: string]: Settings;
      } = {};

      obj[STORAGE_KEYS.SETTINGS] = payload;

      const newIcon = payload.Enabled ? "/icon-16.png" : "/icon-gray.png";
      console.debug("setting new image icon: ", newIcon);
      chrome.browserAction.setIcon({
        path: {
          "16": newIcon,
          "32": newIcon,
          "48": newIcon,
          "128": newIcon,
        },
      });

      chrome.storage.local.set(obj, () => {
        // save successful, now inform all tabs to update their settings
        console.log("saved settings, now updating tabs");
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id ?? 0, {
              type: "SETTINGS_UPDATE",
              payload: payload,
            });
          });
        });
        resolve(true);
      });
    });
  },
  [IPC_EVENTS.EXT_WEB_SETTING_GET]: (url: string): Promise<WebsiteSettings> => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(url, (result) => {
        if (Object.keys(result).length > 0) {
          resolve(result[url] as WebsiteSettings);
        } else {
          // not found, set to default settings for this webpage
          resolve(defaultWebSettings);
        }
      });
    });
  },
  [IPC_EVENTS.EXT_WEB_SETTING_SET]: (payload: EXT_WEB_SETTING_SET_REQUEST) => {
    return new Promise((resolve, reject) => {
      const obj: {
        [key: string]: WebsiteSettings;
      } = {
        [payload.url]: payload.setting,
      };
      chrome.storage.local.set(obj, () => {
        // save successful, now inform the same tab to update it's settings
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id ?? 0, {
              type: "SETTINGS_UPDATE_WEBSITE",
              payload: payload.setting,
            });
          });
        });
        resolve(true);
      });
    });
  },
};
