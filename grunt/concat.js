module.exports = {

	options: {
		separator: "\n/* ---- HELLO HELLO ---- */\n",
		stripBanners: {
			block: true
		},
		banner: "/*! Stamplay v<%= pkg.version %> | " + "(c) 2014 The Stamplay Dreamteam */ \n"
	},

	css: {
		src: [
			'./css/index.css',
			'./css/question.css',
			'./css/answer.css',
			'./css/tags.css',
			'./css/users.css',
			'./css/footer.css',
			'./css/sidebar.css',
		],
		dest: './dist/stamplay-stackoverflow.min.css',
	},

	lib: {
		src: [
			'./js/lib/ng-infinite-scroll.js',
			'./js/lib/ui-bootstrap-0.11.0.min.js',
			'./js/lib/async.js'
		],
		dest: './dist/libs.min.js'
	},

	app: {
		src: [
			"./js/controllers/answerCtrl.js",
			"./js/controllers/answerEditCtrl.js",
			"./js/controllers/askCtrl.js",
			"./js/controllers/homeCtrl.js",
			"./js/controllers/loginCtrl.js",
			"./js/controllers/logoutCtrl.js",
			"./js/controllers/menuCtrl.js",
			"./js/controllers/tagsCtrl.js",
			"./js/controllers/usersCtrl.js"
		],
		dest: './dist/app.js'
	}

};