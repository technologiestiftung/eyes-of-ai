import { NextRequest } from "next/server";
import { Collection } from "../../lib/collection";
import { UserError } from "../../lib/errors";
import { Emotion, FaceGesture, IrisGesture } from "@vladmandic/human";
import { Prompt } from "../../lib/validate-prompt";
import { getCollection } from "../../lib/collection";
import { ColorthiefResponse } from "../../lib/types";

export interface Body {
	age: number;
	gender: "male" | "female" | "non-binary";
	emotions: Emotion[];
	// TODO: What is going wrong with these typings?
	gestures: (IrisGesture | FaceGesture | string)[];
	colors: ColorthiefResponse;
}

export const config = {
	runtime: "edge",
};

const handler = async (req: NextRequest) => {
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
					.join(", ")}`
			);
		}

		const validBody = body as Body;
		const { age, gender, emotions, gestures, colors } = validBody;
		const gestureCollection = new Collection(
			gestures.map((g) => {
				return g.match(/^mouth \d{1,3}% open$/) ? "with open mouth" : g;
			})
		);
		/**
		 * Today I Learned: Oxford Comma
		 * The comma that you see before "and" in the list is known as the Oxford or serial comma. It's a stylistic choice in English writing to make the separation between items in a list clearer.
		 * In your code, `Intl.ListFormat` is used to format a list according to locale rules, which for English includes using commas to separate elements and "and" before the last element.
		 *When you set `type: 'conjunction'`, it means that an "and" will be added between the last two elements of your list when it's formatted. The comma before this "and" (the Oxford comma) is part of standard English formatting rules for lists.
		 * This usage can help avoid ambiguity in certain situations. For example, without an Oxford comma, a sentence like "I love my parents, Lady Gaga and Humpty Dumpty." could be interpreted as implying that Lady Gaga and Humpty Dumpty are your parents! With an Oxford comma ("I love my parents, Lady Gaga, and Humpty Dumpty."), it's clear we're talking about four separate entities here.
		 * While not all style guides agree on using the Oxford comma (it tends not to be used as much in journalistic writing), its use can help clarity - especially with more complex sentences or lists.
		 */
		const formatter = new Intl.ListFormat("en", {
			style: "long",
			type: "conjunction",
		});
		const collection = getCollection();
		const { material, style, color } = collection;

		const prompt = `${material} of a ${Math.floor(
			age
		)} year old ${formatter.format(
			emotions
		)} looking ${gender}, ${gestureCollection.random()}, ${style}, ${
			Math.random() > 0.5 ? color : formatter.format(colors.names)
		}`;
		console.log(prompt);

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

export default handler;
