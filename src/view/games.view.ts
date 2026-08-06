import { createProjectsView } from "./projects.view.js";
import { MaterialIcons } from "../model/configurations/icons.js";

export const showGamesView = createProjectsView({
  id: "games",
  icon: MaterialIcons.SportsEsports,
  title: "Games",
  description: "Small games and interactive experiments I have created.",
  dataKey: "games"
});
