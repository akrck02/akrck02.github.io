import Animations from "../lib/animations.js";
import { BubbleUI } from "../lib/bubble.js";
import { getConfiguration, setConfiguration } from "../lib/configuration.js";
import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import { getIcon } from "../lib/icons.js";
import { AppConfigurations } from "../model/configurations/configurations.js";
import {
	IconBundle,
	MaterialIcons,
	SocialIcons,
} from "../model/configurations/icons.js";

let title: HTMLElement;

export function createTopBar(name: string): HTMLElement {
	const instance = uiComponent({
		type: Html.Header,
		id: "top-bar",
		classes: [BubbleUI.BoxXBetween, BubbleUI.BoxYCenter],
	});

	const leftContainer = uiComponent({
		id: "left-container",
		classes: [BubbleUI.BoxXStart],
	});
	instance.appendChild(leftContainer);

	const terminalIcon = getIcon(IconBundle.Material, MaterialIcons.Terminal);
	leftContainer.appendChild(terminalIcon);

	title = uiComponent({
		type: Html.H1,
		text: name,
	});
	leftContainer.appendChild(title);

	const rightContainer = uiComponent({
		id: "right-container",
		classes: [BubbleUI.BoxXEnd],
	});

	const githubIcon = getIcon(IconBundle.Social, SocialIcons.Github);
	rightContainer.appendChild(githubIcon ?? uiComponent());
	githubIcon.onclick = () =>
		window.open(getConfiguration(AppConfigurations.GithubRepository), "_blank");

	const motionsIcon = getIcon(
		IconBundle.Material,
		Animations.enabled ? MaterialIcons.MotionPause : MaterialIcons.MotionPlay,
	);
	rightContainer.appendChild(motionsIcon ?? uiComponent());

	motionsIcon.onclick = () => {
		Animations.enabled = !Animations.enabled;
		setConfiguration(AppConfigurations.Animations, Animations.enabled);
		document.documentElement.dataset.animations = `${Animations.enabled}`;
		motionsIcon.innerHTML = getIcon(
			IconBundle.Material,
			Animations.enabled ? MaterialIcons.MotionPause : MaterialIcons.MotionPlay,
		).querySelector("svg").outerHTML;
	};

	// const folderIcon = getIcon(IconBundle.Material, MaterialIcons.Folder);
	// rightContainer.appendChild(folderIcon ?? uiComponent());

	instance.appendChild(rightContainer);
	return instance;
}

export async function setTopBarTitle(name: string) {
	if (undefined === title) return;
	title.innerText = name;
}
