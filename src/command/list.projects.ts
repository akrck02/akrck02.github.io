import { Menu } from "../component/menu.js";
import { clearTerminal, executeCommand, getTerminal, setTerminalRenderer } from "../component/terminal.ui.js";
import { BubbleUI } from "../lib/bubble.js";
import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import { connectToSignal } from "../lib/signals.js";
import ProjectService from "../service/project.service.js";

const VIEW_ID = "projects";
const SIDE_PANEL_ID = "side-panel"

/**
 * Render projects
 * @param out output method
 * @param cmd command predicate
 */
export async function listProjects(out: (out: HTMLElement | string) => Promise<void>, cmd: string) {

	const stats = await ProjectService.getGlobalCategoryStats();
	await out(`Found <a class='red'>${stats?.stats?.projects ?? 0} projects</a> on projects directory.`);
	await out(`Using <a class='red'>${stats?.stats?.languages ?? 0} programming languages.</a>`);

	const panel = uiComponent({
		type: Html.View,
		id : VIEW_ID,
		classes : [BubbleUI.BoxRow, BubbleUI.BoxXStart],
	})
	const menu = new Menu(stats.summaries.map(i => i.name))
	panel.appendChild(menu.getUi())

	const sidePanel = uiComponent({
		id : SIDE_PANEL_ID,
		classes : [BubbleUI.BoxColumn,BubbleUI.BoxXStart, BubbleUI.BoxXStart],
	})
	panel.appendChild(sidePanel)

	connectToSignal(menu.selectedSignal, (option) => showProjectCategory(option, menu, sidePanel))
	await out(panel)
	await menu.show(0)
	menu.getSelectedItem()?.click();
}

async function showProjectCategory(option : string, menu : Menu, sidePanel : HTMLElement ) {
	if(menu.getSelectedItem()?.innerHTML == option) return
	setTerminalRenderer(sidePanel)
	clearTerminal()
	await executeCommand(`ls ./projects/${option?.toLocaleLowerCase() ?? ""}`)
}
