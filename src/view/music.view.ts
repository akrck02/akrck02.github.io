import { createMockupView } from "./mockup.view.js";
import { MaterialIcons } from "../model/configurations/icons.js";

export const showMusicView = createMockupView({
  id: "music",
  route: "music",
  icon: MaterialIcons.MusicNote,
  title: "Music",
  description: "Tracks and sound experiments from my free time."
});
