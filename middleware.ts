// jwt signing tzaken from https://github.com/vercel/examples/blob/main/edge-middleware/jwt-authentication/middleware.ts
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SignJWT } from "jose";
import { EnvError } from "./lib/errors";
const JWT_SECRET = process.env.JWT_SECRET;
export async function middleware(request: NextRequest) {
	if (!JWT_SECRET) throw new EnvError("JWT_SECRET");
	let response = NextResponse.next();
	let cookie = request.cookies.get("csrf");

	if (cookie === undefined) {
		const token = await new SignJWT({})
			.setProtectedHeader({ alg: "HS256" })
			.setJti(uuidv4())
			.setIssuedAt()
			.setExpirationTime("24h")
			.sign(new TextEncoder().encode(JWT_SECRET));

		// response.cookies.set("csrf", token, {
		// 	httpOnly: false,
		// 	maxAge: 60 * 60 * 24,
		// });
		return response;
	}

	return;
}
