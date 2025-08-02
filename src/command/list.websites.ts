import { setTopBarTitle } from "../component/top.bar.js";

export async function listWebsites(out: (out: HTMLElement | string) => Promise<void>, cmd: string) {
	setTopBarTitle("akrck02.org/projects/websites")

}
