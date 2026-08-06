import { BubbleUI } from "../lib/bubble.js";
import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import { getIcon } from "../lib/icons.js";
import { IconBundle, MaterialIcons } from "../model/configurations/icons.js";
import { getWebUrl } from "../service/path.service.js";
import { loadProjects, Project } from "../service/projects.service.js";
import { setOpaqueBackground } from "../service/ui.service.js";

export interface ProjectsViewConfig {
  id: string;
  icon: MaterialIcons;
  title: string;
  description: string;
  dataKey: "software" | "games";
}

export function createProjectsView(config: ProjectsViewConfig) {
  return async function (parameters: string[], container: HTMLElement) {
    setOpaqueBackground();

    const view = uiComponent({
      type: Html.View,
      id: config.id,
      classes: ["projects-view"]
    });
    container.appendChild(view);

    const homeButton = uiComponent({
      type: Html.Button,
      id: "home-button",
      classes: [BubbleUI.BoxCenter]
    });
    homeButton.innerHTML = getIcon(IconBundle.Material, MaterialIcons.Home, "24px", "#ffffff").outerHTML;
    homeButton.onclick = () => (location.href = getWebUrl("#/"));
    view.appendChild(homeButton);

    const hero = uiComponent({
      id: "projects-hero",
      classes: [BubbleUI.BoxColumn, BubbleUI.BoxCenter]
    });

    const heroIcon = uiComponent({
      id: "projects-hero-icon",
      classes: [BubbleUI.BoxCenter]
    });
    heroIcon.innerHTML = getIcon(IconBundle.Material, config.icon, "72px").outerHTML;
    hero.appendChild(heroIcon);

    const title = uiComponent({
      type: Html.H1,
      id: "projects-title",
      text: config.title
    });
    hero.appendChild(title);

    const description = uiComponent({
      type: Html.P,
      id: "projects-description",
      text: config.description
    });
    hero.appendChild(description);

    const hint = uiComponent({
      id: "projects-hero-hint",
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

    const filterBar = uiComponent({
      id: "projects-filters",
      classes: [BubbleUI.BoxRow, BubbleUI.BoxYCenter]
    });
    view.appendChild(filterBar);

    const grid = uiComponent({
      id: "projects-grid"
    });
    view.appendChild(grid);

    const index = await loadProjects();
    const projects = (index[config.dataKey] ?? [])
      .slice()
      .sort((a, b) => Number(b.featured) - Number(a.featured) || b.stars - a.stars);

    projects.forEach((project) => grid.appendChild(createCard(project)));

    buildFilters(filterBar, grid, projects);
  };
}

function buildFilters(filterBar: HTMLElement, grid: HTMLElement, projects: Project[]) {
  const counts = new Map<string, number>();
  projects.forEach((p) => counts.set(p.language, (counts.get(p.language) ?? 0) + 1));

  const count = (lang: string) => counts.get(lang) ?? 0;
  const languages = Array.from(counts.keys()).sort((a, b) => count(b) - count(a) || a.localeCompare(b));

  let language = "all";
  let showArchived = false;

  const apply = () => {
    grid.querySelectorAll(".project-card").forEach((card) => {
      const el = card as HTMLElement;
      const languageOk = language === "all" || el.dataset.language === language;
      const archivedOk = showArchived || !el.classList.contains("archived");
      el.classList.toggle("hidden", !(languageOk && archivedOk));
    });
  };

  const select = uiComponent({ type: "select", id: "language-select" }) as HTMLSelectElement;
  select.innerHTML = [
    `<option value="all">All languages (${projects.length})</option>`,
    ...languages.map((lang) => `<option value="${lang}">${lang} (${count(lang)})</option>`)
  ].join("");
  select.onchange = () => {
    language = select.value;
    apply();
  };
  filterBar.appendChild(select);

  const archivedButton = uiComponent({
    type: Html.Button,
    id: "archived-toggle",
    text: "Show archived"
  });
  archivedButton.onclick = () => {
    showArchived = !showArchived;
    archivedButton.classList.toggle("active", showArchived);
    archivedButton.innerText = showArchived ? "Hide archived" : "Show archived";
    apply();
  };
  filterBar.appendChild(archivedButton);

  apply();
}

function createCard(project: Project): HTMLElement {
  const card = uiComponent({
    type: Html.A,
    classes: ["project-card"],
    attributes: {
      href: project.url,
      target: "_blank",
      rel: "noopener noreferrer",
      "data-language": project.language
    }
  });
  if (project.featured) card.classList.add("featured");
  if (project.archived) card.classList.add("archived");
  if (project.website) card.classList.add("has-website");

  const header = uiComponent({
    classes: ["project-card-header", BubbleUI.BoxRow, BubbleUI.BoxYCenter]
  });

  const name = uiComponent({
    type: Html.H2,
    classes: ["project-name"],
    text: project.name
  });
  header.appendChild(name);

  if (project.website) {
    const live = uiComponent({
      classes: ["project-live"],
      text: "Live"
    });
    live.onclick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      window.open(project.website, "_blank", "noopener");
    };
    header.appendChild(live);
  }

  const stars = uiComponent({
    classes: ["project-stars"],
    text: `★ ${project.stars}`
  });
  header.appendChild(stars);
  card.appendChild(header);

  const description = uiComponent({
    type: Html.P,
    classes: ["project-description"],
    text: project.description
  });
  card.appendChild(description);

  const chips = uiComponent({
    classes: ["project-chips", BubbleUI.BoxRow]
  });

  const language = uiComponent({
    classes: ["project-language"],
    text: project.language
  });
  chips.appendChild(language);

  const badges = project.engine ? [project.engine] : project.stack ?? [];
  badges.forEach((badge) => {
    chips.appendChild(uiComponent({ classes: ["project-chip"], text: badge }));
  });

  if (project.archived) {
    chips.appendChild(uiComponent({ classes: ["project-chip", "archived-chip"], text: "Archived" }));
  }

  card.appendChild(chips);
  return card;
}
