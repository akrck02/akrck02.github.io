import { executeUiCommand } from "../component/terminal.ui.js";
import { setTopBarTitle } from "../component/top.bar.js";
import { DEFAULT_COMMAND_CHANNEL } from "../service/command.service.js";

/**
 * Show home view
 */
export async function showProjectsView(
	parameters: string[],
	container: HTMLElement,
) {
	setTopBarTitle("akrck02.org/projects");
	await executeUiCommand(DEFAULT_COMMAND_CHANNEL, "ls ./projects");
}
