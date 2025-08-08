import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";


export function getColoredSpan(text : string) : HTMLElement {

	const colors = {
		windows : "blue",
		linux : "red",
		godot  : "blue",
		android : "green",
		steam : "darkblue",
		"itch.io": "pink",
		playstore: "green"
	}
	const color = colors[text]
	const span = uiComponent({
		type: Html.Span,
		text: text
	})

	if(undefined != color) span.classList.add(color)
	return span
}

export function getColoredSpanHtml(text : string) : string {
	return getColoredSpan(text).outerHTML
}
