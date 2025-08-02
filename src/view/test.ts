import { clearTerminal, executeCommand, getTerminal, getTerminalUI, setTerminalRenderer } from "../component/terminal.ui.js";
import { BubbleUI } from "../lib/bubble.js";
import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import Shortcuts, { KeyInteraction } from "../lib/shortcuts.js";
import FormatService from "../service/format.service.js";
import TimeService from "../service/time.service.js";

export default class TerminalView {
	static readonly VIEW_ID = "terminal";

	/**
	 * Show home view
	 */
	static async show(parameters: string[], container: HTMLElement) {
		const startTime = TimeService.currentNanoseconds();
		const view = uiComponent({
			type: Html.View,
			id: TerminalView.VIEW_ID,
			classes: [BubbleUI.BoxColumn, BubbleUI.BoxXStart, BubbleUI.BoxYStart],
			styles: {
				width: "100%",
				height: "calc(100% - 11rem)",
			},
		});

		const input = uiComponent({
			type: Html.Input,
			attributes : {
				placeholder : "$ ~"
			},
			styles: {
				width: "100%",
				height: "2rem",
				padding: ".5rem 1rem",
				borderRadius: ".5rem",
				magin : "1rem",
				fontSize : "1.25rem",
				background: "transparent",
				outline : "none"
			},
		}) as HTMLInputElement;

		const s = Shortcuts.register(input)
		Shortcuts.set(s, {
			interaction : KeyInteraction.keyUp,
			key : "ENTER",
			callback : async () => {
				container.removeChild(input)
				await executeCommand(input.value)
				container.appendChild(input)
				input.value = ""
				//	input.focus()
				window.scrollTo(0, document.body.scrollHeight);
			}
		})


		clearTerminal()
		const terminal = getTerminal()
		terminal.register("neofetch", async (out, cmd) => {
			out("TERM");
		});

		executeCommand("neofetch");
		container.append(input);
		input.focus()
	}
}
