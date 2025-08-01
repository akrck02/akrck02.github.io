import Animations from "../lib/animations.js";
import { BubbleUI } from "../lib/bubble.js";
import { getConfiguration, setConfiguration } from "../lib/configuration.js";
import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import { getIcon } from "../lib/icons.js";
import { AppConfigurations } from "../model/configurations/configurations.js";
import { IconBundle, MaterialIcons, SocialIcons } from "../model/configurations/icons.js";


export default class TopBar {
	private static readonly ID = "top-bar";
	private static readonly LEFT_CONTAINER_ID = "left-container";
	private static readonly RIGHT_CONTAINER_ID = "right-container";

	private static instance: HTMLElement;
	private static title: HTMLElement;

	static getInstance(name: string) {
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

		const githubIcon = getIcon(IconBundle.Social, SocialIcons.Github);
		rightContainer.appendChild(githubIcon ?? uiComponent());
		githubIcon.onclick = () => window.open(getConfiguration(AppConfigurations.GithubRepository), "_blank")

		const motionsIcon = getIcon(IconBundle.Material, Animations.enabled? MaterialIcons.MotionPause: MaterialIcons.MotionPlay);
		rightContainer.appendChild(motionsIcon ?? uiComponent());

		motionsIcon.onclick= () => {
			Animations.enabled =! Animations.enabled
			setConfiguration(AppConfigurations.Animations, Animations.enabled)
			document.documentElement.dataset.animations = `${Animations.enabled}`
			motionsIcon.innerHTML = getIcon(IconBundle.Material, Animations.enabled? MaterialIcons.MotionPause: MaterialIcons.MotionPlay).querySelector("svg").outerHTML;
		}

		const folderIcon = getIcon(IconBundle.Material, MaterialIcons.Folder);
		rightContainer.appendChild(folderIcon ?? uiComponent());

		// const addIcon = getIcon(IconBundle.Material, MaterialIcons.Add);
		// rightContainer.appendChild(addIcon ?? uiComponent());



		this.instance.appendChild(rightContainer);

		return this.instance;
	}

	static async setTitle(name : string) {
		if(undefined === this.instance) return
		this.title.innerText = name;
	}
}
