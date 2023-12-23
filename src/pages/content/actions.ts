import { getScrollParent } from "./scroll";

enum ScrollDirection {
  UP,
  DOWN,
}
/**
 * Scroll by a given amount
 * @param payload The amount to scroll by
 *
 **/
const scrollElement = (
  element: HTMLElement,
  direct: ScrollDirection,
  payload: number
) => {
  const scrollArg: ScrollToOptions = {
    top: 0,
    behavior: "smooth",
    // top: element.scrollTop,
  };
  if (direct === ScrollDirection.UP) {
    scrollArg.top = element.scrollTop - payload;
  } else {
    scrollArg.top = element.scrollTop + payload;
  }
  return element.scrollTo(scrollArg);
};

/**
 * Scroll to top
 */
const scrollToTop = (element: HTMLElement) => {
  //   const scrollArg: ScrollToOptions = { behavior: "smooth", top: 0 };
  //   return element.scrollTo(scrollArg);
  return scrollElement(
    document.scrollingElement as HTMLElement,
    ScrollDirection.UP,
    document.scrollingElement?.scrollHeight ?? 0
  );
};

/**
 * Scroll to bottom
 */
const scrollToBottom = (element: HTMLElement) => {
  //   const scrollArg: ScrollToOptions = { behavior: "smooth", top: 0 };
  //   return element.scrollTo(scrollArg);
  return scrollElement(
    document.scrollingElement as HTMLElement,
    ScrollDirection.DOWN,
    // element.scrollHeight
    document.scrollingElement?.scrollHeight ?? element.scrollHeight
  );
};

// Scroll by a full page
function scrollByFullPage(element: HTMLElement) {
  // Get the height of the viewport
  const viewportHeight = window.innerHeight || element.clientHeight;

  // Scroll by the height of the viewport
  return scrollElement(element, ScrollDirection.DOWN, viewportHeight);
}

// Scroll by half a page
function scrollByHalfPage(element: HTMLElement) {
  // Get the height of the viewport
  const viewportHeight = (window.innerHeight || element.clientHeight) / 2;
  return scrollElement(element, ScrollDirection.DOWN, viewportHeight);
}

const documentReload = () => {
  window.location.reload();
};

const goBackInHistory = () => {
  window.history.back();
};

const goForwardInHistory = () => {
  window.history.forward();
};

// Booksmarks
const addBookmark = (
  bookmark: string,
  url: string,
  title?: string,
  parentFolder?: string // omit for root node
) => {
  if (!title) {
    // TODO: get title from url
    title = url;
  }

  return chrome.bookmarks.create({
    parentId: parentFolder,
    title,
    url,
  });
};

// disable the whole app
const disablePlaceholder = () => {
  return;
};

const disablePlaceholderFor = (url: string) => {
  return;
};

export const Actions = {
  scrollElement,
  scrollUpALittle: (element: HTMLElement) => {
    let scrollNode = document.scrollingElement;
    if (!document.scrollingElement) {
      console.debug("no scrolling element found, defaulting to body");
      scrollNode = element;
    }
    scrollElement(scrollNode as HTMLElement, ScrollDirection.UP, 100);
  },
  scrollDownALittle: (element: HTMLElement) => {
    let scrollNode = document.scrollingElement;
    if (!document.scrollingElement) {
      console.debug("no scrolling element found, defaulting to body");
      scrollNode = element;
    }
    scrollElement(scrollNode as HTMLElement, ScrollDirection.DOWN, 100);
  },
  scrollToTop,
  scrollToBottom,
  scrollByFullPage,
  scrollByHalfPage,
  documentReload,
  goBackInHistory,
  goForwardInHistory,
  ScrollDirection,

  // Bookmarks
  addBookmark,
};
