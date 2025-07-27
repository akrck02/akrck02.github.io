import TopBar from "../component/top.bar.js";
import { BubbleUI } from "../lib/bubble.js";
import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";

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
		});

		const bar = TopBar.create("akrck02.org/projects");
		view.appendChild(bar);
		container.append(view);
	}
}
