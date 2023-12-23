import { createRoot } from "react-dom/client";
import { Component } from "./app";

// For some reason, on firefox the styles load just fine. Being scoped to shorty-app
import "./style.css";

// // On chrome, scoped styles don't work. So we have to import the tailwind styles
// import "@assets/styles/tailwind.css";
import { AppContextProvider } from "../popup/context";

const div = document.createElement("div");
div.id = "__root";
document.body.appendChild(div);

const rootContainer = document.querySelector("#__root");
if (!rootContainer) throw new Error("Can't find Options root element");
const root = createRoot(rootContainer);
root.render(
  // <div className="absolute bottom-0 left-0 text-lg text-black bg-amber-400 z-50">
  //   content script loaded
  // </div>
  <AppContextProvider>
    <Component />
  </AppContextProvider>
);

// try {
//   console.log("content script loaded");
// } catch (e) {
//   console.error(e);
// }
