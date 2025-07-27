import { BubbleUI } from "../lib/bubble.js";
import { uiComponent } from "../lib/dom.js";

type Command = { name: string; callback: () => Promise<HTMLElement> };

export default class Terminal {
	private static readonly CLASS = "terminal";
	private static instance: Terminal;

	public ui: HTMLElement;
	private commands: Command[];

	/**
	 * Get current terminal instance
	 */
	static getInstance(): Terminal {
		// if instance does exist, return it
		if (undefined == this.instance) this.instance = new Terminal();
		return this.instance;
	}

	/**
	 * Create ui
	 */
	constructor() {
		this.commands = [];
		this.ui = uiComponent({
			classes: [Terminal.CLASS],
		});
	}

	/**
	 * Clear the terminal
	 */
	clear() {
		this.commands = [];
		this.ui.innerHTML = "";
	}

	/**
	 * Execute a command
	 */
	execute(cmd: Command) {
		this.commands.push(cmd);
	}

	/**
	 * Render the terminal
	 */
	async render() {
		console.log(this.commands);
		for (const cmd of this.commands) {
			console.log(cmd);
			const commandBlock = uiComponent({
				classes: ["command", BubbleUI.BoxColumn],
			});

			const input = uiComponent({
				classes: ["in"],
				text: `$ user [${new Date().toLocaleTimeString()}] → ${cmd.name}`,
			});
			commandBlock.appendChild(input);

			const output = uiComponent({
				classes: ["out"],
			});
			commandBlock.appendChild(output);
			this.ui.appendChild(commandBlock);

			const content = await cmd.callback();
			output.appendChild(content);
		}
	}
}
