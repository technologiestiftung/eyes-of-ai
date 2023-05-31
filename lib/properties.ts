export function inRange(value: number, min: number, max: number) {
	return value >= min && value <= max;
}

export function calcGender(gender: { male: number; female: number }) {
	let calculatedGender = "";

	if (inRange(gender.male, 40, 60) && inRange(gender.female, 40, 60)) {
		calculatedGender = "non-binary";
	} else if (gender.male > gender.female) {
		calculatedGender = "male";
	} else {
		calculatedGender = "female";
	}
	return calculatedGender;
}
