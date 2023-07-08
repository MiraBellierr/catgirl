module.exports = {
	apps: [
		{
			name: "catgirl",
			script: "node -r dotenv/config prod/main.js",
			env: {
				NODE_ENV: "development",
			},
			env_production: {
				NODE_ENV: "production",
			},
		},
	],
};
