import { Menu } from "../component/menu.js";
import { clearTerminal, executeUiCommand } from "../component/terminal.ui.js";
import { BubbleUI } from "../lib/bubble.js";
import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import { connectToSignal } from "../lib/signals.js";
import { DEFAULT_COMMAND_CHANNEL } from "../service/command.service.js";
import { getGlobalCategoryStats } from "../service/project.service.js";

/**
 * Render projects
 */
export async function listProjects(): Promise<HTMLElement[]> {
	const stats = await getGlobalCategoryStats();
	const elements = [];

	elements.push(
		uiComponent({
			type: Html.P,
			text: `Found <a class='red'>${stats?.stats?.projects ?? 0} projects</a> on projects directory.`,
		}),
	);

	elements.push(
		uiComponent({
			type: Html.P,
			text: `Using <a class='red'>${stats?.stats?.languages ?? 0} programming languages.</a>`,
		}),
	);

	const panel = uiComponent({
		type: Html.View,
		id: "projects",
		classes: [BubbleUI.BoxRow, BubbleUI.BoxXStart],
	});
	const menu = new Menu(stats.summaries.map((i) => i.name));
	panel.appendChild(menu.getUi());

	const sidePanel = uiComponent({
		id: "side-panel",
		classes: [BubbleUI.BoxColumn, BubbleUI.BoxXStart, BubbleUI.BoxXStart],
	});
	panel.appendChild(sidePanel);

	connectToSignal(menu.selectedSignal, (option) =>
		showProjectCategory(option, menu, sidePanel),
	);
	elements.push(panel);
	await menu.show(0);
	menu.getSelectedItem()?.click();
	return elements;
}

async function showProjectCategory(
	option: string,
	menu: Menu,
	sidePanel: HTMLElement,
) {
	if (menu.getSelectedItem()?.innerHTML == option) return;
	sidePanel.innerHTML = "";
	await executeUiCommand(
		DEFAULT_COMMAND_CHANNEL,
		`ls ./projects/${option?.toLocaleLowerCase() ?? ""}`,
		sidePanel,
		false,
	);
}
