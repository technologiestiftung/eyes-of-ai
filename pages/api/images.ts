import { NextRequest } from "next/server";
import { AppError, EnvError, OpenAIError, UserError } from "../../lib/errors";
import { createClient } from "@supabase/supabase-js";
import { decode } from "base64-arraybuffer";
import { v4 as uuidv4 } from "uuid";
import { Database } from "../../lib/database";
import { LocalizedPrompt } from "./prompt";
import { ColorthiefResponse } from "../../lib/types";
import { Result } from "@vladmandic/human";
// OpenAIApi does currently not work in Vercel Edge Functions as it uses Axios under the hood. So we use the api by making fetach calls directly

export const config = {
	runtime: "edge",
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/images/generations";
const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

interface Body extends LocalizedPrompt {
	colors: ColorthiefResponse;
	result: Partial<Result>;
}
const handler = async (req: NextRequest) => {
	let payload: unknown;

	//TODO: DONT REMOVE might be needed for rate limiting
	// try {
	// 	payload = await verifyCookie(token);
	// } catch (error) {
	// 	if (error instanceof AuthError) {
	// 		const reponse = new Response(
	// 			JSON.stringify({ success: false, error: error.message }),
	// 			{
	// 				status: 401,
	// 				// headers: {
	// 				// cookie: `csrf=${""};`,
	// 				// },
	// 				// headers: resRateLimit.headers,
	// 			},
	// 		);
	// 		return reponse;
	// 	} else {
	// 		console.error(error);

	// 		const response = new Response(
	// 			JSON.stringify({ success: false, error: error.message }),
	// 			{
	// 				status: 500,
	// 				headers: {
	// 					cookie: `csrf=${""};`,
	// 				},
	// 				// headers: resRateLimit.headers,
	// 			},
	// 		);
	// 		return response;
	// 	}
	// }
	try {
		if (!NEXT_PUBLIC_SUPABASE_URL) {
			throw new EnvError("NEXT_PUBLIC_SUPABASE_URL");
		}
		if (!SUPABASE_SERVICE_ROLE_KEY) {
			throw new EnvError("SUPABASE_SERVICE_ROLE_KEY");
		}
		if (!OPENAI_API_KEY) {
			throw new EnvError("OPENAI_API_KEY");
		}
		if (req.method !== "POST") {
			throw new UserError("Only POST requests are allowed");
		}
		const supabase = createClient<Database>(
			NEXT_PUBLIC_SUPABASE_URL,
			SUPABASE_SERVICE_ROLE_KEY
		);

		const json = await req.json();
		if (!json) {
			throw new UserError("Request body is missing");
		}
		const body = json as Body;

		if (!body.promptEn) {
			throw new UserError("Prompt is missing");
		}
		const response = await fetch(OPENAI_API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${OPENAI_API_KEY}`,
			},
			body: JSON.stringify({
				prompt: body.promptEn,
				n: 1,
				size: "512x512",
				response_format: "b64_json",
			}),
		});
		if (!response.ok) {
			throw new OpenAIError(response.statusText);
		}
		const jsonOpenAI = (await response.json()) as {
			created: number;
			data: { b64_json: string }[];
		};

		const imageId = uuidv4();
		const { data: uploadData, error: uploadError } = await supabase.storage
			.from("eotai_images")
			.upload(`test/${imageId}.png`, decode(jsonOpenAI.data[0].b64_json), {
				contentType: "image/png",
			});

		if (uploadError) {
			console.error(uploadError);
			throw new AppError(uploadError.message);
		}
		if (!uploadData) {
			throw new AppError("Upload failed");
		}

		const { data: publicImageUrl } = supabase.storage
			.from("eotai_images")
			.getPublicUrl(`test/${imageId}.png`);

		const { data: metaData, error: metaError } = await supabase
			.from("eotai_images")
			.insert({
				id: imageId,
				prompt: body.promptEn,
				prompt_de: body.promptDe,
				url: publicImageUrl.publicUrl,
				color_names: body.colors.names,
				color_dominant: body.colors.color,
				//@ts-ignore Needs to be ignores since postgres does support arrays of arrays but they are stored as array
				// https://www.postgresql.org/docs/current/arrays.html
				//> The current implementation does not enforce the declared number of dimensions either. Arrays of a particular element type are all considered to be of the same type, regardless of size or number of dimensions. So, declaring the array size or number of dimensions in CREATE TABLE is simply documentation; it does not affect run-time behavior.
				color_palette: body.colors.palette as number[][],
				emotion: body.result.face[0].emotion,
				age: body.result.face[0].age,
				gender: body.result.face[0].gender,
				gender_score: body.result.face[0].genderScore,
				gesture: body.result.gesture,
			})
			.select("*");
		if (metaError) {
			throw new AppError(metaError.message);
		}
		if (!metaData) {
			throw new AppError("Insert into database failed");
		}

		return new Response(JSON.stringify({ data: metaData[0] }), {
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

export default handler;
