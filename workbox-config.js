module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{png,html,js,svg,jpg,webmanifest}'
	],
	swDest: 'dist/service-worker.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};