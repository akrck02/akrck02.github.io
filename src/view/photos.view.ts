import { createVisualizer, loadAlbum, showPhoto } from "../component/visualizer.js";
import { BubbleUI } from "../lib/bubble.js";
import { setDomEvents, uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import { getIcon } from "../lib/icons.js";
import { IconBundle, MaterialIcons } from "../model/configurations/icons.js";
import { getThumbnailUrl, getWebUrl } from "../service/path.service.js";
import { loadPhotosIndex } from "../service/photos.service.js";
import { setOpaqueBackground } from "../service/ui.service.js";

const index = loadPhotosIndex();

export async function showPhotosView(parameters: string[], container: HTMLElement) {
  setOpaqueBackground();

  const view = uiComponent({
    type: Html.View,
    id: "photos"
  });
  container.appendChild(view);

  const visualizer = createVisualizer();
  document.body.appendChild(visualizer);
  loadAlbum(index["Default"]);

  const homeButton = uiComponent({
    type: Html.Button,
    id: "home-button",
    classes: [BubbleUI.BoxCenter]
  });
  homeButton.innerHTML = getIcon(IconBundle.Material, MaterialIcons.Home, "24px", "#ffffff").outerHTML;
  homeButton.onclick = () => (location.href = getWebUrl("#/"));
  view.appendChild(homeButton);

  const hero = uiComponent({
    id: "photos-hero",
    classes: [BubbleUI.BoxColumn, BubbleUI.BoxCenter]
  });

  const heroIcon = uiComponent({
    id: "photos-hero-icon",
    classes: [BubbleUI.BoxCenter]
  });
  heroIcon.innerHTML = getIcon(IconBundle.Material, MaterialIcons.PhotoCamera, "72px").outerHTML;
  hero.appendChild(heroIcon);

  const title = uiComponent({
    type: Html.H1,
    id: "photos-title",
    text: "Photography"
  });
  hero.appendChild(title);

  const description = uiComponent({
    type: Html.P,
    id: "photos-description",
    text: "The world through my lens."
  });
  hero.appendChild(description);

  const hint = uiComponent({
    id: "photos-hero-hint",
    classes: [BubbleUI.BoxColumn, BubbleUI.BoxCenter]
  });
  hint.innerHTML = getIcon(IconBundle.Material, MaterialIcons.Expand, "32px").outerHTML;
  hint.onclick = () => view.scrollTo({ top: view.clientHeight, behavior: "smooth" });
  hero.appendChild(hint);

  view.appendChild(hero);

  view.addEventListener(
    "scroll",
    () => {
      const progress = Math.min(1, view.scrollTop / (view.clientHeight * 0.8));
      hero.style.setProperty("--hero-progress-opacity", `${1 - progress}`);
      hero.style.setProperty("--hero-progress-shift", `${-progress * 4}rem`);
    },
    { passive: true }
  );

  const gallery = uiComponent({
    id: "gallery"
  });
  view.appendChild(gallery);

  for (const entry of Object.entries(index)) {
    const albumPhotos = entry[1];
    for (const photoEntry of Object.entries(albumPhotos)) {
      const photoId = photoEntry[0];
      const photoPath = photoEntry[1] as string;
      gallery.appendChild(createImage(photoId, getThumbnailUrl(photoPath)));
    }
  }
}

function createImage(photoId: string, url: string) {
  const canvas = uiComponent({
    classes: ["gallery-item"]
  });

  const img = uiComponent({
    type: Html.Img,
    attributes: {
      src: url,
      loading: "lazy"
    }
  });

  img.onload = () => canvas.classList.add("loaded");
  img.onerror = () => canvas.classList.add("loaded");
  img.onclick = () => showPhoto(photoId);
  canvas.appendChild(img);

  return canvas;
}
