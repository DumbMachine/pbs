import React, { Fragment, useState } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "../content/image";

import { useDebouncedCallback } from "use-debounce";

import clsx from "clsx";
import {
  IPC_EVENTS,
  SearchResult,
  HistorySearchResult,
  TabSearchResult,
  BookmarkSearchResult,
} from "../background/types";
import { SEARCH_TARGET } from "../background/constantines";

interface IPalleteMode {
  id: string;
  // activation key combination
  key: string;
  title: string;
  placeholder?: string;
  description: string;

  // returns search results in a valid schema
  // TODO: define simple schema for this shite
  searchFN?: (query: string) => Promise<void>;
}

const searchBrowserArtificats = async (query: string) => {
  chrome.runtime
    .sendMessage({
      // type: EV_TYPES.HISTORY_SEARCH,
      type: IPC_EVENTS.SEARCH,
      payload: { query: query },
    })
    .catch((err) => {
      // background script not ready
      console.debug({ err });
    });
  return;
};

export default function Example({
  _open,
  close,
}: {
  _open: boolean;
  close: () => void;
}) {
  const palleteModes: IPalleteMode[] = [
    {
      id: "default-search",
      key: "",
      title: "",
      placeholder: "Search or jump to...",
      description:
        "Search all of omnibar to switch to modes using keys like [?, #, !]",
      searchFN: searchBrowserArtificats,
    },
    {
      id: "search-tabs",
      key: "@",
      title: "Active Tabs",
      placeholder: "Search active tabs",
      description:
        "Search active tab titles and other meta. Fuzzy search supported",
      searchFN: searchBrowserArtificats,
    },
    {
      id: "search-history",
      key: "!",
      title: "History",
      description: "Search tabs only from history",
      searchFN: searchBrowserArtificats,
    },
    {
      id: "help",
      key: "?",
      title: "Modes",
      description: "Type `?` for helps and tips",
      searchFN: (query: string) => {
        const defaultResults: SearchResult[] = [
          {
            id: "1",
            title: "Help Message",
            url: "#",
            secondary: "Use ? for this help message",
            favicon: "",
          },
          {
            id: "2",
            title: "Search tabs",
            url: "#",
            secondary: "Search tabs active using @",
            favicon: "",
          },
        ];
        return new Promise((_) => {
          return;
          // const res = defaultResults.filter((result) => {
          //   return result.title.includes(query) || result.url.includes(query);
          // });
          // setSearchResults({
          //   loading: false,
          //   results: res,
          // });
        });
      },
    },
  ];
  const [todo, setTodo] = useState<{
    CSP_BLOCKED: boolean;
  }>({
    CSP_BLOCKED: false,
  });
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = React.useState<{
    loading: boolean;
    resultType: SEARCH_TARGET;
    results: SearchResult[];
  }>({
    loading: false,
    resultType: SEARCH_TARGET.HISTORY,
    results: [],
  });

  const [activeResult, setActiveResult] = React.useState(0);

  React.useEffect(() => {
    setOpen(_open);
  }, [_open]);

  const handleInput = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // if this key is the first value and
      // matches to a corresponding mode, then update mode
      const isValidEvent: boolean =
        (event.target && event.target?.value) != undefined;

      // if valid key event, update else ignore
      if (!isValidEvent) return;

      const currentQuery = event.target.value;

      if (event?.target.value) {
        setQuery(currentQuery);
      }

      if (currentQuery == "") {
        // reset to default mode
        setSearchResults({
          loading: false,
          resultType: SEARCH_TARGET.HISTORY,
          results: [],
        });
        return;
      }

      searchBrowserArtificats(currentQuery);

      // // this is not a mode update query
      // // instead provide the query to the active mode as the search query
      // if (mode.activeMode?.searchFN) {
      //   mode.activeMode?.searchFN(currentQuery).then((results) => {
      //     setSearchResults({
      //       loading: false,
      //       results: results,
      //     });
      //   });
      // }
    },
    300
  );

  React.useEffect(() => {
    // on close, reset search results
    if (!open)
      setSearchResults({
        loading: false,
        resultType: SEARCH_TARGET.HISTORY,
        results: [],
      });
  }, [open]);

  React.useEffect(() => {
    // // checking csp
    // const csp_check_url =
    //   "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://news.ycombinator.com/";
    // const cspCheckImage = new Image();
    // cspCheckImage.src = csp_check_url;
    // console.log("checking csp");
    // cspCheckImage.onerror = () => {
    //   console.log("CSP BLOCKED");

    //   setTodo({
    //     ...todo,
    //     CSP_BLOCKED: true,
    //   });
    // };

    const handler = (response: {
      type: string;
      result: [SEARCH_TARGET, HistorySearchResult[]];
    }) => {
      // console.log({ response });

      if (response.type == IPC_EVENTS.SEARCH) {
        const [target, results] = response.result;
        setSearchResults({
          loading: false,
          resultType: target,
          results: results,
        });
        // const {
        //   result,
        // }: {
        //   result: HistorySearchResult[];
        // } = response;
        // setSearchResults({
        //   loading: false,
        //   results: result.map((res) => ({
        //     key: res.id,
        //     name: res.title,
        //     description: res.url,
        //     secondary: `${res.lastVisitTime} (${res.visitCount})`,
        //   })),
        // });
        // }
        // if (response.type == EV_TYPES.TAB_SEARCH) {
        //   setSearchResults({
        //     loading: false,
        //     // @ts-ignore
        //     results: response.result,
        //   });
      }
    };

    chrome.runtime.onMessage.addListener(handler);

    return () => {
      chrome.runtime.onMessage.removeListener(handler);
    };
  }, []);

  return (
    <Transition.Root
      show={open}
      as={Fragment}
      afterLeave={() => setQuery("")}
      appear
    >
      <Dialog
        as="div"
        id="shorty-app"
        className="tw-relative tw-z-100000"
        onClose={(val) => {
          setQuery("");
          setOpen(val);
          close();
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="tw-ease-out tw-duration-300"
          enterFrom="tw-opacity-0"
          enterTo="tw-opacity-100"
          leave="tw-ease-in tw-duration-200"
          leaveFrom="tw-opacity-100"
          leaveTo="tw-opacity-0"
        >
          <div className="tw-fixed tw-inset-0 tw-bg-gray-500 tw-bg-opacity-25 tw-transition-opacity" />
        </Transition.Child>

        <div className="tw-fixed tw-inset-0 tw-z-10 tw-w-screen tw-overflow-y-auto tw-p-1/2 sm:tw-p-6 md:tw-p-20">
          <Transition.Child
            as={Fragment}
            enter="tw-ease-out tw-duration-300"
            enterFrom="tw-opacity-0 tw-scale-95"
            enterTo="tw-opacity-100 tw-scale-100"
            leave="tw-ease-in tw-duration-200"
            leaveFrom="tw-opacity-100 tw-scale-100"
            leaveTo="tw-opacity-0 tw-scale-95"
          >
            {/* <Dialog.Panel className="tw-mx-auto tw-max-w-xl tw-transform tw-divide-y tw-divide-gray-100 tw-overflow-hidden tw-rounded-xl tw-shadow-2xl tw-ring-1 tw-ring-black tw-ring-opacity-5 tw-transition-all"> */}
            <Dialog.Panel className="tw-mx-auto tw-max-w-2xl tw-transform tw-divide-y tw-divide-gray-500 tw-divide-opacity-10 tw-overflow-hidden tw-rounded-xl tw-bg-opacity-80 tw-bg-primary tw-shadow-2xl tw-ring-2 tw-ring-accent tw-ring-opacity-50 tw-backdrop-blur-xl tw-backdrop-filter tw-transition-all">
              <Combobox
                onChange={(event: SearchResult) => {
                  console.log("event", {
                    event,
                    rtype: searchResults.resultType,
                  });
                  switch (searchResults.resultType) {
                    case SEARCH_TARGET.TAB:
                      switchToTab((event as TabSearchResult).tabID);
                      close();
                      break;
                    case SEARCH_TARGET.BOOKMARK:
                    case SEARCH_TARGET.HISTORY:
                      console.log("open in current tab", event);
                      openInCurrentTab(event.url);
                      close();
                      break;
                    default:
                      console.log("some search result clicked", event);
                  }
                  // clear
                  setSearchResults({
                    loading: false,
                    resultType: SEARCH_TARGET.HISTORY,
                    results: [],
                  });
                }}
              >
                <div className="tw-relative tw-flex tw-flex-row tw-bg-opacity-90 tw-rounded-md tw-p-2 tw-items-center tw-h-12 tw-gap-x-2">
                  <div className="tw-w-7 tw-items-center tw-flex tw-justify-center">
                    <MagnifyingGlassIcon
                      // className="tw-pointer-events-none tw-absolute tw-left-4 tw-top-3.5 tw-h-5 tw-w-5 tw-text-gray-400 tw-items-center tw-bg-red-300"
                      className="tw-pointer-events-none tw-h-5 tw-w-5 tw-text-gray-400"
                      aria-hidden="true"
                    />
                  </div>

                  <Combobox.Input
                    className="tw-w-full tw-border-0 tw-bg-transparent tw-pl-2 tw-pr-4 tw-text-white placeholder:tw-text-gray-400 focus:tw-ring-0 focus:tw-outline-none sm:tw-text-sm tw-outline-none tw-ring-0"
                    // placeholder={mode.activeMode.placeholder}
                    onChange={handleInput}
                    // onKeyDown={(event) => {
                    //   const isEnter = event.key == "Enter";
                    //   const isCmdEnter = event.key == "Enter" && event.metaKey;

                    //   if (isCmdEnter) {
                    //     console.log("cmd+enter pressed");
                    //     return;
                    //   }

                    //   if (isEnter) {
                    //     console.log("enter pressed");
                    //     return;
                    //   }
                    // }}
                  />
                </div>

                <Combobox.Options
                  tw-static
                  className="tw-max-h-80 scroll-py-2 tw-divide-y tw-divide-gray-500 tw-divide-opacity-10 tw-overflow-y-auto"
                >
                  {searchResults.results && (
                    <ul>
                      {searchResults.results.map((result) => {
                        return (
                          <Combobox.Option
                            key={result.id}
                            value={result}
                            className={({ active }) =>
                              clsx(
                                // "tw-cursor-default tw-select-none tw-px-4 tw-py-2",
                                // active && "tw-bg-indigo-600 tw-text-white"
                                "tw-flex tw-cursor-default tw-select-none tw-items-center tw-rounded-md",
                                // active && "tw-bg-gray-400 tw-bg-opacity-5 tw-text-gray-400"
                                active && "bg-slate-700 tw-bg-opacity-80"
                              )
                            }
                            // onClick={(event) => {
                            //   console.log("event");
                            //   openInCurrentTab(result.url);
                            // }}
                            // onFocus={(event) => {
                            //   console.log("you focussed on me", result.url);
                            // }}
                          >
                            <li className="tw-flex tw-cursor-default tw-select-none tw-rounded-xl tw-px-3 tw-py-2">
                              {searchResults.resultType == SEARCH_TARGET.TAB &&
                                renderTabResult(result as TabSearchResult)}

                              {searchResults.resultType ==
                                SEARCH_TARGET.HISTORY &&
                                renderHistoryResult(
                                  result as HistorySearchResult
                                )}

                              {searchResults.resultType ==
                                SEARCH_TARGET.BOOKMARK &&
                                renderBookmarkResult(
                                  result as BookmarkSearchResult
                                )}
                            </li>
                          </Combobox.Option>
                        );
                      })}
                    </ul>
                  )}
                </Combobox.Options>
                {searchResults.results && searchResults.results.length != 0 ? (
                  //
                  <div className="tw-flex tw-flex-wrap tw-items-center tw-px-4 tw-py-2.5 tw-text-xs tw-text-white">
                    Navigate with <CoolKBD>↑</CoolKBD> <CoolKBD>↓</CoolKBD> |
                    <CoolKBD>↵</CoolKBD> to open |
                    {/* <CoolKBD>⌘</CoolKBD>{" "}<CoolKBD>↵</CoolKBD> to open in new tab | */}
                    <CoolKBD>
                      <span className="tw-text-lg">␛</span>
                    </CoolKBD>{" "}
                    to close
                  </div>
                ) : (
                  <div className="tw-flex tw-flex-wrap tw-items-center tw-px-4 tw-py-2.5 tw-text-xs tw-text-gray-300">
                    Type{" "}
                    <kbd
                      className={clsx(
                        "tw-mx-1 tw-flex tw-h-5 tw-w-5 tw-items-center tw-justify-center tw-rounded tw-border tw-bg-white tw-font-semibold sm:tw-mx-2",
                        query.startsWith("/h")
                          ? "tw-border-indigo-600 tw-text-indigo-600"
                          : "tw-border-gray-400 tw-text-gray-900"
                      )}
                    >
                      /h
                    </kbd>{" "}
                    <span className="">for history,</span>
                    <kbd
                      className={clsx(
                        "tw-mx-1 tw-flex tw-h-5 tw-w-5 tw-items-center tw-justify-center tw-rounded tw-border tw-bg-white tw-font-semibold sm:tw-mx-2",
                        query.startsWith("/h")
                          ? "tw-border-indigo-600 tw-text-indigo-600"
                          : "tw-border-gray-400 tw-text-gray-900"
                      )}
                    >
                      /b
                    </kbd>{" "}
                    <span className="">for bookmarks,</span>
                    <kbd
                      className={clsx(
                        "tw-mx-1 tw-flex tw-h-5 tw-w-5 tw-items-center tw-justify-center tw-rounded tw-border tw-bg-white tw-font-semibold sm:tw-mx-2",
                        query.startsWith("/h")
                          ? "tw-border-indigo-600 tw-text-indigo-600"
                          : "tw-border-gray-400 tw-text-gray-900"
                      )}
                    >
                      /t
                    </kbd>{" "}
                    <span className="">for tabs</span>
                  </div>
                )}
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

const CoolKBD: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <kbd className="tw-mx-2 tw-flex tw-h-5 tw-w-5 tw-items-center tw-justify-center tw-rounded tw-border tw-bg-slate-900 tw-text-white tw-font-thin">
      {children}
    </kbd>
  );
};

const openInNewTab = (url: string) => {
  chrome.runtime.sendMessage({
    type: IPC_EVENTS.OPEN_IN_NEW_TAB,
    payload: { url: url },
  });
};
const openInCurrentTab = (url: string) => {
  chrome.runtime.sendMessage({
    // type: IPC_EVENTS.OPEN_IN_CURRENT_TAB,
    type: IPC_EVENTS.OPEN_IN_NEW_TAB,
    payload: { url: url },
  });
};

const renderTabResult = (result: TabSearchResult) => {
  return (
    <>
      <div className="tw-flex tw-h-10 tw-w-10 tw-flex-none tw-items-center tw-justify-center tw-rounded-lg">
        {result.favicon ? (
          <Image src={result.favicon} />
        ) : (
          <svg
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
              d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
            />
          </svg>
        )}
      </div>
      <div className="tw-ml-4 tw-flex-auto">
        <p className="tw-text-sm tw-font-medium tw-text-gray-200 text-ellipsis">
          {result.title}
        </p>
        <p className="tw-text-sm tw-text-gray-400">{result.url}</p>
      </div>
    </>
  );
};

const renderHistoryResult = (result: HistorySearchResult) => {
  return (
    <>
      <div className="tw-flex tw-h-10 tw-w-10 tw-flex-none tw-items-center tw-justify-center tw-rounded-lg">
        {result.favicon ? (
          <Image
            src={result.favicon}
            className="tw-h-8 tw-w-8 tw-flex-none tw-items-center"
          />
        ) : (
          <svg
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
              d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
            />
          </svg>
        )}
      </div>
      <div className="tw-ml-4 tw-flex-auto">
        <p className="tw-text-sm tw-font-medium tw-text-gray-200 text-ellipsis">
          {result.title}
          <span className="tw-pl-4 tw-text-xs tw-text-gray-400">
            {/* / {result.visitCount} */}( {result.lastVisitTime} )
          </span>
        </p>
        <p className="tw-text-sm tw-text-gray-400">{result.url}</p>
      </div>
    </>
  );
};

const renderBookmarkResult = (result: BookmarkSearchResult) => {
  return (
    <>
      <div className="tw-flex tw-h-10 tw-w-10 tw-flex-none tw-items-center tw-justify-center tw-rounded-lg">
        {/* TODO: CSP tw-blocks img-src on many websites. Detect and fallback */}
        {result.favicon ? (
          <Image
            src={result.favicon}
            className="tw-h-8 tw-w-8 tw-flex-none tw-items-center"
          />
        ) : (
          <svg
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
              d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
            />
          </svg>
        )}
      </div>
      <div className="tw-ml-4 tw-flex-auto">
        <p className="tw-text-sm tw-font-medium tw-text-gray-200 text-ellipsis">
          {result.title}
          <span className="tw-pl-4 tw-text-xs tw-text-gray-400">
            / {result.folderTitle}
          </span>
        </p>
        <p className="tw-text-sm tw-text-gray-400">{result.secondary}</p>
      </div>
    </>
  );
};

const switchToTab = (tabID: number) => {
  chrome.runtime.sendMessage({
    type: IPC_EVENTS.SWITCH_TO_TAB,
    payload: { tabID: tabID },
  });
};
