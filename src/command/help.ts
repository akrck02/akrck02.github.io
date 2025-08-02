import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import { getAvailableCommands } from "../model/terminal.js";
import { DEFAULT_COMMAND_CHANNEL } from "../service/command.service.js";

export async function help(): Promise<HTMLElement[]> {
	const elements = [];

	elements.push(
		uiComponent({
			type: Html.P,
			text: `Help`,
		}),
	);

	elements.push(
		uiComponent({
			type: Html.P,
			text: `-------------------------------------------`,
		}),
	);

	elements.push(
		uiComponent({
			type: Html.P,
			text: ``,
		}),
	);

	elements.push(
		uiComponent({
			type: Html.P,
			text: `This are the available commands:`,
		}),
	);

	const availableCommands = getAvailableCommands(DEFAULT_COMMAND_CHANNEL);
	for (let key of availableCommands) {
		elements.push(
			uiComponent({
				type: Html.P,
				text: key,
			}),
		);
	}

	return elements;
}
