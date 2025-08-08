import { listProjects } from "./command/list.projects.js";
import {
	clearTerminal,
	getTerminalUI,
	instanceTerminal,
} from "./component/terminal.ui.js";
import { createTopBar } from "./component/top.bar.js";
import Animations from "./lib/animations.js";
import { BubbleUI } from "./lib/bubble.js";
import {
	getConfiguration,
	isConfigurationActive,
	isConfigurationSet,
	loadConfiguration,
	setConfiguration,
} from "./lib/configuration.js";

import { uiComponent } from "./lib/dom.js";
import { loadIcons } from "./lib/icons.js";
import {
	setHomeRoute,
	setNotFoundRoute,
	setRoute,
	showRoute,
} from "./lib/router.js";
import { sleep } from "./lib/time.js";
import { AppConfigurations } from "./model/configurations/configurations.js";
import { IconBundle } from "./model/configurations/icons.js";
import { listGames } from "./command/list.games.js";
import { showNotFoundView } from "./view/not.found.view.js";
import { showProjectsView } from "./view/project.view.js";
import { showTerminalView } from "./view/terminal.view.js";
import { checkDisplayType } from "./lib/display.js";
import { showHomeView } from "./view/home.view.js";
import { setCommands } from "./service/command.service.js";

/**
 * When the dynamic URL changes loads
 * the correspoding view from the URL
 */
window.addEventListener("hashchange", start);

/**
 * When the window is loaded load
 * the app state to show
 */
window.onload = async function () {
	// Load configuration
	await loadConfiguration("gtdf.config.json");
	document.title = getConfiguration(AppConfigurations.AppName);

	// Check ui start variables
	checkDisplayType();
	window.onresize = checkDisplayType;
	checkAnimations();
	await loadIcons(
		IconBundle.Material,
		`${getConfiguration("path")["icons"]}/materialicons.json`,
	);
	await loadIcons(
		IconBundle.Social,
		`${getConfiguration("path")["icons"]}/socialicons.json`,
	);

	// Create basic DOM layout
	const bar = createTopBar("akrck02.org");
	document.body.appendChild(bar);

	instanceTerminal();
	const terminalUI = getTerminalUI();
	clearTerminal();
	sleep(1);
	terminalUI.classList.add("show");

	const content = uiComponent({
		classes: [BubbleUI.BoxColumn],
		id: "app-content",
	});
	content.appendChild(terminalUI);
	document.body.appendChild(content);

	await start();
};

/**
 * Check if animations are enabled
 */
function checkAnimations() {
	// if it is the first time, enable animations by default
	if (false === isConfigurationSet(AppConfigurations.Animations)) {
		setConfiguration(AppConfigurations.Animations, true);
	}

	Animations.enabled = isConfigurationActive(AppConfigurations.Animations);

	// set the animation preference in all the document
	if (Animations.enabled) document.documentElement.dataset.animations = "true";
}

/**
 *  Start the web app
 */
async function start() {
	setCommands();
	setRoutes(getTerminalUI());
	document.body.style.transition = "backgroundvar(--animation-slow)";
	document.body.style.backgroundImage = ` url("${getConfiguration(AppConfigurations.Path)["images"]}/development.jpg")`;
}

/**
 * Set routes
 */
function setRoutes(parent: HTMLElement) {
	setHomeRoute(showHomeView);
	setNotFoundRoute(showNotFoundView);
	// setRoute("/projects", showProjectsView);
	// setRoute("/terminal", showTerminalView);
	showRoute(window.location.hash.slice(1).toLowerCase(), parent);
}
