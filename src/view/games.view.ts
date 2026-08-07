import { BubbleUI } from "../lib/bubble.js";
import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import { getGameImageUrl, getOtherImageUrl, getWebUrl } from "../service/path.service.js";
import { loadProjects, Project } from "../service/projects.service.js";
import { setOpaqueBackground } from "../service/ui.service.js";

// Engine → accent dot color, mirroring the palette from the design mock.
const ENGINE_COLORS: { [engine: string]: string } = {
  Godot: "#478cbf",
  Unity: "#222c37",
  Love2D: "#e14b8a",
  Bevy: "#b7410e",
  GameMaker: "#6f52c9",
  libGDX: "#e44d26"
};

// OS logos for the platforms a game targets. `svg` supplies raw multi-color
// markup; otherwise a single `path` is filled with `color`.
const PLATFORM_ICONS: {
  [platform: string]: { label: string; color?: string; path?: string; svg?: string };
} = {
  windows: {
    label: "Windows",
    color: "#0078D4",
    path: "M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699m10.949-8.099H24V24l-13.051-1.801"
  },
  linux: {
    label: "Linux",
    svg:
      `<defs><linearGradient id="sd-grad" x1="0%" y1="0%" x2="100%" y2="100%">` +
      `<stop offset="0%" stop-color="#9b5cf0"/><stop offset="100%" stop-color="#3b9dff"/>` +
      `</linearGradient></defs>` +
      `<path d="M12 3 A9 9 0 0 1 12 21" fill="none" stroke="#17171b" stroke-width="3.6" stroke-linecap="round"/>` +
      `<circle cx="8.1" cy="12" r="4.4" fill="url(#sd-grad)"/>`
  },
  mac: {
    label: "macOS",
    color: "#555555",
    path: "M17.05 12.536c-.03-2.79 2.28-4.13 2.38-4.2-1.3-1.9-3.32-2.16-4.04-2.19-1.72-.17-3.36 1.01-4.23 1.01-.87 0-2.22-.99-3.65-.96-1.88.03-3.61 1.09-4.58 2.77-1.95 3.39-.5 8.4 1.4 11.15.93 1.35 2.03 2.86 3.47 2.8 1.39-.05 1.92-.9 3.6-.9 1.67 0 2.15.9 3.62.87 1.5-.02 2.45-1.37 3.37-2.72 1.06-1.56 1.5-3.07 1.52-3.15-.03-.02-2.92-1.12-2.95-4.44zM14.28 4.5c.77-.93 1.29-2.22 1.15-3.5-1.11.04-2.46.74-3.25 1.67-.71.82-1.33 2.14-1.16 3.4 1.24.1 2.5-.63 3.26-1.57z"
  },
  android: {
    label: "Android",
    color: "#3DDC84",
    path: "M17.523 15.341a1 1 0 110-2 1 1 0 010 2m-11.046 0a1 1 0 110-2 1 1 0 010 2m11.405-6.02l1.997-3.459a.416.416 0 00-.72-.416l-2.022 3.503A12.253 12.253 0 0012 7.851c-1.822 0-3.548.393-5.137 1.099L4.841 5.447a.416.416 0 00-.72.416l1.997 3.459C2.689 11.187.343 14.659 0 18.761h24c-.343-4.102-2.689-7.574-6.118-9.44"
  },
  ios: {
    label: "iOS",
    color: "#555555",
    path: "M17.05 12.536c-.03-2.79 2.28-4.13 2.38-4.2-1.3-1.9-3.32-2.16-4.04-2.19-1.72-.17-3.36 1.01-4.23 1.01-.87 0-2.22-.99-3.65-.96-1.88.03-3.61 1.09-4.58 2.77-1.95 3.39-.5 8.4 1.4 11.15.93 1.35 2.03 2.86 3.47 2.8 1.39-.05 1.92-.9 3.6-.9 1.67 0 2.15.9 3.62.87 1.5-.02 2.45-1.37 3.37-2.72 1.06-1.56 1.5-3.07 1.52-3.15-.03-.02-2.92-1.12-2.95-4.44zM14.28 4.5c.77-.93 1.29-2.22 1.15-3.5-1.11.04-2.46.74-3.25 1.67-.71.82-1.33 2.14-1.16 3.4 1.24.1 2.5-.63 3.26-1.57z"
  },
  web: {
    label: "Web",
    color: "#0EA5A4",
    path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
  }
};

interface Status {
  label: string;
  fg: string;
  bg: string;
  dot: string;
}

const STATUSES: { [key: string]: Status } = {
  released: { label: "RELEASED", fg: "#15803d", bg: "#eaf7ee", dot: "#22c55e" },
  "in-development": { label: "IN DEVELOPMENT", fg: "#1d4ed8", bg: "#e7edfd", dot: "#3f7fd4" },
  prototype: { label: "PROTOTYPE", fg: "#6d28d9", bg: "#f1ebfd", dot: "#8b5cf6" },
  archived: { label: "ARCHIVED", fg: "#7a7a7a", bg: "#ececec", dot: "#9a9a9a" }
};

function statusOf(project: Project): Status {
  const key = project.status ?? (project.archived ? "archived" : "released");
  return STATUSES[key] ?? STATUSES.released;
}

function engineColor(engine?: string): string {
  return (engine && ENGINE_COLORS[engine]) || "#8a8a8a";
}

// Seeded placeholder image — stable per game until real art is provided.
function placeholderUrl(seed: string, w: number, h: number): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

// Build an <img> that walks a list of candidate sources, falling through to the
// next on error and finally to a seeded placeholder. Lets real art be dropped in
// later with no code change.
function fallbackImage(alt: string, classes: string[], sources: string[], placeholder: string): HTMLElement {
  const img = uiComponent({
    type: Html.Img,
    classes: ["img-skeleton", ...classes],
    attributes: { alt, loading: "lazy" }
  }) as HTMLImageElement;
  const chain = [...sources, placeholder];
  let i = 0;
  img.onerror = () => {
    i += 1;
    if (i < chain.length) img.src = chain[i];
    else img.onerror = null;
  };
  img.onload = () => img.classList.remove("img-skeleton");
  img.src = chain[0];
  return img;
}

// Square icon/tile art — images/games/<id>/icon.png
function iconImage(game: Project, classes: string[]): HTMLElement {
  return fallbackImage(game.name, classes, [getGameImageUrl(game.id, "icon.png")], placeholderUrl(game.id, 600, 600));
}

// Wide banner art — images/games/<id>/banner.(jpg|png), else the square icon.
function bannerImage(game: Project, classes: string[]): HTMLElement {
  return fallbackImage(
    game.name,
    classes,
    [getGameImageUrl(game.id, "banner.jpg"), getGameImageUrl(game.id, "banner.png"), getGameImageUrl(game.id, "icon.png")],
    placeholderUrl(`${game.id}-banner`, 1600, 900)
  );
}

function platformsOf(project: Project): string[] {
  const declared = (project.platforms ?? []).filter((p) => p in PLATFORM_ICONS);
  if (declared.length > 0) return declared;
  // Fallback when a game has no explicit platform list.
  return project.website ? ["web"] : ["windows"];
}

function platformIcons(project: Project): HTMLElement {
  const wrapper = uiComponent({ classes: ["game-platforms", BubbleUI.BoxRow, BubbleUI.BoxYCenter] });
  wrapper.innerHTML = platformsOf(project)
    .map((platform) => PLATFORM_ICONS[platform])
    .filter(Boolean)
    .map((icon) => {
      const inner = icon.svg ?? `<path fill="${icon.color}" d="${icon.path}"></path>`;
      return `<svg viewBox="0 0 24 24" width="16" height="16" role="img" aria-label="${icon.label}"><title>${icon.label}</title>${inner}</svg>`;
    })
    .join("");
  return wrapper;
}

function statusBadge(project: Project): HTMLElement {
  const status = statusOf(project);
  const badge = uiComponent({
    classes: ["game-status", BubbleUI.BoxRow, BubbleUI.BoxYCenter],
    text: status.label,
    styles: { color: status.fg, backgroundColor: status.bg }
  });
  const dot = uiComponent({ classes: ["game-status-dot"], styles: { backgroundColor: status.dot } });
  badge.prepend(dot);
  return badge;
}

function engineLabel(project: Project): HTMLElement {
  const engine = uiComponent({
    classes: ["game-engine", BubbleUI.BoxRow, BubbleUI.BoxYCenter],
    text: project.engine ?? project.language
  });
  const dot = uiComponent({ classes: ["game-engine-dot"], styles: { backgroundColor: engineColor(project.engine) } });
  engine.prepend(dot);
  return engine;
}

// Deep-link helpers — every game is reachable at #/games/<id>
function gameHash(id: string): string {
  return `#/games/${id}`;
}

function navigateToGame(id: string) {
  location.hash = gameHash(id);
}

function backToGames() {
  location.hash = "#/games";
}

// Material Symbols Rounded (filled) glyph. `name` is the icon ligature.
function msr(name: string, classes: string[] = []): HTMLElement {
  return uiComponent({ type: Html.Span, classes: ["msr", ...classes], text: name });
}

function iconButton(icon: string, id: string, onclick: () => void): HTMLElement {
  const button = uiComponent({ type: Html.Button, id, classes: ["games-nav-button", BubbleUI.BoxCenter] });
  button.appendChild(msr(icon));
  button.onclick = onclick;
  return button;
}

function linkButton(text: string, href: string, primary: boolean): HTMLElement {
  return uiComponent({
    type: Html.A,
    classes: ["game-link", primary ? "primary" : "secondary"],
    text,
    attributes: { href, target: "_blank", rel: "noopener noreferrer" }
  });
}

export async function showGamesView(parameters: string[], container: HTMLElement) {
  setOpaqueBackground();

  const index = await loadProjects();
  const games = (index.games ?? [])
    .slice()
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.stars - a.stars);

  // Deep link: #/games/<id> renders that game's own full page.
  const requestedId = parameters[0]?.toLowerCase();
  if (requestedId) {
    const requested = games.find((game) => game.id.toLowerCase() === requestedId);
    if (requested) {
      container.appendChild(buildGamePage(requested));
      return;
    }
    // Unknown id — fall through to the list rather than a dead page.
  }

  container.appendChild(buildListView(games));
}

// Nintendo Switch (light theme) style home menu.
const WIFI_SVG = `<svg viewBox="0 0 24 24" width="20" height="20" fill="#3a3a3a"><path d="M12 18.5a1.7 1.7 0 100 3.4 1.7 1.7 0 000-3.4zM12 3C7.2 3 2.9 4.9 -.2 8l2.1 2.1C4.6 7.4 8.1 5.8 12 5.8s7.4 1.6 10.1 4.3L24.2 8C21.1 4.9 16.8 3 12 3zm0 5.2c-2.9 0-5.6 1.1-7.6 3.1l2.1 2.1A7.7 7.7 0 0112 11.4c2.1 0 4 .8 5.5 2.2l2.1-2.1a10.8 10.8 0 00-7.6-3.3z"/></svg>`;
const BATTERY_SVG = `<svg viewBox="0 0 28 24" width="26" height="20" fill="none"><rect x="1.5" y="7" width="22" height="10" rx="2.2" stroke="#3a3a3a" stroke-width="1.5"/><rect x="3.5" y="9" width="16" height="6" rx="1" fill="#3a3a3a"/><rect x="24.5" y="10" width="2" height="4" rx="1" fill="#3a3a3a"/></svg>`;

function currentTime(): string {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, "0");
  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${suffix}`;
}

function buildListView(games: Project[]): HTMLElement {
  const view = uiComponent({ type: Html.View, id: "games", classes: ["games-view", "games-console"] });

  // Top status bar — profile avatar left, time / wifi / battery right.
  const topBar = uiComponent({ classes: ["console-topbar", BubbleUI.BoxRow, BubbleUI.BoxYCenter] });

  const avatar = uiComponent({ classes: ["console-avatar", BubbleUI.BoxCenter] });
  avatar.style.backgroundImage = `url("${getOtherImageUrl("profile.jpg")}")`;
  topBar.appendChild(avatar);

  const status = uiComponent({ classes: ["console-status", BubbleUI.BoxRow, BubbleUI.BoxYCenter] });
  const clock = uiComponent({ classes: ["console-clock"], text: currentTime() });
  status.appendChild(clock);
  const glyphs = uiComponent({ classes: ["console-glyphs", BubbleUI.BoxRow, BubbleUI.BoxYCenter] });
  glyphs.innerHTML = WIFI_SVG + BATTERY_SVG;
  status.appendChild(glyphs);
  topBar.appendChild(status);
  view.appendChild(topBar);

  // Keep the clock ticking; self-clears once the view is detached.
  const timer = window.setInterval(() => {
    if (!clock.isConnected) {
      window.clearInterval(timer);
      return;
    }
    clock.textContent = currentTime();
  }, 15000);

  if (games.length === 0) {
    view.appendChild(uiComponent({ classes: ["console-empty"], text: "No titles yet." }));
    return view;
  }

  // Stage: focused-title label sitting above a left-aligned rail of tiles.
  const stage = uiComponent({ classes: ["console-stage", BubbleUI.BoxColumn] });

  const label = uiComponent({ classes: ["console-focused-name"] });
  stage.appendChild(label);

  const rail = uiComponent({ classes: ["console-rail", BubbleUI.BoxRow, BubbleUI.BoxYCenter] });
  const setFocus = (game: Project) => (label.textContent = game.name);
  games.forEach((game, i) => rail.appendChild(createTile(game, i === 0, setFocus)));
  stage.appendChild(rail);

  setFocus(games[0]);
  view.appendChild(stage);

  // Floating dock — a white pill of shortcuts, doubling as site navigation.
  const dock = uiComponent({ classes: ["console-dock", BubbleUI.BoxRow, BubbleUI.BoxYCenter] });
  dock.appendChild(dockButton("home", "#ffffff", () => (location.href = getWebUrl("#/"))));
  dock.appendChild(dockButton("code", "#e08a1e", () => (location.href = getWebUrl("#/software"))));
  dock.appendChild(dockButton("photo_camera", "#3aa76d", () => (location.href = getWebUrl("#/photos"))));
  dock.appendChild(dockButton("music_note", "#c33d8b", () => (location.href = getWebUrl("#/music"))));
  dock.appendChild(dockButton("auto_stories", "#3f7fd4", () => (location.href = getWebUrl("#/stories"))));
  view.appendChild(dock);

  // Button hints (bottom-right).
  const footer = uiComponent({ classes: ["console-footer", BubbleUI.BoxRow, BubbleUI.BoxYCenter] });
  const hints = uiComponent({ classes: ["console-hints", BubbleUI.BoxRow, BubbleUI.BoxYCenter] });
  hints.innerHTML =
    `<span class="console-hint"><span class="console-key">✛</span>Options</span>` +
    `<span class="console-hint"><span class="console-key filled">A</span>OK</span>`;
  footer.appendChild(hints);
  view.appendChild(footer);

  return view;
}

function createTile(game: Project, focused: boolean, onFocus: (game: Project) => void): HTMLElement {
  const tile = uiComponent({ type: Html.Button, classes: ["console-tile", BubbleUI.BoxCenter] });
  if (focused) tile.classList.add("focused");

  tile.appendChild(iconImage(game, ["console-tile-art"]));

  const focus = () => {
    tile.parentElement?.querySelectorAll(".console-tile.focused").forEach((el) => el.classList.remove("focused"));
    tile.classList.add("focused");
    onFocus(game);
  };
  tile.addEventListener("mouseenter", focus);
  tile.addEventListener("focus", focus);
  tile.onclick = () => navigateToGame(game.id);

  return tile;
}

function dockButton(icon: string, color: string, onclick: () => void): HTMLElement {
  const button = uiComponent({ type: Html.Button, classes: ["console-dock-button", BubbleUI.BoxCenter] });
  const glyph = msr(icon);
  glyph.style.color = color;
  button.appendChild(glyph);
  button.onclick = onclick;
  return button;
}

function factItem(label: string, value: string, accent?: string): HTMLElement {
  const item = uiComponent({ classes: ["game-fact", BubbleUI.BoxColumn] });
  item.appendChild(uiComponent({ classes: ["game-fact-label"], text: label }));
  const val = uiComponent({ classes: ["game-fact-value", BubbleUI.BoxRow, BubbleUI.BoxYCenter], text: value });
  if (accent) {
    const dot = uiComponent({ classes: ["game-fact-dot"], styles: { backgroundColor: accent } });
    val.prepend(dot);
  }
  item.appendChild(val);
  return item;
}

function buildGamePage(game: Project): HTMLElement {
  const view = uiComponent({ type: Html.View, id: "game-page", classes: ["games-view", "game-page"] });

  view.appendChild(iconButton("arrow_back", "back-button", backToGames));
  view.appendChild(iconButton("home", "home-button", () => (location.href = getWebUrl("#/"))));

  // Full-bleed hero banner with the key art + title block on top.
  const banner = uiComponent({ classes: ["game-page-banner"] });
  banner.appendChild(bannerImage(game, ["game-page-banner-art"]));

  const headline = uiComponent({ classes: ["game-page-headline", BubbleUI.BoxColumn] });
  const metaTop = uiComponent({ classes: ["game-meta", BubbleUI.BoxRow, BubbleUI.BoxYCenter] });
  metaTop.appendChild(statusBadge(game));
  metaTop.appendChild(platformIcons(game));
  headline.appendChild(metaTop);
  headline.appendChild(uiComponent({ type: Html.H1, classes: ["game-page-title"], text: game.name }));
  banner.appendChild(headline);
  view.appendChild(banner);

  // Body — description + actions on the left, a facts card on the right.
  const body = uiComponent({ classes: ["game-page-body"] });

  const main = uiComponent({ classes: ["game-page-main", BubbleUI.BoxColumn] });
  main.appendChild(uiComponent({ classes: ["game-page-eyebrow"], text: "ABOUT" }));
  main.appendChild(uiComponent({ type: Html.P, classes: ["game-page-desc"], text: game.description }));

  const actions = uiComponent({ classes: ["game-actions", BubbleUI.BoxRow, BubbleUI.BoxYCenter] });
  actions.appendChild(linkButton("Play", game.website ?? game.url, true));
  actions.appendChild(linkButton("View source", game.url, false));
  main.appendChild(actions);

  if ((game.tags ?? []).length > 0) {
    const tags = uiComponent({ classes: ["game-page-tags", BubbleUI.BoxRow] });
    game.tags.forEach((tag) =>
      tags.appendChild(uiComponent({ classes: ["game-tag"], text: tag.replace(/-/g, " ") }))
    );
    main.appendChild(tags);
  }

  const status = statusOf(game);
  const statusText = status.label.charAt(0) + status.label.slice(1).toLowerCase();
  const platforms = platformsOf(game)
    .map((p) => PLATFORM_ICONS[p]?.label ?? p)
    .join(", ");

  const aside = uiComponent({ classes: ["game-page-facts", BubbleUI.BoxColumn] });
  aside.appendChild(factItem("Status", statusText, status.dot));
  aside.appendChild(factItem("Engine", game.engine ?? "—", engineColor(game.engine)));
  aside.appendChild(factItem("Platforms", platforms));

  body.appendChild(main);
  body.appendChild(aside);
  view.appendChild(body);

  // Gallery — exactly `game.screenshots` shots from games/<id>/screenshots/<n>.<ext>.
  // Driven by the declared count so we never request beyond what exists; each shot
  // tries .png then .jpg, so PNG costs zero extra requests and JPG just one fallback.
  const count = game.screenshots ?? 0;
  if (count > 0) {
    const gallery = uiComponent({ classes: ["game-page-gallery"] });
    gallery.appendChild(uiComponent({ classes: ["game-page-eyebrow"], text: "GALLERY" }));
    const shots = uiComponent({ classes: ["game-page-shots"] });
    gallery.appendChild(shots);
    view.appendChild(gallery);

    const EXTS = ["png", "jpg"];
    for (let n = 1; n <= count; n++) {
      const shot = uiComponent({
        type: Html.Img,
        classes: ["game-shot", "img-skeleton"],
        attributes: { alt: `${game.name} screenshot ${n}` }
      }) as HTMLImageElement;
      let ext = 0;
      shot.onload = () => {
        shot.classList.remove("img-skeleton");
        // Match the cell to the image's real orientation so nothing is cropped.
        shot.style.aspectRatio = `${shot.naturalWidth} / ${shot.naturalHeight}`;
        shot.classList.toggle("portrait", shot.naturalHeight > shot.naturalWidth);
      };
      shot.onerror = () => {
        ext += 1;
        if (ext < EXTS.length) shot.src = getGameImageUrl(game.id, `screenshots/${n}.${EXTS[ext]}`);
        else shot.remove();
      };
      shot.onclick = () => openImagePreview(shot.src, shot.alt);
      shot.src = getGameImageUrl(game.id, `screenshots/${n}.${EXTS[0]}`);
      shots.appendChild(shot);
    }
  }

  return view;
}

// Fullscreen image preview (lightbox) — click anywhere to close.
function openImagePreview(src: string, alt: string) {
  document.getElementById("game-lightbox")?.remove();

  const overlay = uiComponent({ id: "game-lightbox", classes: [BubbleUI.BoxCenter] });
  const img = uiComponent({ type: Html.Img, attributes: { src, alt } });
  overlay.appendChild(img);
  overlay.onclick = () => overlay.remove();

  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      overlay.remove();
      document.removeEventListener("keydown", onKey);
    }
  };
  document.addEventListener("keydown", onKey);

  document.body.appendChild(overlay);
}
