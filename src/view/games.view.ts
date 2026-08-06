import { createMockupView } from "./mockup.view.js";
import { MaterialIcons } from "../model/configurations/icons.js";

export const showGamesView = createMockupView({
  id: "games",
  route: "games",
  icon: MaterialIcons.SportsEsports,
  title: "Games",
  description: "Small games and interactive experiments I have created."
});
