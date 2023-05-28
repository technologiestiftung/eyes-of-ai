/** @type {import('next').NextConfig} */

module.exports = {
	reactStrictMode: false,
	poweredByHeader: false,
	webpack: (config, options) => {
		config.module.rules.push({ test: /human.esm.js/, type: "javascript/esm" });
		return config;
	},
};
