import Ajv from "ajv";
const ajv = new Ajv();

export function createValidator(schema) {
	const validate = ajv.compile(schema);
	return validate;
}
