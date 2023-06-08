/**
 * @example // To get all keys used types for mMaterial use
 * console.log(Object.keys(materials));
 */
type Material =
	| "A dripping liquid oil painting"
	| "A retro-futuristic cinematic etching"
	| "An inky watercolour painting"
	| "An expressive gouache illustration"
	| "A lithography"
	| "A sharp focused lithography"
	| "A detailed pastel drawing"
	| "An ink drawing"
	| "A purist acrylic painting"
	| "A spiritual acrylic painting";

/**
 * @example // To get all keys used types for Style use
 * const set = new Set();
 * Object.keys(materials).forEach((material) => {
 *	const stylesForMaterial = materials[material];
 * 	stylesForMaterial.forEach((style) => {
 * 		set.add(style);
 * 	});
 * });
 * console.log(set);
 */
type Style =
	| "realistic"
	| "modern"
	| "pop art"
	| "synthwave"
	| "abstract"
	| "art nouveau"
	| "pre-raphaelite"
	| "surreal art"
	| "pixel art"
	| "distorted pixel art"
	| "flat woodblock prints"
	| "ornamental curvilinear lines"
	| "conceptual art"
	| "digital art"
	| "dark-vintage"
	| "art deco"
	| "cubism"
	| "folk art";

/**
 * @example // To get all keys used types for Color use
 * const set = new Set();
 * Object.keys(styles).forEach((style) => {
 * 	const colorsForStyle = styles[style];
 * 	colorsForStyle.forEach((color) => {
 * 		set.add(color);
 * 	});
 * });
 * console.log(set);
 */
type Color =
	| "vibrant colours"
	| "global lightning"
	| "atmospheric vivid lightning"
	| "vibrant colors"
	| "serene color palette"
	| "primary colors with black and white"
	| "halftone patterns"
	| "neon colours"
	| "chromatic material"
	| "geometrical, luminous lines"
	| "colourful luminous lines"
	| "colourful"
	| "vibrant magenta, electric blue, fiery orange"
	| "vibrant splashes"
	| "vaporwave neon"
	| "retro color palettes"
	| "vaporwave neon and clear shapes"
	| "mind-bending shapes and colours"
	| "monochrome"
	| "black and white"
	| "dynamic and vivid lightning and rich hues"
	| "lgbtiq colours"
	| "raw light pastel colours"
	| "contrast-rich and monochromatic"
	| "symbolic colours"
	| "saturated pigments"
	| "eye-catching colour palette";
export class Collection {
	list: string[];

	constructor(list: string[]) {
		this.list = list;
	}

	random() {
		return this.list[Math.floor(Math.random() * this.list.length)];
	}
}

export const materials: Record<Material, Style[]> = {
	"A dripping liquid oil painting": ["realistic", "modern", "pop art"],
	"A retro-futuristic cinematic etching": ["synthwave"],
	"An inky watercolour painting": ["abstract", "art nouveau", "pre-raphaelite"],
	"An expressive gouache illustration": ["surreal art"], // Salvador Dalí
	"A lithography": ["pixel art", "distorted pixel art"],
	"A sharp focused lithography": [
		"flat woodblock prints",
		"ornamental curvilinear lines",
	],
	"A detailed pastel drawing": ["conceptual art"], // Craig Mullins
	"An ink drawing": ["digital art", "art deco"],
	"A purist acrylic painting": ["cubism"],
	"A spiritual acrylic painting": ["folk art"],
};

export const styles: Record<Style, Color[]> = {
	realistic: [
		"vibrant colours",
		"global lightning",
		"atmospheric vivid lightning",
	],
	modern: ["vibrant colors", "serene color palette"],
	"pop art": ["primary colors with black and white", "halftone patterns"],
	synthwave: [
		"neon colours",
		"chromatic material",
		"geometrical, luminous lines",
		"colourful luminous lines",
	],
	abstract: ["colourful", "vibrant magenta, electric blue, fiery orange"],
	"art nouveau": ["vibrant splashes"],
	"pre-raphaelite": ["vibrant colours"],
	"dark-vintage": ["vaporwave neon", "retro color palettes"],
	"surreal art": [
		"vaporwave neon",
		"vaporwave neon and clear shapes",
		"mind-bending shapes and colours",
	],
	"pixel art": ["monochrome"],
	"distorted pixel art": ["black and white"],
	"ornamental curvilinear lines": ["black and white"],
	"flat woodblock prints": ["black and white"],
	"conceptual art": [
		"dynamic and vivid lightning and rich hues",
		"atmospheric vivid lightning",
	],
	"digital art": ["vibrant colors", "lgbtiq colours"],
	"art deco": ["vibrant colors", "lgbtiq colours"],
	cubism: ["raw light pastel colours", "contrast-rich and monochromatic"],
	"folk art": [
		"symbolic colours",
		"saturated pigments",
		"eye-catching colour palette",
	],
};

export function getCollection(): {
	material: Material;
	style: Style;
	color: Color;
} {
	const materialKeys = Object.keys(materials) as Material[];
	const randomMaterialKey =
		materialKeys[Math.floor(Math.random() * materialKeys.length)];

	const stylesForMaterial = materials[randomMaterialKey];
	const randomStyle =
		stylesForMaterial[Math.floor(Math.random() * stylesForMaterial.length)];

	const colorsForStyle = styles[randomStyle];
	const randomColor =
		colorsForStyle[Math.floor(Math.random() * colorsForStyle.length)];

	return {
		material: randomMaterialKey,
		style: randomStyle,
		color: randomColor,
	};
}
