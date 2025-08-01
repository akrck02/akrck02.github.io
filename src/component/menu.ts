import { BubbleUI } from "../lib/bubble.js"
import { setDomEvents, uiComponent } from "../lib/dom.js"
import { Html } from "../lib/html.js"
import Shortcuts, { KeyInteraction } from "../lib/shortcuts.js"
import { emitSignal, setSignal } from "../lib/signals.js"

export class Menu {
	static readonly CLASS = "menu"

	readonly selectedSignal = setSignal()
	readonly buttons = []

	private ui : HTMLElement
	private selectedItem : HTMLButtonElement
	private selectedIndex: number = 0;

	constructor(options : string[], selected = "") {

		this.ui = uiComponent({
			classes : [Menu.CLASS, BubbleUI.BoxColumn],
			styles : { padding : "1rem 0" }
		})

		let index = 0
		for(const option of options) {
			const item = uiComponent({
				type: Html.Button,
				text : option,
				data: { index: `${index}` }
			}) as HTMLButtonElement

			this.buttons.push(item)
			if (option == selected) {
				this.selectedIndex = index
				this.selectedItem = item;
				this.selectedItem.classList.add("selected")
			}

			this.handleInteractions(item, option)
			this.ui.appendChild(item)
			index++;
		}
	}

	private handleInteractions(item : HTMLButtonElement, option : string) {
		item.onclick = () => item.focus()
		item.onfocus = async () => await this.show(+item.dataset.index)

		const shortcutRegistry = Shortcuts.register(item)
		Shortcuts.set(shortcutRegistry, {
			interaction : KeyInteraction.keyDown,
			key : "ARROWUP",
			callback: () => this.buttons[this.selectedIndex-1 < 0 ? this.buttons.length - 1 : this.selectedIndex - 1].focus()
		})

		Shortcuts.set(shortcutRegistry, {
			interaction : KeyInteraction.keyDown,
			key : "ARROWDOWN",
			callback: () => this.buttons[this.selectedIndex + 1 >= this.buttons.length ? 0 : this.selectedIndex + 1].focus()
		})
	}


	async show(index : number = undefined) {

		this.selectedIndex = index
		for(const button of this.buttons) button.classList.remove("selected")
		this.selectedItem = this.buttons[this.selectedIndex]

		if(undefined == this.selectedItem) return

		this.selectedItem.classList.add("selected")
		await emitSignal(this.selectedSignal, this.selectedItem.innerText.toLocaleLowerCase())
	}

	getUi() : HTMLElement {
		return this.ui
	}

	getSelectedItem() : HTMLButtonElement {
		return this.selectedItem
	}
}
