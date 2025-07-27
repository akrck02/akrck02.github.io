import { BubbleUI } from "../lib/bubble.js";
import { setDomEvents, uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import { getIcon } from "../lib/icons.js";
import { IconBundle, MaterialIcons } from "../model/enum/icons.js";
import PathService from "../service/path.service.js";

export default class NotFound {
	static readonly id = "not-found";

	static async show(params: string[], container: HTMLElement) {
		const errorView = uiComponent({
			type: Html.View,
			id: NotFound.id,
			classes: [BubbleUI.BoxColumn, BubbleUI.BoxCenter],
			styles: {
				height: "100%",
				width: "100%",
			},
		});

		const icon = getIcon(
			IconBundle.Material,
			MaterialIcons.Search,
			"10rem",
			"var(--surface-3)",
		);
		errorView.appendChild(icon);

		const h1 = uiComponent({
			type: Html.H1,
			text: "Page not found",
			styles: {
				color: "var(--surface-3)",
			},
		});
		errorView.appendChild(h1);

		const homeButton = uiComponent({
			type: Html.Button,
			text: "Return home",
			styles: {
				marginTop: "1.5rem",
				color: "var(--on-surface-2)",
			},
		});
		errorView.appendChild(homeButton);

		setDomEvents(homeButton, {
			click: () => {
				location.href = `${PathService.getWebUrl()}#`;
			},
		});

		container.appendChild(errorView);
	}
}
