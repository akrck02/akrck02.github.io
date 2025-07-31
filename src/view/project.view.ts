import { Menu } from "../component/menu.js";
import TerminalUI from "../component/terminal.ui.js";
import TopBar from "../component/top.bar.js";
import Animations from "../lib/animations.js";
import { BubbleUI } from "../lib/bubble.js";
import { setDomStyles, uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import { connectToSignal, emitSignal } from "../lib/signals.js";
import { GlobalCategoryStats } from "../model/project/projects.js";
import FormatService from "../service/format.service.js";
import ProjectService from "../service/project.service.js";

export default class ProjectsView {
	static readonly VIEW_ID = "projects";
	static readonly SIDE_PANEL_ID = "side-panel"

	/**
	 * Show home view
	 */
	static async show(parameters: string[], container: HTMLElement) {
		TopBar.setTitle("akrck02.org/projects")
		TerminalUI.getInstance().execute("ls ./projects");
	}

	static async renderProjects(out: (out: HTMLElement | string) => Promise<void>, cmd: string) {
		const stats = await ProjectService.getGlobalCategoryStats();

		await out(`Found <a class='red'>${stats?.stats?.languages ?? 0} projects</a> on projects directory.`);
		await out(`Using <a class='red'>${stats?.stats?.projects ?? 0} programming languages.</a>`);

		const panel = uiComponent({
			type: Html.View,
			id : ProjectsView.VIEW_ID,
			classes : [BubbleUI.BoxRow, BubbleUI.BoxXStart],
		})
		const menu = new Menu(stats.summaries.map(i => i.name))
		panel.appendChild(menu.getUi())

		const sidePanel = uiComponent({
			id : ProjectsView.SIDE_PANEL_ID,
			classes : [BubbleUI.BoxColumn,BubbleUI.BoxXStart, BubbleUI.BoxXStart],
		})
		panel.appendChild(sidePanel)

		connectToSignal(menu.selectedSignal, async option => {
			if(menu.getSelectedItem()?.innerHTML == option) return

				const name = uiComponent({
					type: Html.Span,
					text: option,
					classes: ["green"],
					styles: {
						width: "15rem",
					},
				});
				sidePanel.innerHTML = ""
				sidePanel.appendChild(name);
				Animations.typing(name)
		})
		await out(panel)
		menu.show(0);
	}
}
