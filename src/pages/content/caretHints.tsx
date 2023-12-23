import React from "react";

import * as utils from "./utils";
import { createRoot } from "react-dom/client";

export const useCaretHints = (): React.MutableRefObject<{
  hints: {
    shortcut: string;
    action: () => void;
  }[];
}> => {
  console.log("caretting things");
  const bodyRect = document.body.getBoundingClientRect();

  const items = (utils.getTextNodes(document.body, /./) as HTMLElement[])
    .slice(0, 100)
    .map((elm) => {
      const container = document.createElement("div");
      const root = createRoot(container);
      document.body.appendChild(container);

      // const r = utils.getRealRect(elm);
      //   const r = elm.parentElement?.getBoundingClientRect();
      const r = utils.getTextNodePos(elm);

      const childNodes = Array.from(elm.childNodes);

      // const zIndex = utils.getRealZIndex(elm);

      if (!r) return null;

      const item = {
        text: elm.textContent?.toLowerCase().slice(0, 3) ?? "",
        rect: {
          left: Math.max(r.left - bodyRect.x, 0),
          top: Math.max(r.top - bodyRect.y, 0),
          right: Math.min(r.right - bodyRect.x, document.body.clientWidth),
          bottom: Math.min(r.bottom - bodyRect.y, document.body.clientHeight),
        },
      };

      root.render(
        <div
          id="shorty-app"
          // className="tw-outline-none tw-border-2 tw-border-red-500"
          style={{
            position: "tw-absolute",
            left: item.rect.left + "px",
            top: item.rect.top + "px",
            width: item.rect.right - item.rect.left + "px",
            height: item.rect.bottom - item.rect.top + "px",
            pointerEvents: "none",
            zIndex: 9147483647,
          }}
        >
          <kbd
            id="hint"
            className="tw-flex text-[10px] tw-z-50 tw-justify-center tw-items-center tw-bg-transparent"
          >
            {/* <kbd id="hint" className="tw-flex tw-text-xs tw-z-50 tw-justify-center tw-items-center"> */}
            {/* <span className="tw-flex tw-text-black tw-bg-white"> */}
            <span className="tw-flex tw-font-semibold tw-text-black bg-[#fbbd23] tw-border tw-rounded-md">
              {item.text}
            </span>
          </kbd>
        </div>
      );

      return null;

      return {
        // yy: xxxx(elm),
        element: elm,
        // text: genShortcut.generate(isValidTextContent(elm).toLowerCase()),
        //   text: isValidTextContent(elm).toLowerCase(),
      };
    });

  return React.useRef({
    hints: [],
    // hints: items.map((item) => ({
    //   shortcut: utils.getShortcutOfElement(item),
    //   action: () => {
    //     item.focus();
    //     utils.setCaretPosition(item, utils.getCaretPosition(item) + 1);
    //   },
    // })),
  });
};
