import { executeCommand, getTerminal, getTerminalUI } from "../component/terminal.ui.js";
import TopBar from "../component/top.bar.js";


/**
 * Show home view
 */
export async function showProjectsView(parameters: string[], container: HTMLElement) {
	TopBar.setTitle("akrck02.org/projects")
	await executeCommand("ls ./projects");
}
