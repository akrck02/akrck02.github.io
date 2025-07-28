import { BubbleUI } from "../lib/bubble.js";
import { uiComponent } from "../lib/dom.js";
import { Terminal } from "./terminal.js";

export default class TerminalUI {
	private static readonly CLASS = "terminal";
	private static instance: TerminalUI;

	public ui: HTMLElement;
	public readonly core: Terminal;

	/**
	 * Get current terminal instance
	 */
	static getInstance(): TerminalUI {
		// if instance does exist, return it
		if (undefined == this.instance) this.instance = new TerminalUI();

		return this.instance;
	}

	/**
	 * Create ui
	 */
	constructor() {
		this.ui = uiComponent({
			classes: [TerminalUI.CLASS],
		});

		this.core = new Terminal();
		this.core.attach((out) => {
			const output = uiComponent({
				classes: ["out"],
				text: out,
			});
			this.ui.appendChild(output);
		});
	}

	/**
	 * Clear the terminal
	 */
	clear() {
		this.ui.innerHTML = "";
	}

	/**
	 * Execute a command
	 */
	execute(cmd: string) {
		const input = uiComponent({
			classes: ["in"],
			text: `$ user [${new Date().toLocaleTimeString()}] → ${cmd}`,
		});
		this.ui.appendChild(input);
		this.core.execute(cmd);
	}
}
