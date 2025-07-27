import Terminal from "../component/terminal.js";
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

		const terminal = Terminal.getInstance();
		view.appendChild(terminal.ui);

		terminal.execute({
			name: "ls ./projects",
			callback: async () => {
				const content = uiComponent({
					classes: [],
				});

				const projectsFound = uiComponent({
					classes: ["out-line"],
					text: "Found <span class='red'>63 projects</span> on projects directory.",
				});
				content.appendChild(projectsFound);

				const usingProgrammingLanguages = uiComponent({
					classes: ["out-line"],
					text: "Using <span class='red'>20 programming languages.</span>",
				});
				content.appendChild(usingProgrammingLanguages);

				const categories = uiComponent({
					classes: ["out-line"],
				});

				const developerTools = uiComponent({
					classes: ["out-line"],
					text: "	- <span class='blue'>Developer tools</span> → <span class='green'>12</span> projects.",
				});
				categories.appendChild(developerTools);

				const games = uiComponent({
					classes: ["out-line"],
					text: "	- <span class='blue'>Games</span> → <span class='green'>02</span> projects.",
				});
				categories.appendChild(games);

				const websites = uiComponent({
					classes: ["out-line"],
					text: "	- <span class='blue'>Websites</span> → <span class='green'>10</span> projects.",
				});
				categories.appendChild(websites);

				const cli = uiComponent({
					classes: ["out-line"],
					text: "	- <span class='blue'>Cli</span> → <span class='green'>08</span> projects.",
				});
				categories.appendChild(cli);

				content.appendChild(categories);

				return content;
			},
		});

		await terminal.render();
		container.append(view);
	}
}
