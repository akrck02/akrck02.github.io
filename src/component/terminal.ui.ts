import Animations from "../lib/animations.js";
import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import { sleep } from "../lib/time.js";
import { executeCommand } from "../model/terminal.js";
import { humanReadableTime } from "../service/format.service.js";
import { currentNanoseconds } from "../service/time.service.js";

let _ui: HTMLElement;

/**
 * instance terminal
 */
export function instanceTerminal() {
	if (undefined !== _ui) return;
	_ui = uiComponent({ classes: ["terminal"] });
}

/**
 * Clear the terminal
 */
export function clearTerminal() {
	_ui.innerHTML = "";
}

/**
 * Execute a command
 * @param channel The channel to which the command is sent
 * @param cmd The command to execute
 * @param renderer The command output renderer
 * @param showInput (optional) if input line is shown
 */
export async function executeUiCommand(
	channel: string,
	cmd: string,
	renderer: HTMLElement = undefined,
	showInput: boolean = true,
): Promise<void> {
	const start = currentNanoseconds();

	if (undefined === renderer) renderer = _ui;

	let input = undefined;
	if (!showInput) {
		const result = await executeCommand(channel, cmd);
		const renderTime = humanReadableTime((currentNanoseconds() - start) / 1000);
		console.debug("Rendered in", renderTime);
		for (const line of result) {
			const outputContainer = await createOutputContainer(line);
			renderer.appendChild(outputContainer);
			sleep(1);
			await Animations.show(outputContainer);
		}
		return;
	}

	input = uiComponent({
		classes: ["in"],
		text: `$ visitor (${new Date().toLocaleTimeString()}) ～ ${cmd}`,
	});
	renderer.appendChild(input);
	await Animations.typing(input);

	const result = await executeCommand(channel, cmd);
	const renderTime = humanReadableTime((currentNanoseconds() - start) / 1000);
	console.debug("Rendered in", renderTime);

	const time = uiComponent({
		type: Html.Span,
		text: ` - ${renderTime}`,
	});

	input.appendChild(time);
	await Animations.typing(time);
	for (const line of result) {
		const outputContainer = await createOutputContainer(line);
		renderer.appendChild(outputContainer);
		sleep(1);
		await Animations.show(outputContainer);
	}
}

/**
 * Output to the terminal renderer
 * @param data the output data
 */
async function createOutputContainer(
	data: HTMLElement | string,
): Promise<HTMLElement> {
	const output = uiComponent({ classes: ["out"] });

	if (typeof data == "string") output.innerHTML = data as string;
	else output.appendChild(data as HTMLElement);

	return output;
}

/**
 * Get terminal ui
 * @returns the terminal ui
 */
export function getTerminalUI(): HTMLElement {
	return _ui;
}
