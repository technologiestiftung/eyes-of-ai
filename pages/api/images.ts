import { NextRequest } from "next/server";
import { EnvError, OpenAIError, UserError } from "../../lib/errors";

// OpenAIApi does currently not work in Vercel Edge Functions as it uses Axios under the hood. So we use the api by making fetach calls directly
export const config = {
	runtime: "edge",
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/images/generations";

export default async (req: NextRequest) => {
	try {
		if (!OPENAI_API_KEY) {
			throw new EnvError("OPENAI_API_KEY");
		}
		if (req.method !== "POST") {
			throw new UserError("Only POST requests are allowed");
		}

		const body = await req.json();
		if (!body) {
			throw new UserError("Request body is missing");
		}
		console.log(body);
		const { prompt } = body;
		if (!prompt) {
			throw new UserError("Prompt is missing");
		}

		return new Response(
			JSON.stringify({ error: "api route not ready for deploy." }),
			{
				status: 201,
			},
		);

		const response = await fetch(OPENAI_API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${OPENAI_API_KEY}`,
			},
			body: JSON.stringify({
				prompt,
				n: 1,
				size: "512x512",
			}),
		});
		if (!response.ok) {
			throw new OpenAIError(response.statusText);
		}
		const data = await response.json();
		console.log(data);

		return new Response(JSON.stringify(data), {
			status: 201,
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
