import { materials, styles } from "../lib/collection";

// console.log(Object.keys(materials));

const styleSet = new Set();

Object.keys(materials).forEach((material) => {
	const stylesForMaterial = materials[material];
	stylesForMaterial.forEach((style) => {
		styleSet.add(style);
	});
});
// console.log(styleSet);

const colorSet = new Set();

Object.keys(styles).forEach((style) => {
	const colorsForStyle = styles[style];
	colorsForStyle.forEach((color) => {
		colorSet.add(color);
	});
});
console.log(colorSet);

const material__dripping_liquid_oil_painting =
	materials["A dripping liquid oil painting"];
// console.log(material__dripping_liquid_oil_painting);

const style_from_material__modern = material__dripping_liquid_oil_painting[1];
// console.log(style_from_material__modern);

const color_from_style__modern = styles[style_from_material__modern];
// console.log(color_from_style__modern);
