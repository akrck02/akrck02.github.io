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
			padding: ".5rem 1rem",
			borderRadius: ".5rem",
			magin: "1rem",
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
			window.scrollTo(0, document.body.scrollHeight);
		},
	});

	clearTerminal();
	executeUiCommand(DEFAULT_COMMAND_CHANNEL, "neofetch");
	container.append(input);
	input.focus();
}
