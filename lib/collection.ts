import { Emotion, FaceGesture, IrisGesture } from "@vladmandic/human";

/**
 * @example // To get all keys used types for mMaterial use
 * console.log(Object.keys(materials));
 */
type IrisGestureDE =
	| "nach innen"
	| "nach links"
	| "nach rechts"
	| "nach oben"
	| "nach unten"
	| "in die Kamera";

type FaceGestureDE =
	| "in die Kamera"
	| "nach links"
	| "nach rechts"
	| "linkes Auge blinzelt"
	| "rechtes Auge blinzelt"
	| `Mund zu ${number}% geöffnet`
	| "Kopf nach oben"
	| "Kopf nach unten";

type EmotionDE =
	| "glücklich"
	| "traurig"
	| "wütend"
	| "überrascht"
	| "angewidert"
	| "ängstlich"
	| "neutral";

type Gender = "male" | "female" | "non-binary";
type GenderDE = "männliche" | "weibliche" | "nicht-binäre";

const IrisGestureTranslation: Record<IrisGesture, IrisGestureDE> = {
	"facing center": "in die Kamera",
	"looking left": "nach links",
	"looking right": "nach rechts",
	"looking up": "nach oben",
	"looking down": "nach unten",
	"looking center": "in die Kamera",
};

const FaceGestureTranslation: Record<FaceGesture, FaceGestureDE> = {
	"facing center": "in die Kamera",
	"facing left": "nach links",
	"facing right": "nach rechts",
	"blink left eye": "linkes Auge blinzelt",
	"blink right eye": "rechtes Auge blinzelt",
	"head up": "Kopf nach oben",
	"head down": "Kopf nach unten",
};

const EmotionTranslation: Record<Emotion, EmotionDE> = {
	happy: "glücklich",
	sad: "traurig",
	angry: "wütend",
	surprise: "überrascht",
	disgust: "angewidert",
	fear: "ängstlich",
	neutral: "neutral",
};

const GenderTranslation: Record<Gender, GenderDE> = {
	male: "männliche",
	female: "weibliche",
	"non-binary": "nicht-binäre",
};

export function translateGesture(gesture: string): IrisGestureDE {
	return IrisGestureTranslation[gesture] ?? FaceGestureTranslation[gesture];
}

export function translateEmotion(emotion: Emotion): EmotionDE {
	return EmotionTranslation[emotion];
}

export function translateGender(gender: Gender): GenderDE {
	return GenderTranslation[gender];
}

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

type MaterialDE =
	| "Ein tropfendes, flüssiges Ölgemälde"
	| "Eine retro-futuristische, filmische Radierung"
	| "Ein frisch getöntes Aquarellgemälde"
	| "Eine ausdrucksstarke Gouache-Illustration"
	| "Eine Lithographie"
	| "Eine scharfkantige Lithographie"
	| "Eine detaillierte Pastellzeichnung"
	| "Eine Tuschzeichnung"
	| "Ein puristisches Acrylgemälde"
	| "Ein spirituelles Acrylgemälde";

type StyleDE =
	| "realistisch"
	| "modern"
	| "Pop-Art"
	| "Synthwave"
	| "abstrakt"
	| "Jugendstil"
	| "Präraffaelitische Malerei"
	| "surreale Kunst"
	| "Pixelkunst"
	| "verzerrte Pixelkunst"
	| "flacher Holzschnitt-Druck"
	| "ornamentale, geschwungene Linien"
	| "konzeptuelle Kunst"
	| "digitale Kunst"
	| "dunkeler Vintage-Style"
	| "Art Déco"
	| "Kubismus"
	| "Volkskunst";

type ColorDE =
	| "lebhafte Farben"
	| "globales Licht"
	| "atmosphärische, lebendige Beleuchtung"
	| "beruhigende Farbpalette"
	| "Primärfarben mit Schwarz und Weiß"
	| "Rastertonmuster"
	| "Neonfarben"
	| "chromatisches Material"
	| "geometrische, leuchtende Linien"
	| "farbenfrohe, leuchtende Linien"
	| "farbenfroh und lebendig"
	| "lebhafte Magenta-, Elektroblau- und Feuerorange-Töne"
	| "lebhafte Farbspritzer"
	| "Vaporwave-Neon"
	| "retro Farbpalette"
	| "Vaporwave-Neon und klare Formen"
	| "verblüffende, unkonventionelle Formen und Farben"
	| "monochrom"
	| "schwarz und weiß"
	| "dynamische und lebendige Beleuchtung und satte Farbtöne"
	| "LGBTIQ-Farben"
	| "helle Pastellfarben"
	| "kontrastreiche und monochrome Farben"
	| "symbolträchtige Farben"
	| "gesättigte Pigmente"
	| "auffällige Farbpalette";

const materialTranslations: Record<Material, MaterialDE> = {
	"A dripping liquid oil painting": "Ein tropfendes, flüssiges Ölgemälde",
	"A retro-futuristic cinematic etching":
		"Eine retro-futuristische, filmische Radierung",
	"An inky watercolour painting": "Ein frisch getöntes Aquarellgemälde",
	"An expressive gouache illustration":
		"Eine ausdrucksstarke Gouache-Illustration",
	"A lithography": "Eine Lithographie",
	"A sharp focused lithography": "Eine scharfkantige Lithographie",
	"A detailed pastel drawing": "Eine detaillierte Pastellzeichnung",
	"An ink drawing": "Eine Tuschzeichnung",
	"A purist acrylic painting": "Ein puristisches Acrylgemälde",
	"A spiritual acrylic painting": "Ein spirituelles Acrylgemälde",
};

const styleTranslations: Record<Style, StyleDE> = {
	realistic: "realistisch",
	modern: "modern",
	"pop art": "Pop-Art",
	synthwave: "Synthwave",
	abstract: "abstrakt",
	"art nouveau": "Jugendstil",
	"pre-raphaelite": "Präraffaelitische Malerei",
	"surreal art": "surreale Kunst",
	"pixel art": "Pixelkunst",
	"distorted pixel art": "verzerrte Pixelkunst",
	"flat woodblock prints": "flacher Holzschnitt-Druck",
	"ornamental curvilinear lines": "ornamentale, geschwungene Linien",
	"conceptual art": "konzeptuelle Kunst",
	"digital art": "digitale Kunst",
	"dark-vintage": "dunkeler Vintage-Style",
	"art deco": "Art Déco",
	cubism: "Kubismus",
	"folk art": "Volkskunst",
};

const colorTranslations: Record<Color, ColorDE> = {
	"vibrant colours": "lebhafte Farben",
	"global lightning": "globales Licht",
	"atmospheric vivid lightning": "atmosphärische, lebendige Beleuchtung",
	"serene color palette": "beruhigende Farbpalette",
	"primary colors with black and white": "Primärfarben mit Schwarz und Weiß",
	"halftone patterns": "Rastertonmuster",
	"neon colours": "Neonfarben",
	"chromatic material": "chromatisches Material",
	"geometrical, luminous lines": "geometrische, leuchtende Linien",
	"colourful luminous lines": "farbenfrohe, leuchtende Linien",
	colourful: "farbenfroh und lebendig",
	"vibrant magenta, electric blue, fiery orange":
		"lebhafte Magenta-, Elektroblau- und Feuerorange-Töne",
	"vibrant splashes": "lebhafte Farbspritzer",
	"vaporwave neon": "Vaporwave-Neon",
	"retro color palettes": "retro Farbpalette",
	"vaporwave neon and clear shapes": "Vaporwave-Neon und klare Formen",
	"mind-bending shapes and colours":
		"verblüffende, unkonventionelle Formen und Farben",
	monochrome: "monochrom",
	"black and white": "schwarz und weiß",
	"dynamic and vivid lightning and rich hues":
		"dynamische und lebendige Beleuchtung und satte Farbtöne",
	"lgbtiq colours": "LGBTIQ-Farben",
	"raw light pastel colours": "helle Pastellfarben",
	"contrast-rich and monochromatic": "kontrastreiche und monochrome Farben",
	"symbolic colours": "symbolträchtige Farben",
	"saturated pigments": "gesättigte Pigmente",
	"eye-catching colour palette": "auffällige Farbpalette",
	"vibrant colors": "lebhafte Farben",
};

export function translateToDE(collection: {
	material: Material;
	style: Style;
	color: Color;
}): {
	materialDE: MaterialDE;
	styleDE: StyleDE;
	colorDE: ColorDE;
} {
	return {
		materialDE: materialTranslations[collection.material],
		styleDE: styleTranslations[collection.style],
		colorDE: colorTranslations[collection.color],
	};
}

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
