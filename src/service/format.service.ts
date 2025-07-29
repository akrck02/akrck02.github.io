export default class FormatService {
  static fixedInteger(number: number, digits: number): string {
    const str = `${number}`;
    const missingDigits = Math.max(digits - str.length, 0);
    return `${"0".repeat(missingDigits)}${str}`;
  }
}
