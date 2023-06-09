//@ts-check
const fs = require("fs");
const path = require("path");

function copyFolderSync(from, to) {
	fs.mkdirSync(to, { recursive: true });
	fs.readdirSync(from).forEach((element) => {
		if (fs.lstatSync(path.join(from, element)).isFile()) {
			fs.copyFileSync(path.join(from, element), path.join(to, element));
		} else {
			copyFolderSync(path.join(from, element), path.join(to, element));
		}
	});
}

function main() {
	if (!process.env.NEXT_PUBLIC_HUMAN_MODELS_PATH) {
		throw new Error(
			"NEXT_PUBLIC_HUMAN_MODELS_PATH environment variable is not set"
		);
	}
	if (!process.env.NEXT_PUBLIC_TENSOR_WASM_PATH) {
		throw new Error(
			"NEXT_PUBLIC_TENSOR_WASM_PATH environment variable is not set"
		);
	}
	const model = {
		from: path.resolve(
			__dirname,
			"../node_modules/@vladmandic/human-models/models"
		),
		to: path.resolve(
			__dirname,
			`../.next/standalone/public/${process.env.NEXT_PUBLIC_HUMAN_MODELS_PATH}`
		),
	};
	const tensorWasm = {
		from: path.resolve(
			__dirname,
			"../node_modules/@tensorflow/tfjs-backend-wasm/dist"
		),
		to: path.resolve(
			__dirname,
			`../.next/standalone/public/${process.env.NEXT_PUBLIC_TENSOR_WASM_PATH}`
		),
	};

	copyFolderSync(model.from, model.to);
	copyFolderSync(tensorWasm.from, tensorWasm.to);
}
main();
