import { BubbleUI } from "../lib/bubble.js";
import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import { getIcon } from "../lib/icons.js";
import { IconBundle, MaterialIcons, SocialIcons } from "../model/enum/icons.js";

export default class TopBar {
	private static readonly ID = "top-bar";
	private static readonly LEFT_CONTAINER_ID = "left-container";
	private static readonly RIGHT_CONTAINER_ID = "right-container";

	private static instance: HTMLElement;
	private static title: HTMLElement;

	static create(name: string) {
		if (undefined != this.instance) {
			this.title.innerText = name;
			return this.instance;
		}

		this.instance = uiComponent({
			type: Html.Header,
			id: TopBar.ID,
			classes: [BubbleUI.BoxXBetween, BubbleUI.BoxYCenter],
		});

		const leftContainer = uiComponent({
			id: TopBar.LEFT_CONTAINER_ID,
			classes: [BubbleUI.BoxXStart],
		});
		this.instance.appendChild(leftContainer);

		const terminalIcon = getIcon(IconBundle.Material, MaterialIcons.Terminal);
		leftContainer.appendChild(terminalIcon);

		this.title = uiComponent({
			type: Html.H1,
			text: name,
		});
		leftContainer.appendChild(this.title);

		const rightContainer = uiComponent({
			id: TopBar.RIGHT_CONTAINER_ID,
			classes: [BubbleUI.BoxXEnd],
		});

		const githublIcon = getIcon(IconBundle.Social, SocialIcons.Github);
		rightContainer.appendChild(githublIcon);

		const folderIcon = getIcon(IconBundle.Material, MaterialIcons.Folder);
		rightContainer.appendChild(folderIcon);

		const addIcon = getIcon(IconBundle.Material, MaterialIcons.Add);
		rightContainer.appendChild(addIcon);

		this.instance.appendChild(rightContainer);

		return this.instance;
	}
}
