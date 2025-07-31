import Animations from "../lib/animations.js";
import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import { Terminal } from "../model/terminal.js";
import FormatService from "../service/format.service.js";
import TimeService from "../service/time.service.js";

export default class TerminalUI {
	private static readonly CLASS = "terminal";
	private static instance: TerminalUI;

	public readonly core: Terminal;
	public ui: HTMLElement;

	/**
	 * Get current terminal instance
	 */
	static getInstance(): TerminalUI {

		// if instance does not exist, create it
		if (undefined === this.instance) this.instance = new TerminalUI();
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
		this.core.attach(data => this.out(data));
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
	async execute(cmd: string) {
		const start = TimeService.currentNanoseconds();
		const input = uiComponent({
			classes: ["in"],
			text: `$ visitor (${new Date().toLocaleTimeString()}) ～ ${cmd}`,
		});

		this.ui.appendChild(input);
		await Animations.typing(input)
		await this.core.execute(cmd);

		const time = uiComponent({
			type: Html.Span,
			text: ` - ${FormatService.humanReadableTime((TimeService.currentNanoseconds() - start))}`
		})

		input.appendChild(time)
		Animations.typing(time)
	}

	async out (out : HTMLElement | string) {
		const output = uiComponent({
			classes: ["out"],
		});

		if(typeof out == "string") {
			output.innerHTML = out as string
		} else {
			output.appendChild(out as HTMLElement)
		}

		this.ui.appendChild(output);
		await Animations.show(output);
	}
}
