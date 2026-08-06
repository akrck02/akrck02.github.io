import { BubbleUI } from "../lib/bubble.js";
import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import { getIcon } from "../lib/icons.js";
import { IconBundle, MaterialIcons } from "../model/configurations/icons.js";
import { getImageUrl, redirect } from "../service/path.service.js";

export async function showHomeView(parameters: string[], container: HTMLElement) {
  const view = uiComponent({
    type: Html.View,
    id: "home",
    classes: [BubbleUI.BoxRow, BubbleUI.BoxCenter]
  });

  const background = uiComponent({
    id: "home-background",
    styles: {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url("${getImageUrl("DSCF0140.JPG")}")`
    }
  });
  view.appendChild(background);

  const content = uiComponent({
    id: "content",
    classes: [BubbleUI.BoxColumn, BubbleUI.BoxXStart]
  });

  const title = uiComponent({
    type: Html.H1,
    id: "title",
    text: "Hi there!"
  });

  const subtitle = uiComponent({
    type: Html.P,
    id: "subtitle",
    text: `I’m akrck02, a ${new Date().getFullYear() - 2000} year old\nsoftware developer.`
  });

  const description = uiComponent({
    type: Html.P,
    id: "description",
    text: "I enjoy researching, and creating things like:"
  });

  const buttonGroup = uiComponent({
    id: "button-group",
    classes: [BubbleUI.BoxRow]
  });

  const navItems = [
    { icon: MaterialIcons.PhotoCamera, route: "photos" },
    { icon: MaterialIcons.Code, route: "software" },
    { icon: MaterialIcons.AutoStories, route: "stories" },
    { icon: MaterialIcons.SportsEsports, route: "games" },
    { icon: MaterialIcons.MusicNote, route: "music" }
  ];

  navItems.forEach(({ icon, route }) => {
    const btn = uiComponent({
      type: Html.Button,
      classes: [BubbleUI.BoxCenter, "nav-button"]
    });

    btn.innerHTML = getIcon(IconBundle.Material, icon, "28px", "#ffffff").outerHTML;
    btn.onclick = () => redirect(route);
    buttonGroup.appendChild(btn);
  });

  content.appendChild(title);
  content.appendChild(subtitle);
  content.appendChild(description);
  content.appendChild(buttonGroup);

  const photoCard = uiComponent({
    id: "polaroid-card"
  });

  const profileImg = uiComponent({
    type: Html.Img,
    attributes: {
      src: getImageUrl("profile.jpg"),
      alt: "akrck02 photo"
    }
  });

  photoCard.appendChild(profileImg);

  view.appendChild(content);
  view.appendChild(photoCard);
  container.appendChild(view);
}
