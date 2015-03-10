/* Sorts answers in this order: first the checked answer if present then answer number of vote */
'use strict';

var sortAnswers = function (e1, e2) {
	if (e1.checked) {
		return -1;
	}
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
			return 1;
		} else {
			if (r1 < r2) {
				return 1;
			} else {
				return -1;
			}
		}
	}
};

var getURLParameters = function (name) {
	var result = decodeURI((RegExp('[?|&]' + name + '=' + '(.+?)(&|$)').exec(location.href) || [, null])[1]); //jshint ignore:line
	return (result === 'null') ? null : result;
};

angular
	.module('stack')
	.config(function ($stateProvider, $urlRouterProvider, $provide) {

		/* Textangular options, same options as StackOverflow */
		$provide.decorator('taOptions', ['$delegate',
			function (taOptions) {
				taOptions.toolbar =
					[
						['bold', 'italics'],
						['insertLink', 'quote', 'pre', 'insertImage'],
						['ol', 'ul'],
						['h1', 'h2'],
						['undo', 'redo'],
						['html']
					];
				return taOptions;
			}
		]);

		$urlRouterProvider.otherwise("/");

		$stateProvider
			.state('home', {
				url: '/',
				templateUrl: '/pages/home.html',
				controller: 'homeCtrl',
				controllerAs: 'home'
			})
			.state('ask', {
				url: '/questions/ask',
				templateUrl: '/pages/ask.html',
				controller: 'askCtrl',
				controllerAs: 'askModel'
			})
			.state('questions', {
				url: '/questions/:id',
				templateUrl: '/pages/question.html',
				controller: 'answerCtrl',
				controllerAs: 'answer',
				resolve: {
					/* Populating the question with the related answers */
					question: function ($stateParams, questionsService) {
						return questionsService.getById($stateParams.id)
					}
				}
			})
			.state('tags', {
				url: '/tags',
				templateUrl: '/pages/tags.html',
				controller: 'tagsCtrl',
				controllerAs: 'tagsModel'
			})
			.state('users', {
				url: '/users',
				templateUrl: '/pages/users.html',
				controller: 'usersCtrl',
				controllerAs: 'usersModel',
				resolve: {
					/* Getting all users */
					users: function (usersService) {
						return usersService.getUsers();
					}
				}
			})



		// /* Route definition */
		// $routeProvider

		// /* Stamplay login route */
		// 	.when('/auth/v0/github/connect', {
		// 	controller: 'loginCtrl',
		// 	templateUrl: '/templates/templateEmpty.html'
		// })

		// /* Stamplay logout route */
		// .when('/auth/v0/logout', {
		// 	controller: 'logoutCtrl',
		// 	templateUrl: '/templates/templateEmpty.html'
		// })



		// /* Shows all available users */
		// .when('/users.html', {
		// 	templateUrl: '/templates/templateUsers.html',
		// 	controller: 'usersCtrl',
		// 	controllerAs: 'users',
		// 	resolve: {
		// 		/* Getting all users */
		// 		users: function (usersService) {
		// 			return usersService.getUsers();
		// 		}
		// 	}
		// })

		// /* If not route is matching */
		// .otherwise({
		// 	redirectTo: '/'
		// });
	})

/* 
	Before starting the application we're saving the user if present in the rootScope
	email, userId, profileImg and displayName variables are initializated in layout 
*/
.run(['$rootScope', 'userService',
	function ($rootScope, userService) {
		var user;
		userService.getUserModel()
			.then(function (userResp) {
				$rootScope.user = userResp;
			});
	}

]);