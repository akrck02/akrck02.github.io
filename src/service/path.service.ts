import { getConfiguration } from "../lib/configuration.js";

export default class PathService {
	static getWebUrl(appendix: string = ""): string {
		if (undefined != appendix || "" != appendix)
			return `${location.protocol}//${location.host}/${appendix}`;

		return `${location.protocol}//${location.host}`;
	}

	static getImageUrl(appendix : string = "") {
		return `${location.protocol}//${location.host}/${getConfiguration("path")["images"]}/${appendix}`
	}

	static redirect(view: string, params: string[] = []) {
		location.href = this.getWebUrl(`#/${view}/${params.join("/")}`);
	}
}
