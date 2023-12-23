// import * as utils from "./utils";

// // const hasScroll = function (el, direction, barSize) {
// //   const offset =
// //     direction === "y" ? ["scrollTop", "height"] : ["scrollLeft", "width"];
// //   const result = el[offset[0]];

// //   if (result < barSize) {
// //     // set scroll offset to barSize, and verify if we can get scroll offset as barSize
// //     const originOffset = el[offset[0]];
// //     el[offset[0]] = el.getBoundingClientRect()[offset[1]];
// //     result = el[offset[0]];
// //     if (result !== originOffset) {
// //       // this is valid for some site such as http://mail.live.com/
// //       suppressScrollEvent++;
// //     }
// //     el[offset[0]] = originOffset;
// //   }
// //   return result >= barSize;
// // };

// const getScrollableElements = () => {
//   const nodes = utils.listElements(
//     document.body,
//     NodeFilter.SHOW_ELEMENT,
//     function (n: HTMLElement) {
//       return (
//         (Mode.hasScroll(n, "y", 16) && n.scrollHeight > 200) ||
//         (Mode.hasScroll(n, "x", 16) && n.scrollWidth > 200)
//       );
//     }
//   );
//   nodes.sort(function (a: HTMLElement, b: HTMLElement) {
//     if (b.contains(a)) return 1;
//     else if (a.contains(b)) return -1;
//     return b.scrollHeight * b.scrollWidth - a.scrollHeight * a.scrollWidth;
//   });
//   // document.scrollingElement will be null when document.body.tagName === "FRAMESET", for example http://www.knoppix.org/
//   if (
//     document.scrollingElement &&
//     (document.scrollingElement.scrollHeight > window.innerHeight ||
//       document.scrollingElement.scrollWidth > window.innerWidth)
//   ) {
//     nodes.unshift(document.scrollingElement);
//   }
//   return nodes;
// };
export function getScrollParent(element: HTMLElement, includeHidden: boolean) {
  const style = getComputedStyle(element);
  const excludeStaticParent = style.position === "absolute";
  const overflowRegex = includeHidden
    ? /(auto|scroll|hidden)/
    : /(auto|scroll)/;

  if (style.position === "fixed") return document.body;
  for (
    let parent: HTMLElement | null = element;
    (parent = parent.parentElement);

  ) {
    const style = getComputedStyle(parent);
    if (excludeStaticParent && style.position === "static") {
      continue;
    }
    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX))
      return parent;
  }

  return document.body;
}
