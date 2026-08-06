import { createMockupView } from "./mockup.view.js";
import { MaterialIcons } from "../model/configurations/icons.js";

export const showStoriesView = createMockupView({
  id: "stories",
  route: "stories",
  icon: MaterialIcons.AutoStories,
  title: "Stories",
  description: "Written stories, texts and thoughts I want to share."
});
