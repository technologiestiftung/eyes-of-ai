import { createClient } from "@supabase/supabase-js";
import { EnvError } from "../lib/errors";
import { decode } from "base64-arraybuffer";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
// Create a single supabase client for interacting with your database

async function main() {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	const SUPABASE_URL = process.env.SUPABASE_URL;
	const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!SUPABASE_URL) {
		throw new EnvError("SUPABASE_URL");
	}
	if (!SUPABASE_SERVICE_ROLE_KEY) {
		throw new EnvError("SUPABASE_SERVICE_ROLE_KEY");
	}
	// Create a single supabase client for interacting with your database
	const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

	const { data: getData, error: getError } = await supabase.storage.getBucket(
		"avatars",
	);

	console.log(getData, getError);

	const contents = await readFile(
		path.resolve(__dirname, "./image-base64"),
		"utf8",
	);

	const { data: uploadData, error: uploadError } = await supabase.storage
		.from("avatars")
		.upload("public/avatar1.png", decode(contents), {
			contentType: "image/png",
		});

	const { data: listData, error } = await supabase.storage
		.from("avatars")
		.list("public", {
			limit: 100,
			offset: 0,
			sortBy: { column: "name", order: "asc" },
		});

	const { data } = supabase.storage
		.from("avatars")
		.getPublicUrl("public/avatar1.png");

	console.log(data);
}

main().catch(console.error);
