import { getConfiguration } from "../lib/configuration.js";

export function getWebUrl(appendix: string = ""): string {
	if (undefined != appendix || "" != appendix)
		return `${location.protocol}//${location.host}/${appendix}`;

	return `${location.protocol}//${location.host}`;
}

export function getImageUrl(appendix: string = "") {
	return `${location.protocol}//${location.host}/${getConfiguration("path")["images"]}/${appendix}`;
}

export function redirect(view: string, params: string[] = []) {
	location.href = getWebUrl(`#/${view}/${params.join("/")}`);
}
