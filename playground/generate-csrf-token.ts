import { NextRequest } from "next/server";
import { middleware } from "../middleware";

async function main() {
	const req = new NextRequest("https://localhost:3000");
	const res = await middleware(req);

	console.log(res.cookies.get("csrf").value);
}

main().catch(console.error);
