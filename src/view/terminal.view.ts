import { clearTerminal, executeUiCommand } from "../component/terminal.ui.js";
import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import Shortcuts, { KeyInteraction } from "../lib/shortcuts.js";
import { DEFAULT_COMMAND_CHANNEL } from "../service/command.service.js";

export async function showTerminalView(
	parameters: string[],
	container: HTMLElement,
) {
	const input = uiComponent({
		type: Html.Input,
		attributes: {
			placeholder: "$ ~",
		},
		styles: {
			width: "100%",
			height: "2rem",
			padding: ".5rem 0rem",
			borderRadius: ".5rem",
			margin: "1rem 0",
			fontSize: "1.25rem",
			background: "transparent",
			outline: "none",
		},
	}) as HTMLInputElement;

	const s = Shortcuts.register(input);
	Shortcuts.set(s, {
		interaction: KeyInteraction.keyUp,
		key: "ENTER",
		callback: async () => {
			container.removeChild(input);
			await executeUiCommand(DEFAULT_COMMAND_CHANNEL, input.value);
			container.appendChild(input);
			input.value = "";
			//	input.focus()

			const terminal = document.getElementsByClassName("terminal")[0];
			window.scrollTo(0, terminal.scrollHeight);
		},
	});

	clearTerminal();
	await executeUiCommand(DEFAULT_COMMAND_CHANNEL, "help");
	container.append(input);
	input.focus();
}
