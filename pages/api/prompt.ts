import { Emotion, FaceGesture, IrisGesture } from "@vladmandic/human";
import { NextRequest } from "next/server";
import { Collection, getCollection, translateToDE } from "../../lib/collection";
import { EnvError, UserError } from "../../lib/errors";
import { Prompt } from "../../lib/validate-prompt";

export interface LocalizedPrompt {
	promptEn: string;
	promptDe: string;
}

export interface Body {
	age: number;
	gender: "male" | "female" | "non-binary";
	emotions: Emotion[];
	// TODO: What is going wrong with these typings?
	gestures: (IrisGesture | FaceGesture | string)[];
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

async function callChatGPT(
	prompt: string,
	materialDE: string,
	styleDE: string,
	colorDE: string
): Promise<LocalizedPrompt> {
	try {
		if (!OPENAI_API_KEY) {
			throw new EnvError("OPENAI_API_KEY");
		}
		if (!OPENAI_API_URL) {
			throw new EnvError("OPENAI_API_URL");
		}

		const translationPrompt = `Take the following prompt and translate it using ${materialDE}${styleDE}${colorDE}:\n${prompt}`;

		const headers = {
			"Content-Type": "application/json",
			Authorization: `Bearer ${OPENAI_API_KEY}`,
		};

		const body = JSON.stringify({
			model: "gpt-3.5-turbo",
			messages: [{ role: "user", content: translationPrompt }],
		});

		const response = await fetch(OPENAI_API_URL, {
			method: "POST",
			headers,
			body,
		});

		if (!response.ok) {
			throw new Error(`Request failed with status ${response.status}`);
		}

		const data = await response.json();

		return {
			promptEn: prompt,
			promptDe: data.choices[0].message.content,
		} as LocalizedPrompt;

		// return {
		// 	promptEn: "30 year old male looking left",
		// 	promptDe: "30 jähriger mann schaut nach links",
		// } as LocalizedPrompt;
	} catch (error) {
		console.error(error);
		throw new Error("An error occurred while calling the ChatGPT API");
	}
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
		const { age, gender, emotions, gestures } = validBody;
		const gestureCollection = new Collection(
			gestures.map((g) => {
				return g.match(/^mouth \d{1,3}% open$/) ? "with open mouth" : g;
			})
		);
		const formatter = new Intl.ListFormat("en", {
			style: "long",
			type: "conjunction",
		});
		const collection = getCollection();
		const { material, style, color } = collection;

		const collectionDE = translateToDE(collection);
		const { materialDE, styleDE, colorDE } = collectionDE;

		const prompt = `${material} of a ${Math.floor(
			age
		)} year old ${formatter.format(
			emotions
		)} looking ${gender}, ${gestureCollection.random()}, ${style}, ${color}`;

		const localizedPrompt = await callChatGPT(
			prompt,
			materialDE,
			styleDE,
			colorDE
		);

		return new Response(JSON.stringify({ localizedPrompt }), {
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
