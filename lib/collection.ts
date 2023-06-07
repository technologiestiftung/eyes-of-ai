export class Collection {
	list: string[];

	constructor(list: string[]) {
		this.list = list;
	}

	random() {
		return this.list[Math.floor(Math.random() * this.list.length)];
	}
}

const materials = {
	"dripping liquid oil painting": ["realistic", "modern"],
	"retro-futuristic cinematic etching": ["synthwave"],
	"inky watercolour painting": ["abstract", "art nouveau", "pre-raphaelite"], 
	"expressive gouache illustration": ["surreal art"], // Salvador Dalí 
	"lithography": ["pixel art", "distorted pixel art"], 
	"sharp focused lithography": ["flat woodblock prints", "ornamental curvilinear lines"], 
	"detailed pastel drawing": ["conceptual art"], // Craig Mullins
	"ink drawing": ["digital art", "art deco"],
	"purist acrylic painting": ["cubism"], 
	"spiritual acrylic painting": ["folk art"]
}

const styles = {
	"realistic": ["vibrant colours", "global lightning", "atmospheric vivid lightning"],
	"synthwave": ["neon colours", "chromatic material", "geometrical, luminous lines", "colourful luminous lines"],
	"abstract": ["colourful"], 
	"art nouveau": ["vibrant splashes"],
	"pre-raphaelite": ["vibrant colours"], 
	"dark-vintage": ["vaporwave neon"], 
	"surreal art": ["vaporwave neon", "vaporwave neon and clear shapes", "mind-bending shapes and colours"], 
	"pixel art": ["monochrome"], 
	"distorted pixel art": ["black and white"],
	"ornamental curvilinear lines": ["black and white"],
	"flat woodblock prints": ["black and white"],
	"digital art": ["vibrant colors", "lgbtiq colours"],
	"art deco": ["vibrant colors", "lgbtiq colours"], 
	"cubism": ["raw light pastel colours", "contrast-rich and monochromatic"],
	"folk art": ["symbolic colours", "saturated pigments", "eye-catching colour palette"]

}

export function getCollection(): { material: string, style: string, color: string } {
	const materialKeys = Object.keys(materials);
	const randomMaterialKey = materialKeys[Math.floor(Math.random() * materialKeys.length)];

	const stylesForMaterial = materials[randomMaterialKey];
	const randomStyle = stylesForMaterial[Math.floor(Math.random() * stylesForMaterial.length)];
  
	const colorsForStyle = styles[randomStyle];
	const randomColor = colorsForStyle[Math.floor(Math.random() * colorsForStyle.length)];
  
	return {
	  material: randomMaterialKey,
	  style: randomStyle,
	  color: randomColor
	};
  }