import { NextRequest } from "next/server";
import { Collection } from "../../lib/collection";
import { UserError } from "../../lib/errors";
import { ifError } from "assert";

export const config = {
	runtime: "edge",
};

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
	"collage",
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

export default async (req: NextRequest) => {
	try {
		if (req.method !== "POST") {
			throw new UserError("Only POST requests are allowed");
		}
		if (!req.body) {
			throw new UserError("Request body is missing");
		}
		const body = await req.json();
		console.log(body);
		if (!body) {
			throw new UserError("Request body is missing");
		}
		const { age, gender } = body;
		if (!age) {
			throw new UserError("`age` is missing");
		}
		if (!gender) {
			throw new UserError("`gender` is missing");
		}

		const prompt = `A ${adjectives.random()} ${expressions.random()} ${materials.random()} of an ${age} year old ${gender}, ${styles.random()}, ${colors.random()}`;

		return new Response(JSON.stringify({ prompt }), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
		});
	}
};
