// import { BrowserType } from "@src/pages/background/types";
import { BrowserType } from "../../background/types";

const MAX_SIMILAR_SHORTCUTS = 9;
export const SUB_STRING_SIZE = 3;

export function base64ToBlobUrl(base64Data: string, contentType: string) {
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  const blobUrl = URL.createObjectURL(blob);
  return blobUrl;
}

export function generateUniqueSubstrings(sentences: string[]) {
  const substrings = new Map();
  const uniqueSubstrings = [];

  for (const sentence of sentences) {
    // Extract the first three letters of the sentence (lowercase for consistency)
    const substring = sentence.substring(0, SUB_STRING_SIZE).toLowerCase();

    if (!substrings.has(substring)) {
      // If the substring is not yet used, add it to the unique list and the map
      uniqueSubstrings.push(substring);
      substrings.set(substring, 1); // The value 1 indicates initial occurrence.
    } else {
      // Collision strategy (finding a unique variant)
      const variant = resolveCollision(substring, substrings);
      uniqueSubstrings.push(variant);
      substrings.set(variant, 1);
    }
  }

  return uniqueSubstrings;
}

// Collision resolution function
function resolveCollision(substring: string, substrings: Map<string, string>) {
  let i = 1;
  let variant;
  do {
    // Try appending a number to make it unique
    variant = substring + i;
    i++;
  } while (substrings.has(variant));
  return variant;
}

export class SubstringGenerator {
  substrings: Map<string, number>;

  constructor() {
    // 0 indicates initial occurrence.
    // 1 indicates first variant.
    this.substrings = new Map<string, number>();
  }

  generate(sentence: string) {
    const substring = sentence.substring(0, SUB_STRING_SIZE).toLowerCase();

    if (!this.substrings.has(substring)) {
      // If the substring is not yet used, add it to the map
      this.substrings.set(substring, 1); // The value 1 indicates initial occurrence.
      return substring;
    } else {
      // Collision strategy (finding a unique variant)
      const { variant, i: iter } = this.resolveCollision(substring);
      this.substrings.set(variant, iter);
      return variant;
    }
  }

  // generate(sentence: string) {
  //   // Extract the first three letters of the sentence (lowercase for consistency)
  //   const substring = sentence.substring(0, 3).toLowerCase();

  //   if (!this.substrings.has(substring)) {
  //     // If the substring is not yet used, add it to the map
  //     this.substrings.set(substring, 1); // The value 1 indicates initial occurrence.
  //     return substring;
  //   } else {
  //     // colision case
  //     const { variant, i: iter } = this.resolveCollision(substring);
  //     this.substrings.set(variant, 1);

  //     // if (iter == 0) {
  //     //   // add zero to original
  //     //   // this.substrings.set(variant, 1);
  //     //   this.substrings
  //     // }

  //     // Collision has been resolved, and the variant can be returned
  //     return variant;
  //   }
  // }

  // generate all from list of sentences
  // default substrings will be appeneded with 0, if there are more than one
  generateAll(sentences: string[]) {
    const uniqueSubstrings = [];
    for (const sentence of sentences) {
      uniqueSubstrings.push(this.generate(sentence));
    }
    return uniqueSubstrings;
  }

  resolveCollision(substring: string) {
    let i = 1;
    let variant;
    do {
      // Try appending a number to make it unique
      variant = substring + i;
      i++;
    } while (this.substrings.has(variant));
    return { variant, i };
  }
}

export const generateAllShortcuts = (
  sentences: string[],
  allowEmptyShortcuts = true
): string[] => {
  const substrings = new Map<string, number[]>();

  sentences.forEach((sentence, iter) => {
    let shortcut = sentence.slice(0, SUB_STRING_SIZE).toLowerCase();

    // If there is no content or the shortcut already exists, assign a random unique shortcut
    if (allowEmptyShortcuts && !shortcut.length) {
      do {
        shortcut = Math.random()
          .toString(36)
          .substr(2, SUB_STRING_SIZE)
          .toLowerCase();
      } while (substrings.has(shortcut)); // Ensure the shortcut is unique
    }

    if (substrings.has(shortcut)) {
      substrings.get(shortcut)?.push(iter);
    } else {
      substrings.set(shortcut, [iter]);
    }
  });

  const retVal = new Array<string>(sentences.length);

  for (const [shortcut, originalIDX] of substrings) {
    // console.log(shortcut, originalIDX)
    const hasMultiple = originalIDX.length > 1;
    const appendIndex = hasMultiple;

    originalIDX.forEach((idx, itr) => {
      // if (itr > MAX_SIMILAR_SHORTCUTS) return;
      if (appendIndex) {
        retVal[idx] = shortcut + itr;
        return;
      }
      retVal[idx] = shortcut;
    });
  }
  return retVal;
};

// credits: https://stackoverflow.com/a/41820692/9977636
// this fails for firefox-nightly, my primary browser
// TODO: replace with a better solution
export const getBrowserInfo = () => {
  // Opera 8.0+ (tested on Opera 42.0)
  const isOpera =
    (!!(window as any).opr && !!(opr as any).addons) ||
    !!(window as any).opera ||
    navigator.userAgent.indexOf(" OPR/") >= 0;

  // Firefox 1.0+ (tested on Firefox 45 - 53)
  const isFirefox = typeof (InstallTrigger as any) !== "undefined";

  // Internet Explorer 6-11
  //   Untested on IE (of course). Here because it shows some logic for isEdge.
  const isIE = /*@cc_on!@*/ false || !!(document as any).documentMode;

  // Edge 20+ (tested on Edge 38.14393.0.0)
  const isEdge = !isIE && !!(window as any).StyleMedia;

  // Chrome 1+ (tested on Chrome 55.0.2883.87)
  // This does not work in an extension:
  //const isChrome = !!window.chrome && !!window.chrome.webstore;
  // The other browsers are trying to be more like Chrome, so picking
  // capabilities which are in Chrome, but not in others is a moving
  // target.  Just default to Chrome if none of the others is detected.
  const isChrome = !isOpera && !isFirefox && !isIE && !isEdge;

  // Blink engine detection (tested on Chrome 55.0.2883.87 and Opera 42.0)
  const isBlink = (isChrome || isOpera) && !!window.CSS;

  if (isChrome) return BrowserType.CHROME;
  if (isFirefox) return BrowserType.FIREFOX;

  if (isIE) return BrowserType.OTHER;
  if (isEdge) return BrowserType.OTHER;
  if (isOpera) return BrowserType.OTHER;
  if (isBlink) return BrowserType.OTHER;
};

export const faviconURL = (url: string, isFavicon = false) => {
  if (url && isFavicon) return url;

  const _ = new URL(url);

  return `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&size=32&url=https://${_.hostname}`;
};
