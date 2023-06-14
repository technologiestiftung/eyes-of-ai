import { NextRequest } from "next/server";
import { EnvError } from "../../lib/errors";
import { Collection, getCollection, translateToDE } from "../../lib/collection";
import { UserError } from "../../lib/errors";
import { Emotion, FaceGesture, IrisGesture } from "@vladmandic/human";
import { Prompt } from "../../lib/validate-prompt";
import { Configuration, OpenAIApi } from 'openai';

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
  ): Promise<string> {
	try {
	  if (!OPENAI_API_KEY) {
		throw new EnvError("OPENAI_API_KEY");
	  }
	  if (!OPENAI_API_URL) {
		throw new EnvError("OPENAI_API_URL");
	  }

	  const configuration = new Configuration({
		apiKey: process.env.OPENAI_API_KEY,
	  });
  
	  const openai = new OpenAIApi(configuration);
  
	  try {
		const translationPrompt = `Take the following prompt and translate it using ${materialDE}${styleDE}${colorDE}:\n${prompt}`;
		const completion = await openai.createCompletion({
		  model: "text-davinci-003",
		  prompt: translationPrompt,
		});
		const promptDE = completion.data.choices[0].text;
		console.log(promptDE);
		return promptDE;
	  } catch (error) {
		if (error.response) {
		  console.log(error.response.status);
		  console.log(error.response.data);
		} else {
		  console.log(error.message);
		}
	  }
	} catch (error) {
	  console.error(error);
	  throw new Error("An error occurred while calling the ChatGPT API");
	}
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

		const promptDE = await callChatGPT(prompt, materialDE, styleDE, colorDE)

		console.log("my prompt:", prompt);
		console.log("my promptDE:", promptDE);

		const response = {
			prompt,
			promptDE
		  };

		console.log("response:", response)

		return new Response(JSON.stringify({ response }), {
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
