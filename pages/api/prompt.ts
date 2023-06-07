import { NextRequest } from "next/server";
import { Collection } from "../../lib/collection";
import { UserError } from "../../lib/errors";
import { Emotion, FaceGesture, IrisGesture } from "@vladmandic/human";
import { Prompt } from "../../lib/validate-prompt";
import { getCollection } from "../../lib/collection";

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

const collection = getCollection();
const { material, style, color } = collection;


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

		const validatePrompt = Prompt;

		if (!validatePrompt(body)) {
			throw new UserError(
				// @ts-expect-error
				`Request body is invalid ${validatePrompt.errors
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
		const prompt = `A ${material} of a ${Math.floor(
			age,
		)} year old ${formatter.format(
			emotions,
		)} looking ${gender}, ${gestureCollection.random()}, ${style}, ${color}`;

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
