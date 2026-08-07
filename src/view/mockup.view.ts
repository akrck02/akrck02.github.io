import { BubbleUI } from "../lib/bubble.js";
import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import { getIcon } from "../lib/icons.js";
import { IconBundle, MaterialIcons } from "../model/configurations/icons.js";
import { getWebUrl } from "../service/path.service.js";
import { setOpaqueBackground } from "../service/ui.service.js";

export interface MockupConfig {
  id: string;
  route: string;
  icon: MaterialIcons;
  title: string;
  description: string;
}

export function createMockupView(config: MockupConfig) {
  return async function (parameters: string[], container: HTMLElement) {
    setOpaqueBackground();

    const view = uiComponent({
      type: Html.View,
      id: config.id,
      classes: [BubbleUI.BoxColumn, BubbleUI.BoxCenter]
    });

    const homeButton = uiComponent({
      type: Html.Button,
      id: "home-button",
      classes: [BubbleUI.BoxCenter]
    });
    homeButton.innerHTML = `<span class="msr">home</span>`;
    homeButton.onclick = () => (location.href = getWebUrl("#/"));
    view.appendChild(homeButton);

    const icon = uiComponent({
      id: "mockup-icon",
      classes: [BubbleUI.BoxCenter]
    });
    icon.innerHTML = getIcon(IconBundle.Material, config.icon, "72px").outerHTML;
    view.appendChild(icon);

    const title = uiComponent({
      type: Html.H1,
      id: "mockup-title",
      text: config.title
    });
    view.appendChild(title);

    const description = uiComponent({
      type: Html.P,
      id: "mockup-description",
      text: config.description
    });
    view.appendChild(description);

    const badge = uiComponent({
      id: "mockup-badge",
      text: "Coming soon"
    });
    view.appendChild(badge);

    container.appendChild(view);
  };
}
