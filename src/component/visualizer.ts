import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import { getIcon } from "../lib/icons.js";
import { IconBundle, MaterialIcons } from "../model/configurations/icons.js";
import { getImageUrl } from "../service/path.service.js";
import { loadPhotosExif, PhotoExif } from "../service/photos.service.js";

type albumType = {
  [name: string]: string;
};

let image: HTMLImageElement;
let exifPanel: HTMLElement;
let exifToggle: HTMLElement;
let exifData: { [id: string]: PhotoExif } = {};
let exifVisible = false;

let currentPhoto: string;
let currentAlbum: albumType;

export function createVisualizer() {
  const visualizer = uiComponent({
    id: "visualizer"
  });

  const closeButton = getIcon(IconBundle.Material, MaterialIcons.Folder);
  closeButton.id = "close";
  closeButton.onclick = (event: MouseEvent) => {
    event.stopPropagation();
    closeVisualizer();
  };
  visualizer.appendChild(closeButton);

  const backButton = getIcon(IconBundle.Material, MaterialIcons.Next, "3rem");
  backButton.classList.add("button");
  backButton.id = "back";
  backButton.onclick = (event: MouseEvent) => {
    event.stopPropagation();
    showLastPhoto(image.dataset.id);
  };
  visualizer.appendChild(backButton);

  image = uiComponent({
    type: Html.Img
  }) as HTMLImageElement;
  visualizer.appendChild(image);

  const nextButton = getIcon(IconBundle.Material, MaterialIcons.Next, "3rem");
  nextButton.classList.add("button");
  nextButton.id = "next";
  nextButton.onclick = (event: MouseEvent) => {
    event.stopPropagation();
    showNextPhoto(image.dataset.id);
  };
  visualizer.appendChild(nextButton);

  exifPanel = uiComponent({
    id: "exif"
  });
  visualizer.appendChild(exifPanel);

  exifToggle = getIcon(IconBundle.Material, MaterialIcons.Info, "1.75rem");
  exifToggle.id = "exif-toggle";
  exifToggle.onclick = (event: MouseEvent) => {
    event.stopPropagation();
    exifVisible = !exifVisible;
    exifPanel.classList.toggle("show", exifVisible);
    exifToggle.classList.toggle("collapsed", !exifVisible);
  };
  visualizer.appendChild(exifToggle);

  loadPhotosExif().then((data) => {
    exifData = data;
    renderExif(image?.dataset.id);
  });

  visualizer.onclick = (event: MouseEvent) => {
    if (event.target === visualizer || event.target == image) {
      closeVisualizer();
    }
  };
  return visualizer;
}

function renderExif(id: string | undefined) {
  if (!exifPanel) return;

  const exif = id ? exifData[id] : undefined;
  if (!exif) {
    exifPanel.innerHTML = "";
    exifPanel.classList.remove("show");
    exifToggle?.classList.remove("show");
    return;
  }

  const specs = [exif.focal, exif.aperture, exif.shutter, exif.iso]
    .filter(Boolean)
    .map((spec) => `<span>${spec}</span>`)
    .join("");

  exifPanel.innerHTML =
    (exif.camera ? `<div class="exif-camera">${exif.camera}</div>` : "") +
    (exif.lens ? `<div class="exif-lens">${exif.lens}</div>` : "") +
    (specs ? `<div class="exif-specs">${specs}</div>` : "");

  exifPanel.classList.toggle("show", exifVisible);
  exifToggle?.classList.add("show");
  exifToggle?.classList.toggle("collapsed", !exifVisible);
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
  renderExif(currentId);

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
