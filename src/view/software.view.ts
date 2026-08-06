import { createProjectsView } from "./projects.view.js";
import { MaterialIcons } from "../model/configurations/icons.js";

export const showSoftwareView = createProjectsView({
  id: "software",
  icon: MaterialIcons.Code,
  title: "Software",
  description: "Apps, tools and libraries I have built and maintain.",
  dataKey: "software"
});
