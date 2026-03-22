export function validateYear(value: string): boolean {
	return value === "" || /^[0-9]{1,4}$/.test(value);
}

export function clampYear(value: string): string {
	if (value === "") return "";
	const num = Number(value);
	const min = 1990;
	const max = new Date().getFullYear();
	const clamped = Math.min(Math.max(num, min), max);
	return String(clamped);
}

export function validateRating(value: string): boolean {
	return value === "" || /^([0-9](\.[0-9])?|10(\.0)?)$/.test(value);
}

export function clampRating(value: string): string {
	if (value === "") return "";
	const num = Number(value);
	const min = 0;
	const max = 10;
	const clamped = Math.min(Math.max(num, min), max);
	return String(clamped);
}
