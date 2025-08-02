export function fixedInteger(number: number, digits: number): string {
	const str = `${number}`;
	const missingDigits = Math.max(digits - str.length, 0);
	return `${"0".repeat(missingDigits)}${str}`;
}

export function humanReadableTime(nanoseconds: number): string {
	if (nanoseconds <= 999) return `${nanoseconds}ns`;

	let milliseconds = nanoseconds / 1000;
	if (milliseconds <= 999) return `${milliseconds}ms`;

	let seconds = milliseconds / 1000;
	if (seconds <= 60) return `${seconds}s`;

	let minutes = seconds / 60;
	if (minutes <= 60) return `${minutes}m`;

	return `${minutes / 60}h`;
}
