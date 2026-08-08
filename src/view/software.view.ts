import { BubbleUI } from "../lib/bubble.js";
import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import { MaterialIcons } from "../model/configurations/icons.js";
import { getSoftwareImageUrl, getWebUrl } from "../service/path.service.js";
import { loadProjects, Project } from "../service/projects.service.js";
import { loadLatestRelease, Release, ReleaseAsset } from "../service/releases.service.js";
import { setOpaqueBackground } from "../service/ui.service.js";
import { createProjectsView } from "./projects.view.js";

// Language → accent color (GitHub Linguist palette). Drives the banner gradient.
const LANGUAGE_COLORS: { [language: string]: string } = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  "C#": "#178600",
  "C++": "#f34b7d",
  C: "#555555",
  Go: "#00ADD8",
  Rust: "#dea584",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Dart: "#00B4AB",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Shell: "#89e051",
  Lua: "#000080",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  GDScript: "#355570"
};

function languageColor(language?: string): string {
  return (language && LANGUAGE_COLORS[language]) || "#6b7280";
}

// Deep-link helper — every piece of software is reachable at #/software/<id>.
function softwareHash(id: string): string {
  return `#/software/${id}`;
}

// The list view, with cards deep-linking into each software's own page.
const showSoftwareList = createProjectsView({
  id: "software",
  icon: MaterialIcons.Code,
  title: "Software",
  description: "Apps, tools and libraries I have built and maintain.",
  dataKey: "software",
  detailHash: (project) => softwareHash(project.id)
});

export async function showSoftwareView(parameters: string[], container: HTMLElement) {
  // Deep link: #/software/<id> renders that project's own full page.
  const requestedId = parameters[0]?.toLowerCase();
  if (requestedId) {
    setOpaqueBackground();
    const index = await loadProjects();
    const requested = (index.software ?? []).find((p) => p.id.toLowerCase() === requestedId);
    if (requested) {
      container.appendChild(buildSoftwarePage(requested));
      return;
    }
    // Unknown id — fall through to the list rather than a dead page.
  }

  await showSoftwareList(parameters, container);
}

// Material Symbols Rounded (filled) glyph. `name` is the icon ligature.
function msr(name: string, classes: string[] = []): HTMLElement {
  return uiComponent({ type: Html.Span, classes: ["msr", ...classes], text: name });
}

function iconButton(icon: string, id: string, onclick: () => void): HTMLElement {
  const button = uiComponent({ type: Html.Button, id, classes: ["software-nav-button", BubbleUI.BoxCenter] });
  button.appendChild(msr(icon));
  button.onclick = onclick;
  return button;
}

function backToSoftware() {
  location.hash = "#/software";
}

function linkButton(text: string, href: string, primary: boolean): HTMLElement {
  return uiComponent({
    type: Html.A,
    classes: ["software-link", primary ? "primary" : "secondary"],
    text,
    attributes: { href, target: "_blank", rel: "noopener noreferrer" }
  });
}

function statusBadge(project: Project): HTMLElement {
  const archived = project.archived;
  const badge = uiComponent({
    classes: ["software-status", BubbleUI.BoxRow, BubbleUI.BoxYCenter],
    text: archived ? "ARCHIVED" : "MAINTAINED",
    styles: archived
      ? { color: "#7a7a7a", backgroundColor: "#ececec" }
      : { color: "#15803d", backgroundColor: "#eaf7ee" }
  });
  const dot = uiComponent({
    classes: ["software-status-dot"],
    styles: { backgroundColor: archived ? "#9a9a9a" : "#22c55e" }
  });
  badge.prepend(dot);
  return badge;
}

function factItem(label: string, value: string): HTMLElement {
  const item = uiComponent({ classes: ["software-fact", BubbleUI.BoxColumn] });
  item.appendChild(uiComponent({ classes: ["software-fact-label"], text: label }));
  item.appendChild(
    uiComponent({ classes: ["software-fact-value", BubbleUI.BoxRow, BubbleUI.BoxYCenter], text: value })
  );
  return item;
}

function buildSoftwarePage(project: Project): HTMLElement {
  const view = uiComponent({ type: Html.View, id: "software-page", classes: ["software-view", "software-page"] });

  view.appendChild(iconButton("arrow_back", "back-button", backToSoftware));
  view.appendChild(iconButton("home", "home-button", () => (location.href = getWebUrl("#/"))));

  // Plain header — status + language on top, then the title.
  const accent = languageColor(project.language);
  const header = uiComponent({ classes: ["software-page-header", BubbleUI.BoxColumn] });
  const metaTop = uiComponent({ classes: ["software-meta", BubbleUI.BoxRow, BubbleUI.BoxYCenter] });
  metaTop.appendChild(statusBadge(project));
  const languagePill = uiComponent({ classes: ["software-language-pill"], text: project.language });
  languagePill.prepend(uiComponent({ classes: ["software-language-dot"], styles: { backgroundColor: accent } }));
  metaTop.appendChild(languagePill);
  header.appendChild(metaTop);
  header.appendChild(uiComponent({ type: Html.H1, classes: ["software-page-title"], text: project.name }));
  view.appendChild(header);

  // Body — description + actions on the left, a facts card on the right.
  const body = uiComponent({ classes: ["software-page-body"] });

  const main = uiComponent({ classes: ["software-page-main", BubbleUI.BoxColumn] });
  main.appendChild(uiComponent({ classes: ["software-page-eyebrow"], text: "ABOUT" }));
  main.appendChild(uiComponent({ type: Html.P, classes: ["software-page-desc"], text: project.description }));

  const actions = uiComponent({ classes: ["software-actions", BubbleUI.BoxRow, BubbleUI.BoxYCenter] });
  if (project.website) actions.appendChild(linkButton("Website", project.website, true));
  if (project.docs) actions.appendChild(linkButton("Documentation", project.docs, !project.website));
  actions.appendChild(linkButton("View source", project.url, project.website == null && project.docs == null));
  main.appendChild(actions);

  if ((project.tags ?? []).length > 0) {
    const tags = uiComponent({ classes: ["software-page-tags", BubbleUI.BoxRow] });
    project.tags.forEach((tag) =>
      tags.appendChild(uiComponent({ classes: ["software-tag"], text: tag.replace(/-/g, " ") }))
    );
    main.appendChild(tags);
  }

  const stack = (project.stack ?? []).join(", ");
  const aside = uiComponent({ classes: ["software-page-facts", BubbleUI.BoxColumn] });
  aside.appendChild(factItem("Language", project.language));
  if (stack) aside.appendChild(factItem("Stack", stack));
  aside.appendChild(factItem("Stars", `★ ${project.stars}`));
  aside.appendChild(factItem("Status", project.archived ? "Archived" : "Maintained"));

  body.appendChild(main);
  body.appendChild(aside);
  view.appendChild(body);

  // Downloads — populated asynchronously from the repo's latest GitHub release.
  // Hidden until we know there are assets, so pages with no release show nothing.
  const downloads = uiComponent({ classes: ["software-page-downloads"], styles: { display: "none" } });
  view.appendChild(downloads);
  populateDownloads(downloads, project);

  // Gallery — exactly `project.screenshots` shots from software/<id>/screenshots/<n>.<ext>.
  const count = project.screenshots ?? 0;
  if (count > 0) {
    const gallery = uiComponent({ classes: ["software-page-gallery"] });
    gallery.appendChild(uiComponent({ classes: ["software-page-eyebrow"], text: "GALLERY" }));
    const shots = uiComponent({ classes: ["software-page-shots"] });
    gallery.appendChild(shots);
    view.appendChild(gallery);

    const EXTS = ["png", "jpg"];
    for (let n = 1; n <= count; n++) {
      const shot = uiComponent({
        type: Html.Img,
        classes: ["software-shot", "img-skeleton"],
        attributes: { alt: `${project.name} screenshot ${n}` }
      }) as HTMLImageElement;
      let ext = 0;
      shot.onload = () => {
        shot.classList.remove("img-skeleton");
        shot.style.aspectRatio = `${shot.naturalWidth} / ${shot.naturalHeight}`;
        shot.classList.toggle("portrait", shot.naturalHeight > shot.naturalWidth);
      };
      shot.onerror = () => {
        ext += 1;
        if (ext < EXTS.length) shot.src = getSoftwareImageUrl(project.id, `screenshots/${n}.${EXTS[ext]}`);
        else shot.remove();
      };
      shot.onclick = () => openImagePreview(shot.src, shot.alt);
      shot.src = getSoftwareImageUrl(project.id, `screenshots/${n}.${EXTS[0]}`);
      shots.appendChild(shot);
    }
  }

  return view;
}

function formatSize(bytes: number): string {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

// A single download entry — filename + size and the download link.
function downloadRow(asset: ReleaseAsset): HTMLElement {
  const row = uiComponent({ classes: ["software-download", BubbleUI.BoxRow, BubbleUI.BoxYCenter] });

  const glyph = uiComponent({ classes: ["software-download-icon", BubbleUI.BoxCenter] });
  glyph.appendChild(msr("insert_drive_file"));
  row.appendChild(glyph);

  const info = uiComponent({ classes: ["software-download-info", BubbleUI.BoxColumn] });
  info.appendChild(uiComponent({ classes: ["software-download-name"], text: asset.name }));
  const sub = formatSize(asset.size);
  if (sub) info.appendChild(uiComponent({ classes: ["software-download-meta"], text: sub }));
  row.appendChild(info);

  row.appendChild(
    uiComponent({
      type: Html.A,
      classes: ["software-link", "primary", "software-download-link"],
      text: "Download",
      attributes: { href: asset.url, target: "_blank", rel: "noopener noreferrer", download: "" }
    })
  );

  return row;
}

// Fetch the latest release and, if it has assets, fill in the downloads section.
async function populateDownloads(container: HTMLElement, project: Project) {
  let release: Release | null = null;
  try {
    release = await loadLatestRelease(project.url);
  } catch {
    return;
  }
  if (!release || release.assets.length === 0 || !container.isConnected) return;

  const header = uiComponent({ classes: ["software-page-downloads-header", BubbleUI.BoxRow, BubbleUI.BoxYCenter] });
  header.appendChild(uiComponent({ classes: ["software-page-eyebrow"], text: "DOWNLOAD" }));
  header.appendChild(uiComponent({ classes: ["software-download-tag"], text: release.tag }));
  container.appendChild(header);

  const list = uiComponent({ classes: ["software-download-list", BubbleUI.BoxColumn] });
  release.assets.forEach((asset) => list.appendChild(downloadRow(asset)));
  container.appendChild(list);

  container.style.display = "";
}

// Fullscreen image preview (lightbox) — click anywhere to close.
function openImagePreview(src: string, alt: string) {
  document.getElementById("software-lightbox")?.remove();

  const overlay = uiComponent({ id: "software-lightbox", classes: [BubbleUI.BoxCenter] });
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
