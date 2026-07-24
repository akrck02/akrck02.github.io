import { setTopBarTitle } from "../component/top.bar.js";
import { createVisualizer, loadAlbum, showPhoto } from "../component/visualizer.js";
import { setDomEvents, uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import { getIcon } from "../lib/icons.js";
import { IconBundle, MaterialIcons } from "../model/configurations/icons.js";
import { getImageUrl } from "../service/path.service.js";
import { loadPhotosIndex } from "../service/photos.service.js";
import { setOpaqueBackground } from "../service/ui.service.js";

const index = loadPhotosIndex();

/**
 * Show home view
 */
export async function showPhotosView(parameters: string[], container: HTMLElement) {
  setTopBarTitle("akrck02.org/photos");
  setOpaqueBackground();

  const view = uiComponent({
    type: Html.View,
    id: "photos"
  });
  container.appendChild(view);

  const visualizer = createVisualizer();
  document.body.appendChild(visualizer);
  loadAlbum(index["Default"]);

  const gallery = uiComponent({
    id: "gallery"
  });
  view.appendChild(gallery);

  for (const [_, albumPhotos] of Object.entries(index)) {
    for (const [photoId, photoPath] of Object.entries(albumPhotos)) {
      const imageUrl = getImageUrl(photoPath);
      gallery.appendChild(createImage(photoId, imageUrl));
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
