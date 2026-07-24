import { getConfiguration } from "../lib/configuration.js";
import { AppConfigurations } from "../model/configurations/configurations.js";

export function setOpaqueBackground() {
  // Clear any existing background image
  document.body.style.backgroundImage = "none";

  // Set a solid background color (e.g., white)
  document.body.style.backgroundColor = "rgba(255,255,255, .85)";
}

export function setBackground() {
  document.body.style.backgroundImage = ` url("${getConfiguration(AppConfigurations.Path)["images"]}/development.jpg")`;
}
