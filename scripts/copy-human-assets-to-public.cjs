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

	const modelBuild = {
		from: path.resolve(
			__dirname,
			"../node_modules/@vladmandic/human-models/models"
		),
		to: path.resolve(
			__dirname,
			`../.next/standalone/public/${process.env.NEXT_PUBLIC_HUMAN_MODELS_PATH}`
		),
	};

	const modelDev = Object.assign({}, modelBuild, {
		to: path.resolve(
			__dirname,
			`../public/${process.env.NEXT_PUBLIC_HUMAN_MODELS_PATH}`
		),
	});

	copyFolderSync(modelBuild.from, modelBuild.to);
	copyFolderSync(modelDev.from, modelDev.to);
}
main();
