import { test, describe, expect } from "vitest";
import { calcGender, inRange } from "../lib/properties";

describe("calcGender", () => {
	test("should return 'non-binary' when male and female percentages are both between 40 and 60", () => {
		const result = calcGender({ male: 50, female: 50 });
		expect(result).toBe("non-binary");
	});

	test("should return 'male' when male percentage is greater than female percentage", () => {
		const result = calcGender({ male: 70, female: 30 });
		expect(result).toBe("male");
	});

	test("should return 'female' when female percentage is greater than male percentage", () => {
		const result = calcGender({ male: 30, female: 70 });
		expect(result).toBe("female");
	});
});

describe("inRange", () => {
	test("should return true when value is within the range", () => {
		const result = inRange(5, 0, 10);
		expect(result).toBe(true);
	});

	test("should return false when value is outside the range", () => {
		const result = inRange(15, 0, 10);
		expect(result).toBe(false);
	});

	test("should return true when value is equal to the minimum", () => {
		const result = inRange(0, 0, 10);
		expect(result).toBe(true);
	});

	test("should return true when value is equal to the maximum", () => {
		const result = inRange(10, 0, 10);
		expect(result).toBe(true);
	});
});
