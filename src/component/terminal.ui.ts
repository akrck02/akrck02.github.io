import Animations from "../lib/animations.js";
import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import { Terminal } from "../model/terminal.js";
import FormatService from "../service/format.service.js";
import TimeService from "../service/time.service.js";

const TERMINAL_UI_CLASS = "terminal";
let _core: Terminal;
let _ui: HTMLElement;
let _renderer: HTMLElement;

/**
 * instance terminal
 */
export function instanceTerminal(){
	if (undefined !== _ui) return
	_core = new Terminal()
	_core.attach(data => output(data));
	_ui = uiComponent({ classes: [TERMINAL_UI_CLASS] });
	_renderer = _ui
}

/**
 * Clear the terminal
 */
export function clearTerminal() {
	_renderer.innerHTML = "";
}

/**
 * Execute a command
 */
export async function executeCommand(cmd: string) {
	const start = TimeService.currentNanoseconds();
	if(_ui != _renderer) {
		await _core.execute(cmd);
		console.log("Rendered in",(TimeService.currentNanoseconds() - start)/1000,"ms")
		return
	}


	const input = uiComponent({
		classes: ["in"],
		text: `$ visitor (${new Date().toLocaleTimeString()}) ～ ${cmd}`,
	});

	_renderer.appendChild(input);
	await Animations.typing(input)

	await _core.execute(cmd);
	const time = uiComponent({
		type: Html.Span,
		text: ` - ${FormatService.humanReadableTime((TimeService.currentNanoseconds() - start))}`
	})

	input.appendChild(time)
	await Animations.typing(time)
}

/**
 * Output to the terminal renderer
 * @param data the output data
 */
async function output(data: HTMLElement | string) {
	const output = uiComponent({ classes: ["out"] });

	if (typeof data == "string") {
		output.innerHTML = data as string
	} else {
		output.appendChild(data as HTMLElement)
	}

	_renderer?.appendChild(output);
	await Animations.show(output);
}

/**
 * Get terminal ui
 * @returns the terminal ui
 */
export function getTerminalUI() : HTMLElement {
	return _ui
}

/**
 * Get terminal
 * @returns the terminal
 */
export function getTerminal() : Terminal {
	return _core
}

/**
 * Set a new renderer for terminal
 * @param renderer the renderer component
 */
export function setTerminalRenderer(renderer : HTMLElement) {
	_renderer = renderer ?? _ui
}

/**
 * Set default renderer
 */
export function resetTerminalRenderer() {
	_renderer = _ui
}
