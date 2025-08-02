export function currentNanoseconds(): DOMHighResTimeStamp {
	return window.performance.now() * 1000;
}
