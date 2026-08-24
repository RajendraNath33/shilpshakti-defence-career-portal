import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

/* PWA: register the service worker after load so it never blocks first paint.
   Skipped on non-secure origins where the API is unavailable. */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const swUrl = new URL("sw.js", document.baseURI).href;
    navigator.serviceWorker.register(swUrl, { updateViaCache: 'none' }).then((reg) => reg.update()).catch(() => {
      /* registration unavailable (e.g. unsupported context) */
    });
  });
}
