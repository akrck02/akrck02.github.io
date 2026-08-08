import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import { getIcon } from "../lib/icons.js";
import { IconBundle, MaterialIcons } from "../model/configurations/icons.js";
import { getPhotoThumbnailUrl, getPhotoUrl, resolveApiPhotoUrl } from "../service/path.service.js";
import { Album, loadPhotoExif, loadPhotosExif, Photo, PhotoExif } from "../service/photos.service.js";

type albumType = Album;

let image: HTMLImageElement;
let visualizerElement: HTMLElement;
let exifPanel: HTMLElement;
let exifToggle: HTMLElement;
let exifData: { [id: string]: PhotoExif } = {};
let exifVisible = false;

let currentPhoto: Photo | undefined;
let currentAlbum: albumType;

export function createVisualizer() {
  // Never keep more than one visualizer alive (a re-render of the photos view
  // would otherwise leak a second one on document.body).
  document.getElementById("visualizer")?.remove();

  const visualizer = uiComponent({
    id: "visualizer"
  });
  visualizerElement = visualizer;
  bindHistory();

  const hint = uiComponent({
    id: "viz-hint"
  });
  hint.innerHTML =
    `<span class="hint-desktop">Click to close</span>` +
    `<span class="hint-mobile">Swipe to browse · swipe up to close</span>`;
  visualizer.appendChild(hint);

  const backButton = getIcon(IconBundle.Material, MaterialIcons.Next, "3rem");
  backButton.classList.add("button");
  backButton.id = "back";
  backButton.onclick = (event: MouseEvent) => {
    event.stopPropagation();
    if (image.dataset.id) showLastPhoto(image.dataset.id);
  };
  visualizer.appendChild(backButton);

  image = uiComponent({
    type: Html.Img
  }) as HTMLImageElement;
  visualizer.appendChild(image);

  const spinner = uiComponent({
    id: "viz-spinner"
  });
  visualizer.appendChild(spinner);

  const nextButton = getIcon(IconBundle.Material, MaterialIcons.Next, "3rem");
  nextButton.classList.add("button");
  nextButton.id = "next";
  nextButton.onclick = (event: MouseEvent) => {
    event.stopPropagation();
    if (image.dataset.id) showNextPhoto(image.dataset.id);
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

  const zoomReset = uiComponent({
    type: Html.Button,
    id: "zoom-reset",
    text: "1×"
  });
  zoomReset.onclick = (event: MouseEvent) => {
    event.stopPropagation();
    resetZoom();
  };
  visualizer.appendChild(zoomReset);

  visualizer.onclick = (event: MouseEvent) => {
    if (swipeHandled) {
      swipeHandled = false;
      return;
    }
    if (event.target === visualizer || event.target === image) {
      closeVisualizer();
    }
  };

  addTouchGestures(image);
  return visualizer;
}

let swipeHandled = false;

// Zoom / pan state for the current photo.
let scale = 1;
let panX = 0;
let panY = 0;

function resetZoom() {
  scale = 1;
  panX = 0;
  panY = 0;
  if (image) image.style.transform = "";
  updateScaleState();
}

function applyTransform() {
  image.style.transform =
    scale === 1 ? "" : `translate(${panX}px, ${panY}px) scale(${scale})`;
  updateScaleState();
}

function updateScaleState() {
  if (visualizerElement) {
    visualizerElement.dataset.scale = scale === 1 ? "1" : "zoomed";
  }
}

function addTouchGestures(target: HTMLElement) {
  const SWIPE_THRESHOLD = 45;
  const MAX_SCALE = 4;

  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;
  let startScale = 1;
  let startDist = 0;
  let mode: "none" | "swipe" | "pan" | "pinch" = "none";
  let pinchedThisGesture = false;

  const distance = (a: Touch, b: Touch) =>
    Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

  target.addEventListener(
    "touchstart",
    (event: TouchEvent) => {
      if (event.touches.length === 2) {
        mode = "pinch";
        pinchedThisGesture = true;
        startScale = scale;
        startDist = distance(event.touches[0], event.touches[1]);
      } else if (event.touches.length === 1) {
        const touch = event.touches[0];
        startX = lastX = touch.clientX;
        startY = lastY = touch.clientY;
        mode = scale > 1 ? "pan" : "swipe";
      }
    },
    { passive: false }
  );

  target.addEventListener(
    "touchmove",
    (event: TouchEvent) => {
      if (mode === "pinch" && event.touches.length === 2) {
        event.preventDefault();
        const ratio = distance(event.touches[0], event.touches[1]) / startDist;
        scale = Math.min(MAX_SCALE, Math.max(1, startScale * ratio));
        applyTransform();
      } else if (mode === "pan" && event.touches.length === 1) {
        event.preventDefault();
        const touch = event.touches[0];
        panX += touch.clientX - lastX;
        panY += touch.clientY - lastY;
        lastX = touch.clientX;
        lastY = touch.clientY;
        applyTransform();
      }
    },
    { passive: false }
  );

  target.addEventListener(
    "touchend",
    (event: TouchEvent) => {
      if (event.touches.length > 0) return; // wait until all fingers lift

      if (pinchedThisGesture || mode === "pan") {
        if (scale <= 1.02) resetZoom();
        swipeHandled = true; // don't let the follow-up click close the viewer
        mode = "none";
        pinchedThisGesture = false;
        return;
      }

      if (mode === "swipe" && scale === 1) {
        const touch = event.changedTouches[0];
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);

        if (Math.max(absX, absY) >= SWIPE_THRESHOLD) {
          const id = image.dataset.id;
          swipeHandled = true;
          if (absX > absY && id) {
            if (dx < 0) showNextPhoto(id);
            else showLastPhoto(id);
          } else if (dy < 0) {
            closeVisualizer();
          }
        }
      }

      mode = "none";
    },
    { passive: false }
  );
}

async function renderExif(id: string | undefined) {
  if (!exifPanel || !id) {
    if (exifPanel) {
      exifPanel.innerHTML = "";
      exifPanel.classList.remove("show");
      exifToggle?.classList.remove("show");
    }
    return;
  }

  let exif: PhotoExif | null | undefined = exifData[id];
  if (!exif) {
    exif = await loadPhotoExif(id);
  }

  if (!exif) {
    exifPanel.innerHTML = "";
    exifPanel.classList.remove("show");
    exifToggle?.classList.remove("show");
    return;
  }

  const specs = [exif.focal_length, exif.aperture, exif.shutter, exif.iso ? `${exif.iso}` : undefined]
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
  if (album.photos.length > 0) {
    showPhoto(album.photos[0].id, false);
  }
}

export function loadAlbumAndPhoto(album: albumType, photoId: string) {
  currentAlbum = album;
  showPhoto(photoId);
}

export function showPhoto(currentId: string, show: boolean = true) {
  if (!currentAlbum) return;
  const targetPhoto = currentAlbum.photos.find((p) => p.id === currentId);
  if (!targetPhoto) return;

  image.dataset.id = currentId;
  currentPhoto = targetPhoto;
  resetZoom();

  // Show the cached thumbnail instantly, then swap in the full resolution.
  image.classList.add("loading-full");
  image.src = resolveApiPhotoUrl(targetPhoto.thumb);

  const full = new Image();
  full.onload = () => {
    if (image.dataset.id === currentId) {
      image.src = full.src;
      image.classList.remove("loading-full");
    }
  };
  full.src = resolveApiPhotoUrl(targetPhoto.display);

  renderExif(currentId);

  if (show) {
    showVisualizer();
  }
}

export function showNextPhoto(currentId: string) {
  if (!currentAlbum || currentAlbum.photos.length === 0) return;

  const currentIndex = currentAlbum.photos.findIndex((p) => p.id === currentId);

  if (currentIndex !== -1) {
    const nextIndex = (currentIndex + 1) % currentAlbum.photos.length;
    const nextPhoto = currentAlbum.photos[nextIndex];
    showPhoto(nextPhoto.id);
  }
}

export function showLastPhoto(currentId: string) {
  if (!currentAlbum || currentAlbum.photos.length === 0) return;

  const currentIndex = currentAlbum.photos.findIndex((p) => p.id === currentId);

  if (currentIndex !== -1) {
    const prevIndex = (currentIndex - 1 + currentAlbum.photos.length) % currentAlbum.photos.length;
    const prevPhoto = currentAlbum.photos[prevIndex];
    showPhoto(prevPhoto.id);
  }
}

let historyStatePushed = false;
let historyBound = false;

// Close the visualizer on the browser/OS "back" gesture instead of letting it
// navigate the route away (which used to strand the overlay and break state).
function bindHistory() {
  if (historyBound) return;
  historyBound = true;
  window.addEventListener("popstate", () => {
    const el = document.getElementById("visualizer");
    if (el && el.classList.contains("show")) {
      historyStatePushed = false;
      hideVisualizer(el);
    }
  });
}

function hideVisualizer(el: HTMLElement) {
  el.classList.remove("show");
  resetZoom();
}

function closeVisualizer() {
  const el = document.getElementById("visualizer");
  if (!el) return;
  hideVisualizer(el);
  if (historyStatePushed) {
    historyStatePushed = false;
    history.back(); // pop the entry we pushed when opening
  }
}

function showVisualizer() {
  const el = document.getElementById("visualizer");
  if (!el) return;
  el.classList.add("show");
  if (!historyStatePushed) {
    history.pushState({ visualizer: true }, "");
    historyStatePushed = true;
  }
}
