import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import { getIcon } from "../lib/icons.js";
import { IconBundle, MaterialIcons } from "../model/configurations/icons.js";
import { getImageUrl } from "../service/path.service.js";

type albumType = {
  [name: string]: string;
};

let image: HTMLImageElement;

let currentPhoto: string;
let currentAlbum: albumType;

export function createVisualizer() {
  const visualizer = uiComponent({
    id: "visualizer"
  });

  const closeButton = getIcon(IconBundle.Material, MaterialIcons.Folder);
  closeButton.id = "close";
  closeButton.onclick = () => closeVisualizer();
  visualizer.appendChild(closeButton);

  // Note: Switched to ArrowCircleLeft for back button!
  const backButton = getIcon(IconBundle.Material, MaterialIcons.Next, "3rem");
  backButton.classList.add("button");
  backButton.id = "back";
  backButton.onclick = () => showLastPhoto(image.dataset.id);
  visualizer.appendChild(backButton);

  image = uiComponent({
    type: Html.Img
  }) as HTMLImageElement;
  visualizer.appendChild(image);

  const nextButton = getIcon(IconBundle.Material, MaterialIcons.Next, "3rem");
  nextButton.classList.add("button");
  nextButton.onclick = () => showNextPhoto(image.dataset.id);
  visualizer.appendChild(nextButton);

  visualizer.onclick = (event: MouseEvent) => {
    if (event.target === visualizer || event.target == image) {
      closeVisualizer();
    }
  };
  return visualizer;
}

export function loadAlbum(album: albumType) {
  currentAlbum = album;
  const firstId = Object.keys(album)[0];
  if (firstId) {
    showPhoto(firstId, false);
  }
}

export function loadAlbumAndPhoto(album: albumType, photoId: string) {
  currentAlbum = album;
  showPhoto(photoId);
}

export function showPhoto(currentId: string, show: boolean = true) {
  if (!currentAlbum || !currentAlbum[currentId]) return;

  image.dataset.id = currentId;
  currentPhoto = currentAlbum[currentId];
  image.src = getImageUrl(currentPhoto);

  if (show) {
    showVisualizer();
  }
}

export function showNextPhoto(currentId: string) {
  const keys = Object.keys(currentAlbum);
  if (keys.length === 0) return;

  const currentIndex = keys.indexOf(currentId);

  if (currentIndex !== -1) {
    const nextIndex = (currentIndex + 1) % keys.length;
    const nextId = keys[nextIndex];
    showPhoto(nextId);
  }
}

export function showLastPhoto(currentId: string) {
  const keys = Object.keys(currentAlbum);
  if (keys.length === 0) return;

  const currentIndex = keys.indexOf(currentId);

  if (currentIndex !== -1) {
    const prevIndex = (currentIndex - 1 + keys.length) % keys.length;
    const prevId = keys[prevIndex];
    showPhoto(prevId);
  }
}

function closeVisualizer() {
  document.getElementById("visualizer").classList.remove("show");
}

function showVisualizer() {
  document.getElementById("visualizer").classList.add("show");
}
