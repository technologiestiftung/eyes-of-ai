//  based on
// https://github.com/vercel/examples/blob/main/edge-middleware/jwt-authentication/middleware.ts
import { SignJWT, jwtVerify } from "jose";
import { v4 as uuidv4 } from "uuid";

import { AuthError, EnvError } from "./errors";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 *
 * @deprecated
 */
export async function verifyCookie(token: string) {
	if (!JWT_SECRET) throw new EnvError("JWT_SECRET");
	if (!token) throw new AuthError("Missing token");
	try {
		const verified = await jwtVerify(
			token,
			new TextEncoder().encode(JWT_SECRET),
		);
		return verified.payload;
	} catch (err) {
		throw new AuthError("Your token is not valid");
	}
}
/**
 *
 * @deprecated
 */
export async function createToken() {
	if (!JWT_SECRET) throw new EnvError("JWT_SECRET");

	const token = await new SignJWT({})
		.setProtectedHeader({ alg: "HS256" })
		.setJti(uuidv4())
		.setIssuedAt()
		.setExpirationTime("24h")
		.sign(new TextEncoder().encode(JWT_SECRET));
	return token;
}
