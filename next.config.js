// @ts-check
/** @type {import('next').NextConfig} */

module.exports = {
	output: "standalone",
	reactStrictMode: false,
	poweredByHeader: false,
	typescript: {
		tsconfigPath: "./tsconfig.next.json",
	},
	webpack: (config, options) => {
		config.module.rules.push({ test: /human.esm.js/, type: "javascript/esm" });
		return config;
	},
};
