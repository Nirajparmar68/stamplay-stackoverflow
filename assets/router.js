/* Sorts answers in this order: first the checked answer if present then answer number of vote */
var sortAnswers = function (e1, e2) {
	if (e1.checked) {
		return -1;
	};
	if (e2.checked) {
		return 1;
	}
	var r1 = e1.actions.votes.total - e1.actions.ratings.total;
	var r2 = e2.actions.votes.total - e2.actions.ratings.total;
	if (r1 > 0) {
		if (r2 > 0) {
			if (r1 > r2) {
				return -1;
			} else {
				return 1;
			}
		} else {
			//r1 > 0 && r2 < 0
			return -1;
		}
	} else {
		//r1 <0 
		if (r2 > 0) {
			return 1
		} else {
			if (r1 < r2) {
				return 1;
			} else {
				return -1;
			}
		}
	}
}

var getURLParameters = function (name) {
	var result = decodeURI((RegExp('[?|&]' + name + '=' + '(.+?)(&|$)').exec(location.href) || [, null])[1]);
	return (result === "null") ? null : result;
};

app.config(function ($interpolateProvider, $routeProvider, $locationProvider, $sceDelegateProvider, $provide) {
	/* Since templates are on AWS S3 we load templates from http whitelisting the assets URL */
	$sceDelegateProvider.resourceUrlWhitelist(['self', 'http://cdn.stamplay.com/apps/'+ appId +'/assets/**']);

	/* Since Stamplay server side uses Handlebars, we are changing the Angular curly brackets in square brackets */
	$interpolateProvider.startSymbol('[[');
	$interpolateProvider.endSymbol(']]');

	/* Activating the HTML 5 mode for client side route handling */
	$locationProvider.html5Mode('true');

	/* Textangular options, same options as StackOverflow */
	$provide.decorator('taOptions', ['$delegate',
		function (taOptions) {
			taOptions.toolbar =
				[
					['bold', 'italics'], ['insertLink', 'quote', 'pre', 'insertImage'], ['ol', 'ul'], ['h1', 'h2'], ['undo', 'redo'], ['html']
				];
			return taOptions;
			}
	]);

	/* Route definition */
	$routeProvider

	/* Stamplay login route */
	.when('/auth/v0/github/connect', {
		controller: 'loginCtrl',
		templateUrl: 'https://cdn.stamplay.com/apps/'+ appId +'/assets/templateEmpty.html'
	})

	/* Stamplay logout route */
	.when('/auth/v0/logout', {
		controller: 'logoutCtrl',
		templateUrl: 'https://cdn.stamplay.com/apps/'+ appId +'/assets/templateEmpty.html'
	})

	/* Index route, shows a list of questions */
	.when('/index', {
		templateUrl: 'https://cdn.stamplay.com/apps/'+ appId +'/assets/templateIndex.html',
		controller: 'homeCtrl',
		resolve: {
			tag: function (tagService) {
				return tagService.getPromise();
			}
		}
	})


	/* Shows a question with the related answers */
	.when('/answer', {
		templateUrl: 'https://cdn.stamplay.com/apps/'+ appId +'/assets/templateAnswer.html',
		controller: 'answerCtrl',
		/* Dependencies */
		resolve: {
			/* Populating the question with the related answers */
			question: function ($q, $http, $routeParams) {
				var def = $q.defer();
				var questionId = getURLParameters('id');

				/* Get the question with _id = questionId */
				var url =  '/api/cobject/v0/question/' + questionId;
				$http({
					method: 'GET', 
					url: url,
					params : {
						populate :true
					}
				}).then(function (response) {
					var question = response.data;

					/* The answers are now populated */
					var allAnswers = question.answers;
					/* Sorting answers */
					allAnswers = allAnswers.sort(sortAnswers);
					question.answers = allAnswers;

					/* Populating the question's author */
					$http.get('/api/user/v0/users/' + question.author).success(
						function (res) {
							question.author = res;
							def.resolve(question);
						}
					);

				});
				return def.promise;
			},
			/* Gettings all available tags */
			tag: function (tagService) {
				return tagService.getPromise();
			}
		}

	})


	/* Create a new question */
	.when('/questions', {
		templateUrl: 'https://cdn.stamplay.com/apps/'+ appId +'/assets/templateQuestion.html',
		controller: 'createQuestionCtrl'
	})

	/* Shows all available tags */
	.when('/tags', {
		templateUrl: 'https://cdn.stamplay.com/apps/'+ appId +'/assets/templateTags.html',
		controller: 'tagsCtrl',
		resolve: {
			tag: function (tagService) {
				return tagService.getPromise();
			}
		}
	})

	/* Shows all available users */
	.when('/users', {
		templateUrl: 'https://cdn.stamplay.com/apps/'+ appId +'/assets/templateUsers.html',
		controller: 'usersCtrl',
		resolve: {
			/* Getting all users */
			users: function ($q, $http) {
				var def = $q.defer();
				$http({
					method: 'GET',
					url: '/api/user/v0/users'
				}).success(function (response) {
					def.resolve(response.data);
				});
				return def.promise;
			}
		}
	})

	/* If not route is matching */
	.otherwise({
		redirectTo: '/index'
	});
})
/* 
	Before starting the application we're saving the user if present in the rootScope
	email, userId, profileImg and displayName variables are initializated in layout 
*/
.run(['$rootScope', '$http',
	function ($rootScope, $http) {

		if (userLogged) {

			$rootScope.user = {
				email: email,
				id: userId,
				profileImg: profileImg,
				displayName: displayName
			};
		}

		}

	]);
