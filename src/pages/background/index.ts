import { handlers } from "./events";
import { IPC_EVENTS } from "./types";

console.log("maybel oading bg script");

chrome.runtime.onMessage.addListener(
  async (
    message: {
      type: string;
      payload: any;
    },
    sender,
    sendResponse
  ) => {
    // console.log({
    //   message,
    //   type: message.type,
    //   includes: Object.keys(handlers).includes(message.type),
    // });

    let result: any = {
      error: "no handler for this event",
    };
    if (Object.keys(handlers).includes(message.type)) {
      const handler = handlers[message.type as keyof typeof handlers];
      if (handler) {
        result = await handler(message.payload);
        console.log({ result });
      }
    }
    const tabId = sender.tab?.id;
    if (!tabId) {
      console.log("no tab id");
      return;
    }

    if (message.type === IPC_EVENTS.RequestImage) {
      sendResponse(result);
      return result;
    }

    // sendResponse(result);
    chrome.tabs.sendMessage(tabId, {
      type: message.type,
      result,
    });
    // return result;
  }
);

// when settings changes, send it to all tabs ( content scripts )
// chrome.storage.onChanged.addListener(function (changes, namespace) {
//   // console.log({ changes, namespace })
//   for (const key in changes) {
//     console.log({ key });
//     if (key === "settings") {
//       const storageChange = changes[key];
//       console.log(`Storage key "${key}" in namespace "${namespace}" changed.
//                        Old value was "${storageChange.oldValue}",
//                        new value is "${storageChange.newValue}"`);
//     }
//   }
// });

// function storageOnChanged(changes: {
//   [key: string]: chrome.storage.StorageChange;
// }) {
//   console.log(changes); // {key : { newValue: 'value' }}
// }
// chrome.storage.session.onChanged.addListener(storageOnChanged);
