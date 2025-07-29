import TerminalUI from "../component/terminal.html.js";
import TopBar from "../component/top.bar.js";
import { BubbleUI } from "../lib/bubble.js";
import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import FormatService from "../service/format.service.js";
import ProjectService from "../service/project.service.js";
import TimeService from "../service/time.service.js";

export default class ProjectsView {
  static readonly VIEW_ID = "projectsw";

  /**
   * Show home view
   */
  static async show(parameters: string[], container: HTMLElement) {
    const view = uiComponent({
      type: Html.View,
      id: ProjectsView.VIEW_ID,
      classes: [BubbleUI.BoxColumn, BubbleUI.BoxYCenter, BubbleUI.BoxXStart],
      styles: {
        width: "100%",
        height: "100%",
      },
    });

    const bar = TopBar.create("akrck02.org/projects");
    view.appendChild(bar);

    const terminal = TerminalUI.getInstance();
    terminal.clear();

    const content = uiComponent({
      classes: [BubbleUI.BoxColumn],
      styles: {
        width: "100%",
        height: "calc(100% - 2rem)",
        overflowY: "auto",
      },
    });
    view.appendChild(content);
    content.appendChild(terminal.ui);

    terminal.core.register("ls ./projects", ProjectsView.renderProjects);

    terminal.execute("ls ./projects");
    container.append(view);
  }

  static async renderProjects(out: OutputPipe, cmd: string) {
    const projects = await ProjectService.getGlobalCategoryStats();

    out(
      uiComponent({
        text: `Found <span class='red'>${projects?.stats?.languages ?? 0} projects</span> on projects directory.`,
      }).outerHTML,
    );

    out(
      uiComponent({
        text: `Using <span class='red'>${projects?.stats?.projects ?? 0} programming languages.</span>`,
      }).outerHTML,
    );

    projects.summaries.forEach((category) => {
      const component = uiComponent({
        classes: [BubbleUI.BoxXStart],
      });

      const name = uiComponent({
        type: Html.Span,
        text: category.name,
        classes: ["blue"],
        styles: {
          width: "10rem",
        },
      });
      component.appendChild(name);

      const arrow = uiComponent({
        type: Html.Span,
        text: "->",
        styles: {
          textAlign: "center",
          width: "3rem",
        },
      });
      component.appendChild(arrow);

      const projects = uiComponent({
        type: Html.Span,
        text: `${FormatService.fixedInteger(category.projects, 2)}`,
        classes: ["green"],
        styles: {
          width: "2rem",
        },
      });
      component.appendChild(projects);

      const prefix = uiComponent({
        type: Html.Span,
        text: "Projects.",
      });
      component.appendChild(prefix);
      out(component.outerHTML);
    });
  }
}
