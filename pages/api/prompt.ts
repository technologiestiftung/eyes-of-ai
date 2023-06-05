import { NextRequest } from "next/server";
import { Collection } from "../../lib/collection";
import { UserError } from "../../lib/errors";
import { Emotion, FaceGesture, IrisGesture } from "@vladmandic/human";
import { createValidator } from "../../lib/validation";

export interface Body {
	age: number;
	gender: "male" | "female" | "non-binary";
	emotions: Emotion[];
	// TODO: What is going wrong with these typings?
	gestures: (IrisGesture | FaceGesture | string)[];
}

const promptSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	type: "object",
	properties: {
		age: { type: "number" },
		gender: {
			type: "string",
			enum: ["male", "female", "non-binary"],
		},
		emotions: { type: "array", items: { type: "string" } },
		gestures: { type: "array", items: { type: "string" } },
	},
	required: ["age", "gender", "emotions", "gestures"],
	additionalProperties: false,
};

export const config = {
	runtime: "edge",
};

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
	"pixel art", // looks great
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

export default async (req: NextRequest) => {
	try {
		if (req.method !== "POST") {
			throw new UserError("Only POST requests are allowed");
		}
		if (!req.body) {
			throw new UserError("Request body is missing");
		}
		const body = await req.json();
		if (!body) {
			throw new UserError("Request body is missing");
		}

		const validate = createValidator(promptSchema);
		const valid = validate(body);
		if (!valid) {
			throw new UserError(
				`Request body is invalid ${validate.errors
					.map((error) => `${error.instancePath} ${error.message}`)
					.join(", ")}`,
			);
		}

		const validBody = body as Body;
		const { age, gender, emotions, gestures } = validBody;
		const gestureCollection = new Collection(
			gestures.map((g) => {
				return g.match(/^mouth \d{1,3}% open$/) ? "with open mouth" : g;
			}),
		);
		const formatter = new Intl.ListFormat("en", {
			style: "long",
			type: "conjunction",
		});
		const prompt = `A ${materials.random()} of a ${Math.floor(
			age,
		)} year old ${formatter.format(
			emotions,
		)} looking ${gender}, ${gestureCollection.random()}, ${styles.random()}, ${colors.random()}`;

		return new Response(JSON.stringify({ prompt }), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error: unknown) {
		if (error instanceof UserError) {
			return new Response(JSON.stringify({ error: error.message }), {
				status: 400,
			});
		} else if (error instanceof Error) {
			console.error(error);
			return new Response(JSON.stringify({ error: error.message }), {
				status: 500,
			});
		} else {
			console.error(error);
			return new Response(JSON.stringify({ error: "Unknown error" }), {
				status: 500,
			});
		}
	}
};
