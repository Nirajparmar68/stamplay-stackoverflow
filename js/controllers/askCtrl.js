/*global angular*/
'use strict';
/*
When this controller starts it initializes two variables 
in the `$scope`: `cobj` and `questionSubmitted`. 
The former represent the new instance for the question 
while the latter is a boolean value to check that the 
question has been submitted succesfully.
It also implement the function `getTags` for autocompleting 
the tag that users can bind to the question.
*/
angular
	.module('stack')
	.controller('askCtrl', ['$rootScope', '$http', '$location', 'userService', 'tagsService', 'questionsService',
		function ($rootScope, $http, $location, userService, tagsService, questionsService) {
			var askModel = this;
			askModel.cobj = {};
			askModel.cobj.tags = [];
			askModel.selected = [];
			askModel.cobj.answers = [];
			askModel.cobj.views = 0;
			askModel.questionSubmitted = false;

			userService.getUserModel().then(function (response) {
				askModel.cobj.author = response._id;
			});

			askModel.tags = [];
			var tagName2Id = {};

			/* Used from typeahead to retrieve tags that matches the user search */
			askModel.getTags = function (val) {
				askModel.tags.length = 0;

				var reg = '".*' + val + '.*"';
				var query = {
					'where': '{"name": {"$regex" : ' + reg + '}}'
				};

				return tagsService.searchTag(query)
					.then(function (res) {
						askModel.tags = res.map(function(tag) {
							if(askModel.cobj.tags.indexOf(tag._id) < 0) {
								return {
									name : tag.name,
									_id : tag._id
								}
							}
						})

						return _.without(askModel.tags, undefined);
					});
			};

			askModel.onSelect = function ($item, $model, $label) { //jshint ignore:line				
				askModel.selected.push($item);
				askModel.cobj.tags.push($item._id);
				askModel.current = ""
			};

			askModel.removeTag = function(idx) {
				askModel.cobj.tags.splice(idx, 1);
				askModel.selected.splice(idx, 1);
			}

			/* Creates a new question */
			askModel.createQuestion = function () {
				askModel.busy = true
				questionsService.saveQuestion(askModel.cobj)
					.then(function () {
						askModel.cobj = {};
						askModel.cobj.tags = [];
						askModel.cobj.answers = [];
						askModel.cobj.views = 0;
						askModel.cobj.author = $rootScope.user.id;
						askModel.cobj.owner = $rootScope.user.id;
						askModel.cobj.text = '';
						askModel.current = '';
						askModel.questionSubmitted = true;
						askModel.busy = false;
						$location.url('/index');

					})
					.catch(function (err) {
						console.log(err); //jshint ignore:line
					});
			};

		}
	]);