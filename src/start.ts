import { getConfiguration, loadConfiguration } from "./lib/configuration.js";
import { Display } from "./lib/display.js";
import { loadIcons } from "./lib/icons.js";
import {
  setHomeRoute,
  setNotFoundRoute,
  setRoute,
  showRoute,
} from "./lib/router.js";
import { AppConfigurations } from "./model/enum/configurations.js";
import { IconBundle } from "./model/enum/icons.js";
import HomeView from "./view/home.js";
import NotFound from "./view/not.found.js";
import ProjectsView from "./view/project.js";
import TerminalView from "./view/test.js";

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
  await getIcons();
  await start();
};

window.onresize = async function () {
  Display.checkType();
};

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
 * Set routes
 */
function setRoutes(parent: HTMLElement) {
  setHomeRoute(HomeView.show);
  setNotFoundRoute(NotFound.show);
  setRoute("/projects", ProjectsView.show);
  setRoute("/test", TerminalView.show);
  showRoute(window.location.hash.slice(1).toLowerCase(), parent);
}

/**
 *  Start the web app
 */
async function start() {
  setRoutes(document.body);
}
