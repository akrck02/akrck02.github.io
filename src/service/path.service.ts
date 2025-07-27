export default class PathService {
	static getWebUrl(appendix: string = ""): string {
		if (undefined != appendix || "" != appendix)
			return `${location.protocol}//${location.host}/${appendix}`;

		return `${location.protocol}//${location.host}`;
	}

	static redirect(view: string, params: string[] = []) {
		location.href = this.getWebUrl(`#/${view}/${params.join("/")}`);
	}
}
