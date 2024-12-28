import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
import PublisherToolbar, { PublisherToolbarProps } from "./components/toolbar";

const messagePrefix = "authorization:github:success:";

const listener = (root: Root) => (e: MessageEvent<string>) => {
  if (e && typeof e.data === "string" && e.data.indexOf(messagePrefix) === 0) {
    const props = JSON.parse(
      e.data.substring(messagePrefix.length)
    ) as PublisherToolbarProps;
    window.removeEventListener("message", listener(root));

    root.render(
      <StrictMode>
        <PublisherToolbar {...props} />
      </StrictMode>
    );
  }
};



const root = createRoot(document.getElementById("publish-helpers")!);

window.addEventListener("message", listener(root));

root.render(
  <StrictMode>
    <PublisherToolbar />
  </StrictMode>
);
