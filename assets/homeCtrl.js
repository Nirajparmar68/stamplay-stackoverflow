/*
`$scope` stores the `sort` criteria currently used to list the questions. 
(I.E: `sort: {newest: true, votes: false, active:false}`. 
When the controller starts `loadQuestion` is triggered and 
it loads questions, their authors and also checks if a "checked" 
(correct) answer already exists. `updateSortingOptions` is called 
when we need to change the sort criteria.
*/
app.controller('homeCtrl', ['$scope', '$rootScope', '$http', 'tagService',
	function ($scope, $rootScope, $http, tagService) {

		/* Handles the questions filtering options */
		$scope.sort = {
			newest: true,
			votes: false,
			active: false
		};

		$scope.questions = [];

		var userCache = {};
		var page = 1;

		/* 
			Sets to true the sortType (newest, votes, active) and false all the others 
			Example: sort type = active
			Output 
				$scope.sort.newest = false, 
				$scope.sort.votes = false, 
				$scope.sort.active = false 
		*/
		var updateSortingOptions = function (sortType) {
			var keys = Object.keys($scope.sort);
			for (var i = 0, j = keys.length; i < j; i++) {
				var key = keys[i];
				if (key == sortType) {
					$scope.sort[key] = true
					switch (sortType) {
					case 'newest':
						$scope.questionParams.sort = '-dt_create';
						break;
					case 'votes':
						$scope.questionParams.sort = '-actions.votes.total';
						break;
					case 'active':
						$scope.questionParams.sort = '-dt_update';
						break;
					default:
						$scope.questionParams.sort = '-dt_create';
						break;
					}
				} else {
					$scope.sort[key] = false;
				}
			}
		}

		/* Loads the questions given a sort parameter */
		$scope.loadQuestions = function () {
			/* Gets all the questions */
			if ($scope.questionParams.per_page * $scope.questionParams.page > $scope.totalElements) {
				return;
			}
			$scope.busy = true;
			$http({
				method: 'GET',
				url: '/api/cobject/v0/question',
				params: $scope.questionParams
			}).success(function (res, status, headers, config) {
				$scope.totalElements = headers()['x-total-elements'];
				var i = 0;
				var toSkip = $scope.questions.length;
				$scope.questions = $scope.questions.concat(res.data);

				async.eachSeries($scope.questions,
					// async.each(res.data,

					function (question, eachSeriesCb) {
						if (i < toSkip) {
							console.log('SKIP');
							i++;
							eachSeriesCb();
						} else {
							console.log('ELSE');
							console.log(question);
							question.isSolved = false;
							async.auto({

									checkAnswer: function (autoCb) {

										console.log('1 check ans');
										/* For each question we have to check if the answer has been checked as solved */
										async.each(question.answers, function (answer, eachCb) {

											$http({
												method: 'GET',
												url: '/api/cobject/v0/answer/',
												params: {
													_id: answer,
													select: 'checked'
												}
											}).success(function (answerOnlyChecked) {
												if (answerOnlyChecked && answerOnlyChecked.data && answerOnlyChecked.data[0]) {
													question.isSolved = answerOnlyChecked.data[0].checked;
													eachCb();

												} else {
													eachCb();
												}
											})
										}, function (err) {
											autoCb();
										});
									},

									populateAuthor: function (autoCb) {
										console.log('2 pop auth');

										/* Populating question's tag */
										tagService.populateTag(question);

										/* Populating question's author */
										if (userCache[question.author]) {

											setTimeout(function () {
												$scope.$apply(function () {
													question.author = userCache[question.author];
													autoCb();
												});
											}, 0)

										} else if (userCache[question.author._id]) {

											setTimeout(function () {

												$scope.$apply(function () {
													question.author = userCache[question.author._id];
													autoCb();
												});
											}, 0)

										} else {
											$http({
												method: 'GET',
												url: '/api/user/v0/users/' + question.author,
												params: {
													select: 'displayName'
												}
											}).success(function (response) {
												userCache[question.author] = response;
												question.author = response;
												autoCb();
											}).error(function (err) {
												autoCb();
											});

										}
									}
								},
								function (err) {

									eachSeriesCb(null);

								});

						}

					},
					function (err) {
						console.log('ALL COMPLETE');
						i = 0;
						setTimeout(function () {
							$scope.$apply(function () {
								$scope.questionParams.page++;
								$scope.busy = false;
								if ($scope.questionParams.sort === '-actions.votes.total') {
									/* Sorting on votes: since up votes are saved in votes and down votes are saved in ratings we have the need to make a custom sorting*/

									$scope.questions = $scope.questions.sort(function (a, b) {
										var votesA = a.actions.votes.total - a.actions.ratings.total;
										var votesB = b.actions.votes.total - b.actions.ratings.total;
										return (votesA > votesB) ? -1 : 1;

									})
								}
							});
						}, 0)
					})
			});
		}

		/* Listener on tab */
		$scope.sortQuestion = function (sortOn) {
			$scope.questions = [];
			$scope.questionParams.page = 1;
			switch (sortOn) {
			case 'newest':
				updateSortingOptions('newest');
				break;
			case 'votes':
				updateSortingOptions('votes');
				break;
			case 'active':
				updateSortingOptions('active');
				break;
			default:
				updateSortingOptions('newest');
				break;
			}
			$scope.loadQuestions();
		};

		$scope.questionParams = {
			sort: '-dt_create',
			page: page,
			per_page: 10
		}

		/* First request */
		// $scope.loadQuestions($scope.questionParams);

			}])