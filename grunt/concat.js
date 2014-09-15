module.exports = {

	options: {
		separator: "\n/* ---- HALLO HALLO ---- */\n",
		stripBanners: {
			block: true
		},
		banner: "/*! Stamplay v<%= pkg.version %> | " + "(c) 2014 The Stamplay Dreamteam */ \n"
	},

	css: {
		src: [
    './assets/index.css',
    './assets/question.css',
    './assets/answer.css',
    './assets/tags.css',
    './assets/users.css',
    './assets/footer.css',
    './assets/sidebar.css',			
    ],
		dest: './assets/stamplay-stackoverflow.min.css',
	},

	lib: {
		src: [
			'./assets/ng-infinite-scroll.js',
			'./assets/ui-bootstrap-0.11.0.min.js',
			'./assets/async.js',
			'./assets/moment.js'
		],
		dest: './assets/libs.min.js'
	},

	app: {
		src: [
      "./assets/loginCtrl.js",
      "./assets/logoutCtrl.js",
      "./assets/menuCtrl.js",
      "./assets/pointsCtrl.js",
      "./assets/createQuestionCtrl.js",
      "./assets/tagsCtrl.js",
      "./assets/usersCtrl.js",
      "./assets/answerCtrl.js",
      "./assets/answerCreatorCtrl.js",
      "./assets/homeCtrl.js"
		],
		dest: './assets/app.js'
	}

};