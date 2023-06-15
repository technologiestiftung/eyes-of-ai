const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const standaloneCode = require("ajv/dist/standalone").default;

const prompt = {
	$id: "#/definitions/Prompt",
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
		colors: {
			type: "object",
			properties: {
				color: {
					type: "array",
					items: {
						type: "number",
					},
					minItems: 3,
					maxItems: 3,
				},
				palette: {
					type: "array",
					items: {
						type: "array",
						items: { type: "number" },
						minItems: 1,
						maxItems: 10,
					},
				},
				names: { type: "array", items: { type: "string" } },
			},
		},
	},
	required: ["age", "gender", "emotions", "gestures", "colors"],
	additionalProperties: true,
};

// For ESM, the export name needs to be a valid export name, it can not be `export const #/definitions/Foo = ...;` so we
// need to provide a mapping between a valid name and the $id field. Below will generate
// `export const Foo = ...;export const Bar = ...;`
// This mapping would not have been needed if the `$ids` was just `Bar` and `Foo` instead of `#/definitions/Foo`
// and `#/definitions/Bar` respectfully
const ajv = new Ajv({
	schemas: [prompt],
	code: { source: true, esm: true },
});
let moduleCode = standaloneCode(ajv, {
	Prompt: "#/definitions/Prompt",
});

fs.writeFileSync(path.join(__dirname, "../lib/validate-prompt.js"), moduleCode);
