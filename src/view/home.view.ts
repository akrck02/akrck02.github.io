import { setTopBarTitle } from "../component/top.bar.js";
import { BubbleUI } from "../lib/bubble.js";
import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import { getIcon } from "../lib/icons.js";
import { IconBundle, MaterialIcons } from "../model/configurations/icons.js";
import { redirect } from "../service/path.service.js";
import { currentNanoseconds } from "../service/time.service.js";

/**
 * Show home view
 */
export async function showHomeView(
	parameters: string[],
	container: HTMLElement,
) {
	setTopBarTitle("akrck02.org");

	let ns = currentNanoseconds();
	const view = uiComponent({
		type: Html.View,
		id: "home",
		classes: [BubbleUI.BoxColumn, BubbleUI.BoxCenter],
	});

	const content = uiComponent({
		id: "content",
		classes: [BubbleUI.BoxColumn, BubbleUI.BoxCenter],
	});

	const echo = uiComponent({
		type: Html.P,
		id: "echo",
		text: "echo",
	});
	content.appendChild(echo);

	const title = uiComponent({
		type: Html.H1,
		id: "title",
		text: "'Hello world'",
		classes: [BubbleUI.BoxRow, BubbleUI.BoxCenter],
	});
	content.appendChild(title);

	const timestamp = uiComponent({
		type: Html.P,
		id: "timestamp",
	});
	content.appendChild(timestamp);

	const subtitle = uiComponent({
		type: Html.H2,
		id: "subtitle",
		text: `I’m akrck02, a ${new Date().getFullYear() - 2000} year old <br> software developer.`,
	});
	content.appendChild(subtitle);

	const widget = createMiniTerminalWidget();
	content.appendChild(widget);

	view.appendChild(content);
	container.appendChild(view);
	document.getElementById("timestamp").innerText =
		`${currentNanoseconds() - ns}ns`;
}

/**
 * Create the mini terminal widget
 */
function createMiniTerminalWidget(): HTMLElement {
	const widget = uiComponent({
		id: "mini-terminal-widget",
		classes: [BubbleUI.BoxCenter],
	});

	const miniTerminal = uiComponent({
		id: "mini-terminal",
		classes: [BubbleUI.BoxRow, BubbleUI.BoxXStart, BubbleUI.BoxYCenter],
	});

	const dolarSign = uiComponent({
		type: Html.Span,
		id: "dolar",
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
	nextButton.onclick = () => redirect("projects");
	widget.appendChild(nextButton);

	return widget;
}
