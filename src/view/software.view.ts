import { createMockupView } from "./mockup.view.js";
import { MaterialIcons } from "../model/configurations/icons.js";

export const showSoftwareView = createMockupView({
  id: "software",
  route: "software",
  icon: MaterialIcons.Code,
  title: "Software",
  description: "Apps, tools and libraries I have built and maintain."
});
