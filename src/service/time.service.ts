export default class TimeService {
	static currentNanoseconds(): DOMHighResTimeStamp {
		return window.performance.now() * 1000;
	}
}
