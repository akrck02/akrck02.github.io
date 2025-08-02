import { help } from "../command/help.js";
import { listCli } from "../command/list.cli.js";
import { listDevTools } from "../command/list.devtools.js";
import { listGames } from "../command/list.games.js";
import { listProjects } from "../command/list.projects.js";
import { listWebsites } from "../command/list.websites.js";
import { uuidv4 } from "../lib/crypto.js";
import { uiComponent } from "../lib/dom.js";
import { registerCommand } from "../model/terminal.js";

export const DEFAULT_COMMAND_CHANNEL = uuidv4();

/**
 * Register commands for the terminal
 */
export function setCommands() {
	registerCommand(DEFAULT_COMMAND_CHANNEL, "help", help);
	registerCommand(DEFAULT_COMMAND_CHANNEL, "ls ./projects", listProjects);
	registerCommand(DEFAULT_COMMAND_CHANNEL, "ls ./projects/games", listGames);
	registerCommand(
		DEFAULT_COMMAND_CHANNEL,
		"ls ./projects/developer tools",
		listDevTools,
	);
	registerCommand(
		DEFAULT_COMMAND_CHANNEL,
		"ls ./projects/websites",
		listWebsites,
	);
	registerCommand(DEFAULT_COMMAND_CHANNEL, "ls ./projects/cli", listCli);
	registerCommand(DEFAULT_COMMAND_CHANNEL, "yes", async () => {
		const elements = [];
		for (let i = 0; i < 100; i++) {
			elements.push(
				uiComponent({
					styles: {
						background: "var(--surface-2)",
						backdropFilter: "var(--surface-2-blur)",
						height: "2rem",
						width: "40rem",
					},
				}),
			);
		}
		return elements;
	});
}
