import Animations from "./lib/animations.js";
import { BubbleUI } from "./lib/bubble.js";
import { getConfiguration, isConfigurationActive, isConfigurationSet, loadConfiguration, setConfiguration } from "./lib/configuration.js";
import { uiComponent } from "./lib/dom.js";
import { loadIcons } from "./lib/icons.js";
import { setHomeRoute, setNotFoundRoute, setRoute, showRoute } from "./lib/router.js";
import { AppConfigurations } from "./model/configurations/configurations.js";
import { IconBundle } from "./model/configurations/icons.js";
import { showNotFoundView } from "./view/not.found.view.js";
import { checkDisplayType } from "./lib/display.js";
import { showHomeView } from "./view/home.view.js";
import { showPhotosView } from "./view/photos.view.js";
import { showSoftwareView } from "./view/software.view.js";
import { showStoriesView } from "./view/stories.view.js";
import { showGamesView } from "./view/games.view.js";
import { showMusicView } from "./view/music.view.js";

window.addEventListener("hashchange", start);

window.onload = async function () {
  await loadConfiguration("gtdf.config.json");
  document.title = getConfiguration(AppConfigurations.AppName);

  checkDisplayType();
  window.onresize = checkDisplayType;
  checkAnimations();

  await loadIcons(IconBundle.Material, `${getConfiguration("path")["icons"]}/materialicons.json`);

  const content = uiComponent({
    classes: [BubbleUI.BoxColumn],
    id: "app-content"
  });
  document.body.appendChild(content);

  await start();
};

function checkAnimations() {
  if (false === isConfigurationSet(AppConfigurations.Animations)) {
    setConfiguration(AppConfigurations.Animations, true);
  }

  Animations.enabled = isConfigurationActive(AppConfigurations.Animations);

  if (Animations.enabled) document.documentElement.dataset.animations = "true";
}

async function start() {
  setRoutes(document.getElementById("app-content"));
}

function setRoutes(parent: HTMLElement) {
  setHomeRoute(showHomeView);
  setNotFoundRoute(showNotFoundView);
  setRoute("/photos", showPhotosView);
  setRoute("/software", showSoftwareView);
  setRoute("/software/$", showSoftwareView);
  setRoute("/stories", showStoriesView);
  setRoute("/games", showGamesView);
  setRoute("/games/$", showGamesView);
  setRoute("/music", showMusicView);
  showRoute(window.location.hash.slice(1).toLowerCase(), parent);
}
