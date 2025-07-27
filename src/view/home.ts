import { BubbleUI } from "../lib/bubble.js";
import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import { getIcon } from "../lib/icons.js";
import { AppConfigurations } from "../model/enum/configurations.js";
import { IconBundle, MaterialIcons } from "../model/enum/icons.js";
import PathService from "../service/path.service.js";
import TimeService from "../service/time.service.js";

export default class HomeView {
	// HTML ids and classes
	static readonly VIEW_ID = "home";
	static readonly CONTENT_ID = "content";
	static readonly ECHO_ID = "echo";
	static readonly TITLE_ID = "title";
	static readonly TIMESTAMP_ID = "timestamp";
	static readonly SUBTITLE_ID = "subtitle";
	static readonly EXPLORE_LINK_ID = "explore";
	static readonly MINI_TERMINAL_WIDGET_ID = "mini-terminal-widget";
	static readonly MINI_TERMINAL_ID = "mini-terminal";
	static readonly DOLAR_SIGN_ID = "dolar";

	/**
	 * Show home view
	 */
	static async show(parameters: string[], container: HTMLElement) {
		let ns = TimeService.currentNanoseconds();
		const view = uiComponent({
			type: Html.View,
			id: HomeView.VIEW_ID,
			classes: [BubbleUI.BoxColumn, BubbleUI.BoxCenter],
		});

		const content = uiComponent({
			id: HomeView.CONTENT_ID,
			classes: [BubbleUI.BoxColumn, BubbleUI.BoxCenter],
		});

		const echo = uiComponent({
			type: Html.P,
			id: HomeView.ECHO_ID,
			text: "echo",
		});
		content.appendChild(echo);

		const title = uiComponent({
			type: Html.H1,
			id: HomeView.TITLE_ID,
			text: "'Hello world'",
			classes: [BubbleUI.BoxRow, BubbleUI.BoxCenter],
		});
		content.appendChild(title);

		const timestamp = uiComponent({
			type: Html.P,
			id: HomeView.TIMESTAMP_ID,
		});
		content.appendChild(timestamp);

		const subtitle = uiComponent({
			type: Html.H2,
			id: HomeView.SUBTITLE_ID,
			text: `I’m akrck02, a ${new Date().getFullYear() - 2000} year old <br> software developer.`,
		});
		content.appendChild(subtitle);

		const widget = HomeView.createMiniTerminalWidget();
		content.appendChild(widget);

		view.appendChild(content);
		container.appendChild(view);
		document.getElementById(HomeView.TIMESTAMP_ID).innerText =
			`${TimeService.currentNanoseconds() - ns}ns`;
	}

	/**
	 * Create the mini terminal widget
	 */
	private static createMiniTerminalWidget(): HTMLElement {
		const widget = uiComponent({
			id: HomeView.MINI_TERMINAL_WIDGET_ID,
			classes: [BubbleUI.BoxCenter],
		});

		const miniTerminal = uiComponent({
			id: HomeView.MINI_TERMINAL_ID,
			classes: [BubbleUI.BoxRow, BubbleUI.BoxXStart, BubbleUI.BoxYCenter],
		});

		const dolarSign = uiComponent({
			type: Html.Span,
			id: HomeView.DOLAR_SIGN_ID,
			text: "$",
		});

		miniTerminal.appendChild(dolarSign);

		const command = uiComponent({
			type: Html.Input,
			attributes: {
				placeholder: "cd ./projects",
				value: "cd ./projects",
			},
		}) as HTMLInputElement;
		command.readOnly = true;

		miniTerminal.appendChild(command);
		widget.appendChild(miniTerminal);

		const nextButton = uiComponent({
			type: Html.Button,
			text: getIcon(IconBundle.Material, MaterialIcons.ArrowCircleRight)
				.outerHTML,
		});
		nextButton.onclick = () => PathService.redirect("projects");
		widget.appendChild(nextButton);

		return widget;
	}
}
