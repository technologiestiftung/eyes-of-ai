export class EnvError extends Error {
	constructor(variableName: string) {
		super(`[EnvError]: Environment variable ${variableName} is missing`);
	}
}

export class UserError extends Error {
	constructor(message: string) {
		super(`[UserError]: ${message}`);
	}
}

export class OpenAIError extends Error {
	constructor(message: string) {
		super(`[OpenAIError]: ${message}`);
	}
}

export class AppError extends Error {
	constructor(message: string) {
		super(`[AppError]: ${message}`);
	}
}

export class AuthError extends Error {
	constructor(message: string) {
		super(`[AuthError]: ${message}`);
	}
}
