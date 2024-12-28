import CMS from "decap-cms-app";
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

CMS.init();
CMS.registerEditorComponent({
  id: "youtube",
  label: "Youtube",
  fields: [
    {
      name: "id",
      label: "Youtube Video ID",
      widget: "string",
    },
  ],
  pattern: /{{< youtube\s+(?<id>[A-Za-z0-9-]+)\s+>}}/,
  fromBlock: function (match) {
    return {
      id: match[1],
    };
  },
  toBlock: function (obj) {
    return `{{< youtube ${obj.id} >}}`;
  },
  toPreview: function (obj) {
    return `<img src="https://i3.ytimg.com/vi/${obj.id}/hqdefault.jpg" alt="Youtube Video"/>`;
  },
});

const root = createRoot(document.getElementById("publish-helpers")!);

window.addEventListener("message", listener(root));

root.render(
  <StrictMode>
    <PublisherToolbar />
  </StrictMode>
);
