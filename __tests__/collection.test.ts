import { describe, it, expect } from "vitest";
import { Collection } from "../lib/collection";
import { getCollection, materials, styles } from "../lib/collection";

describe("Collection", () => {
	it("should return a random item from the list", () => {
		const collection = new Collection(["a", "b", "c"]);
		const randomItem = collection.random();
		expect(["a", "b", "c"]).toContain(randomItem);
	});
});

describe("getCollection", () => {
	it("should return an object with material, style, and color properties", () => {
		const collection = getCollection();
		expect(collection).toHaveProperty("material");
		expect(collection).toHaveProperty("style");
		expect(collection).toHaveProperty("color");
	});

	it("should return a valid material, style, and color", () => {
		const collection = getCollection();
		const { material, style, color } = collection;
		expect(materials).toHaveProperty(material);
		expect(materials[material]).toContain(style);
		expect(styles).toHaveProperty(style);
		expect(styles[style]).toContain(color);
		// expect(colors).toContain(color);
	});
});

describe("materials and styles", () => {
	it("each material has a corresponding style", () => {
		const materialKeys = Object.keys(materials);
		materialKeys.forEach((materialKey) => {
			const stylesForMaterial = materials[materialKey];
			stylesForMaterial.forEach((style) => {
				expect(styles).toHaveProperty(style);
			});
		});
	});
});
