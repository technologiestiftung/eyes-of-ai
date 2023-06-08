import { NextRequest } from "next/server";
import { AppError, EnvError, OpenAIError, UserError } from "../../lib/errors";
import { createClient } from "@supabase/supabase-js";
import { decode } from "base64-arraybuffer";
import { v4 as uuidv4 } from "uuid";
import { Database } from "../../lib/database";
// OpenAIApi does currently not work in Vercel Edge Functions as it uses Axios under the hood. So we use the api by making fetach calls directly

export const config = {
	runtime: "edge",
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/images/generations";
const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
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

		const body = await req.json();
		if (!body) {
			throw new UserError("Request body is missing");
		}
		const { prompt } = body;
		if (!prompt) {
			throw new UserError("Prompt is missing");
		}
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
				response_format: "b64_json",
			}),
		});
		if (!response.ok) {
			throw new OpenAIError(response.statusText);
		}
		const json = (await response.json()) as {
			created: number;
			data: { b64_json: string }[];
		};

		const imageId = uuidv4();
		const { data: uploadData, error: uploadError } = await supabase.storage
			.from("eotai_images")
			.upload(`test/${imageId}.png`, decode(json.data[0].b64_json), {
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
			.insert({ id: imageId, prompt: prompt, url: publicImageUrl.publicUrl })
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
