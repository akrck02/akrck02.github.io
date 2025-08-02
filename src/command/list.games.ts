import { setTopBarTitle } from "../component/top.bar.js";
import { BubbleUI } from "../lib/bubble.js";
import { getConfiguration } from "../lib/configuration.js";
import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import { CodeProject, ProjectCategory } from "../model/project/projects.js";
import { getColoredSpan, getColoredSpanHtml } from "../service/color.service.js";
import PathService from "../service/path.service.js";
import TimeService from "../service/time.service.js";

const games = {
	"linus tiny adventure" : {
		name: "linus tiny adventure",
		description: "Pixelart 2D puzzle adventure.\nPlay as little guy trying to get to the next door." ,
		git: "https://github.com/akrck02/linus-tiny-adventure",
		category: ProjectCategory.Games,
		technologies: ["godot"],
		languages: ["gdscript"],
		releases: ["steam", "itch.io"],
		platforms : ["windows","linux"],
		image: "linus-tiny-adventure.png"
	},
	"Isometric pets" : {
		name: "Isometric pets",
		description: "Pixelart 2D puzzle adventure.\nPlay as little guy trying to get to the next door." ,
		git: "https://github.com/akrck02/isometric-pets",
		category: ProjectCategory.Games,
		technologies: ["godot"],
		languages: ["gdscript"],
		releases: ["steam", "playstore"],
		platforms : ["android", "windows","linux"],
		image: "isometric-pets.png"
	}
}

export async function listGames(out: (out: HTMLElement | string) => Promise<void>, cmd: string) {

	setTopBarTitle("akrck02.org/projects/games")

	for(const id in games) {
		const game = games[id]

		const card = uiComponent({
			classes: [BubbleUI.BoxColumn]
		})

		const title = uiComponent({
			text: game.name,
			classes: [BubbleUI.BoxRow, BubbleUI.BoxXStart, BubbleUI.BoxYCenter],
			styles : {
				padding: ".5rem 1rem",
				fontSize: "1.25rem",
				height: "3rem",
				width: "50rem",
				background: "var(--surface-1)",
				borderRadius : ".75rem",
				backdropFilter: "var(--surfacce-1-blur)"
			}
		})

		card.appendChild(title)

		const content = uiComponent({
			classes : [BubbleUI.BoxRow],
			styles : {
				padding: "2.5rem 0rem",
			}
		})
		card.appendChild(content)

		const image = uiComponent({
			type : Html.Img,
			attributes : {
				src : PathService.getImageUrl(game.image)
			},
			styles : {
				minWidth: "22rem",
				width: "22rem",
				height: "12rem",
				objectFit: "cover",
				background: "var(--surface-1)",
				borderRadius : ".5rem",
				filter: "brightness(.9)",
				backdropFilter: "var(--surface-1-blur)"
			}
		}) as HTMLImageElement

		image.onerror = () => {
			image.src = PathService.getImageUrl("not-found.png")
			image.innerHTML = "aaa"
		}

		const data = uiComponent({
			classes : [BubbleUI.BoxColumn],
			styles: {
				padding: "0 2rem"
			}
		})

		const released = uiComponent({
			text: `Released on ${game.releases.map(getColoredSpanHtml).join(", ")}`
		})
		data.appendChild(released)

		const madeWith = uiComponent({
			text: `Made with ${game.technologies.map(getColoredSpanHtml).join(", ")}`
		})
		data.appendChild(madeWith)

		const platforms = uiComponent({
			text: `Platforms: ${game.platforms.map(getColoredSpanHtml).join(", ")}`
		})
		data.appendChild(platforms)

		const description = uiComponent({
			text: `Description: <br> <span style="color: var(--on-surface-2)">${game.description.replaceAll("\n","<br>")}</span>`
		})
		data.appendChild(description)

		content.appendChild(image)
		content.appendChild(data)

		await out(card)
	}
}
