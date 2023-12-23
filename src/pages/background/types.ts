// export type HistorySearchResult = {
//   id: string;
//   title: string;
//   url: string;
//   visitCount: number;
//   lastVisitTime: string;
// };

export interface SearchResult {
  id: string;
  url: string;
  title: string;
  favicon: string;
  secondary?: string;
}

export interface TabSearchResult extends SearchResult {
  tabID: number;
}

export interface BookmarkSearchResult extends SearchResult {
  bookmarkID: string;
  folderID: string;
  folderTitle: string;
}

export interface HistorySearchResult extends SearchResult {
  visitCount: number;
  lastVisitTime: string;
}

export enum IPC_EVENTS {
  OPEN_IN_NEW_TAB = "OPEN_IN_NEW_TAB",
  OPEN_IN_CURRENT_TAB = "OPEN_IN_CURRENT_TAB",

  SEARCH = "SEARCH",

  // toggle reader-mode on the current document.
  // onlys supported on firefox
  TOGGLE_READERMODE = "TOGGLE_READERMODE",

  // Switch to different tab by tabID
  SWITCH_TO_TAB = "SWITCH_TO_TAB",

  EXT_SETTING_GET = "get_extension_setting",
  EXT_SETTING_SET = "set_extension_setting",

  EXT_WEB_SETTING_GET = "get_website_setting",
  EXT_WEB_SETTING_SET = "set_website_setting",

  // Due to CSP, we cannot request images from the content script.
  RequestImage = "RequestImage",
}

export enum BrowserType {
  CHROME = "chrome",
  FIREFOX = "firefox",
  SAFARI = "safari",
  OTHER = "other",
}
