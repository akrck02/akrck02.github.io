
import { listProjects } from "./command/list.projects.js";
import { clearTerminal, getTerminal, getTerminalUI, instanceTerminal } from "./component/terminal.ui.js";
import TopBar from "./component/top.bar.js";
import Animations from "./lib/animations.js";
import { BubbleUI } from "./lib/bubble.js";
import { getConfiguration, isConfigurationActive, isConfigurationSet, loadConfiguration, setConfiguration } from "./lib/configuration.js";
import { Display } from "./lib/display.js";
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
import HomeView from "./view/home.view.js";
import NotFound from "./view/not.found.view.js";
import {showProjectsView } from "./view/project.view.js";
import TerminalView from "./view/test.js";
import { listDevTools } from "./command/list.devtools.js";
import { listWebsites } from "./command/list.websites.js";
import { listCli } from "./command/list.cli.js";

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
	await loadConfiguration("gtdf.config.json");
	document.title = getConfiguration(AppConfigurations.AppName);
	Display.checkType();
	checkAnimations()
	await getIcons();

	const bar = TopBar.getInstance("akrck02.org/projects");
	document.body.appendChild(bar);

	instanceTerminal()
	const terminalUI = getTerminalUI()
	clearTerminal()
	sleep(1)
	terminalUI.classList.add("show")

	const content = uiComponent({
		classes: [BubbleUI.BoxColumn],
		styles: {
			width: "100%",
			height: "calc(100% - 3rem)",
			overflowY: "auto",
		},
	});
	content.appendChild(terminalUI);
	document.body.appendChild(content);

	await start();
};

window.onresize = async function () {
	Display.checkType();
};

/**
 * Check if animations are enabled
 */
function checkAnimations() {

	// if it is the first time, enable animations by default
	if(false === isConfigurationSet(AppConfigurations.Animations)) {
		setConfiguration(AppConfigurations.Animations, true)
	}

	Animations.enabled = isConfigurationActive(AppConfigurations.Animations)

	// set the animation preference in all the document
	if(Animations.enabled) document.documentElement.dataset.animations = "true"
}

/**
 * Get app icons
 */
async function getIcons() {
	await loadIcons(
		IconBundle.Material,
		`${getConfiguration("path")["icons"]}/materialicons.json`,
	);

	await loadIcons(
		IconBundle.Social,
		`${getConfiguration("path")["icons"]}/socialicons.json`,
	);
}

/**
 *  Start the web app
 */
async function start() {
	setCommands();
	setRoutes(getTerminalUI());
	document.body.style.transition = "backgroundvar(--animation-slow)"
	document.body.style.backgroundImage =` url("${getConfiguration(AppConfigurations.Path)["images"]}/development.jpg")`
}

/**
 * Set routes
 */
function setRoutes(parent: HTMLElement) {
	setHomeRoute(HomeView.show);
	setNotFoundRoute(NotFound.show);
	setRoute("/projects", showProjectsView);
	setRoute("/terminal", TerminalView.show);
	showRoute(window.location.hash.slice(1).toLowerCase(), parent);
}

/**
 * Register commands for the terminal
 */
function setCommands() {
	const terminal = getTerminal();
	terminal.register("ls ./projects", listProjects);
	terminal.register("ls ./projects/games", listGames);
	terminal.register("ls ./projects/developer tools", listDevTools);
	terminal.register("ls ./projects/websites", listWebsites);
	terminal.register("ls ./projects/cli", listCli);
}
