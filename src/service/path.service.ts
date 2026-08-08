import { getConfiguration } from "../lib/configuration.js";

export function getWebUrl(appendix: string = ""): string {
	if (undefined != appendix || "" != appendix)
		return `${location.protocol}//${location.host}/${appendix}`;

	return `${location.protocol}//${location.host}`;
}

/** Base images directory (resources/images). */
export function getImageUrl(appendix: string = "") {
	return `${location.protocol}//${location.host}/${getConfiguration("path")["images"]}/${appendix}`;
}

/** Shared / miscellaneous images — images/other/<file> */
export function getOtherImageUrl(file: string) {
	return getImageUrl(`other/${file}`);
}

/** Per-game art — images/games/<id>/<file> */
export function getGameImageUrl(gameId: string, file: string) {
	return getImageUrl(`games/${gameId}/${file}`);
}

/** Per-software art — images/software/<id>/<file> */
export function getSoftwareImageUrl(softwareId: string, file: string) {
	return getImageUrl(`software/${softwareId}/${file}`);
}

/** Full-resolution album photo — images/photos/<album>/full/<file> */
export function getPhotoUrl(album: string, file: string) {
	return getImageUrl(`photos/${album}/full/${file}`);
}

/** Album thumbnail — images/photos/<album>/thumb/<file> */
export function getPhotoThumbnailUrl(album: string, file: string) {
	return getImageUrl(`photos/${album}/thumb/${file}`);
}

export function redirect(view: string, params: string[] = []) {
	location.href = getWebUrl(`#/${view}/${params.join("/")}`);
}
