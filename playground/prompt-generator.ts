class Collection {
	list: string[];

	constructor(list: string[]) {
		this.list = list;
	}

	random() {
		return this.list[Math.floor(Math.random() * this.list.length)];
	}
}

const imageTypes = new Collection([
	"portrait",
	"candid image",
	"documentary image",
	"event image",
	"landscape image",
	"still life imgae",
]);
const materials = new Collection([
	"oil painting",
	"crayon drawing",
	"watercolor",
	"acrylic painting",
	"gouache painting",
	"pastel drawing",
	"charcoal drawing",
	"pencil sketching",
	"ink drawing",
	"Collage",
	"etching",
	"lithography",
]);
const styles = new Collection([
	"folk art",
	"digital art",
	"concept art",
	"abstract art",
	"photography",
	"pixel art",
	"synthwave",
	"abstract",
	"conceptual",
	"surreal",
	"minimalist",
	"realistic",
	"impressionist",
	"expressionist",
	"cubist",
	"modern",
	"post-modern",
	"contemporary",
	"pop art",
	"fauvist",
	"dadaist",
	"symbolist",
	"romanticist",
	"renaissance",
	"baroque",
	"gothic",
	"rococo",
	"classical",
	"neoclassical",
	"pre-raphaelite",
	"art nouveau",
	"art deco",
]);
const colors = new Collection([
	"vibrant colors",
	"monochrome",
	"sepia",
	"pastels",
	"black and white",
	"neon colors",
	"infra-red",
]);

const expressions = new Collection([
	"happy",
	"sad",
	"angry",
	"confused",
	"surprised",
	"scared",
]);

const adjectives = new Collection([
	"expressive",
	"pale",
	"rainy",
	"lovely",
	"cute",
]);
const ages = new Collection([32, 42, 55, 65, 78, 90].map(String));
const gender = new Collection(["male", "female", "non-binary"]);

export function generatePrompt() {
	const prompt = `A ${adjectives.random()} ${expressions.random()} ${materials.random()} of an ${ages.random()} year old ${gender.random()}, ${styles.random()}, ${colors.random()}`;
	return prompt;
}

console.log(generatePrompt()); //

const examples = Array(50)
	.fill(0)
	.map(() => generatePrompt());

console.log(examples);
