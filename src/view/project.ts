import TopBar from "../component/top.bar.js";
import { BubbleUI } from "../lib/bubble.js";
import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import TimeService from "../service/time.service.js";

export default class ProjectsView {
	static readonly VIEW_ID = "projectsw";

	/**
	 * Show home view
	 */
	static async show(parameters: string[], container: HTMLElement) {
		const startTime = TimeService.currentNanoseconds();
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

		const executedTime = (TimeService.currentNanoseconds() - startTime) / 1000;
		const command = uiComponent({
			type: Html.P,
			text: `$ user [${new Date().toLocaleTimeString()}] → ls ./projects [${executedTime}ms]`,
			styles: {
				padding: "0.5rem 1rem",
				width: "100%",
				color: "var(--primary-color)",
				font: "var(--font-console)",
			},
		});
		view.appendChild(command);

		container.append(view);
	}
}
