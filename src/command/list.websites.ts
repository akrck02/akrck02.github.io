import TopBar from "../component/top.bar.js";

export async function listWebsites(out: (out: HTMLElement | string) => Promise<void>, cmd: string) {
	TopBar.setTitle("akrck02.org/projects/websites")

}
