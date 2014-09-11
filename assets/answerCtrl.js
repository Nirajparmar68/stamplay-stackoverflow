/*
This controller is responsible to enable/disable UI controls
in the view that shows details and answers of a question. 
It checks if the user looking at it is the author (so that he 
can eventually check answers as correct) or if the user 
previously voted for it. 
The main functions defined here are: `setChecked`, `comment`, `voteUp` and `voteDown`
*/
app.controller('answerCtrl', ['$scope', 'question', 'tagService', '$http',
	function ($scope, question, tagService, $http) {

		if ($scope.user) {
			/* Only logged users can update instances */
			$http({
				method: 'PATCH',
				data: {
					views: ++question.views
				},
				url: '/api/cobject/v0/question/' + question._id
			});
		}

		$scope.question = question;
		$scope.question.showCommentArea = false;
		for (var i = 0, j = $scope.question.answers.length; i < j; i++) {
			$scope.question.answers[i].showCommentArea = false;
		}

		/* Redirects to login */
		$scope.toLogin = function () {
			document.location.href = '/auth/v0/github/connect';
		}

		/* Returns true if the logged user has voted down */
		$scope.checkVoteDown = function (users) {
			if (!$scope.user) {
				return false;
			}

			var found = users.filter(function (user) {
				return user.userId === $scope.user.id;
			});
			return found.length > 0;
		}

		/* Returns true if the logged user is the author of the question */
		$scope.canCheckAnswer = function () {
			if (!$scope.user) {
				return false;
			}

			var canCheck = true;
			if (question.author._id === $scope.user.id) {
				for (var i = 0, j = question.answers.length; i < j && canCheck; i++) {
					var answer = question.answers[i];
					if (answer.checked) {
						canCheck = false;
					}
				}
			} else {
				canCheck = false;
			}
			return canCheck;
		}

		/* Shows/Hide the comment area */
		$scope.toggleCommentArea = function (model, $index) {
			if (!$scope.user) {
				return;
			}

			if (model.cobjectId === 'answer') {
				var oldValue = $scope.question.answers[$index].showCommentArea || false;
				$scope.question.answers[$index].showCommentArea = !oldValue;
				for (var i = 0, j = $scope.question.answers.length; i < j; i++) {
					if (i !== $index) {
						$scope.question.answers[i].showCommentArea = false;
					}
				}
			} else {
				var oldValue = $scope.question.showCommentArea || false;
				$scope.question.showCommentArea = !$scope.question.showCommentArea;
			}
		}

		/* Set to true the checked attribute of the answer */
		$scope.setChecked = function (answer, $index) {
			var data = {
				checked: true
			};

			$http({
				method: 'PATCH',
				url: '/api/cobject/v0/answer/' + answer._id,
				data: data
			}).success(
				function (response) {
					$scope.question.answers[$index].checked = true;
				});
		}

		/* Comment an answer or a question */
		$scope.comment = function (model, $index) {
			if (!$scope.user) {
				return;
			}

			var cobjectId = model.cobjectId;
			var data = {
				text: $scope.question.answers[$index].commentText
			};

			$http({
				method: 'PUT',
				url: '/api/cobject/v0/' + cobjectId + '/' + model._id + '/comment',
				data: data
			}).success(
				function (response) {
					$scope.question.answers[$index].commentText = '';
					// $scope["commentText" + $index] = '';
					if (model.cobjectId === 'answer') {
						$scope.question.answers[$index].actions.comments = response.actions.comments;
					} else {
						$scope.question.actions.comments = response.actions.comments;
					}
				});
		}

		/* Vote up the coinstance */
		$scope.voteUp = function (model, $index) {
			if (!$scope.user) {
				return;
			}

			var url = '/api/cobject/v0/' + model.cobjectId + '/' + model._id + '/vote';
			if (model.actions.votes.users.indexOf($scope.user.id) == -1 && !$scope.checkVoteDown(model.actions.ratings.users)) {
				$http({
					method: 'PUT',
					url: url
				}).success(function (response) {
					if (model.cobjectId === 'question') {
						$scope.question.actions.votes = response.actions.votes;
					} else {
						$scope.question.answers[$index].actions.votes = response.actions.votes;
					}
				});
			}
		}

		/* Vote down the coinstance */
		$scope.voteDown = function (model, $index) {
			if (!$scope.user) {
				return;
			}

			var url = '/api/cobject/v0/' + model.cobjectId + '/' + model._id + '/rate';
			if (model.actions.votes.users.indexOf($scope.user.id) == -1 && !$scope.checkVoteDown(model.actions.ratings.users)) {
				var obj = {
					rate: 1
				};
				$http({
					method: 'PUT',
					url: url,
					data: obj,
				}).success(function (response) {
					if (model.cobjectId === 'question') {
						$scope.question.actions.ratings = response.actions.ratings;
					} else {
						$scope.question.answers[$index].actions.ratings = response.actions.ratings;
					}
				});
			} else {

			}
		}

		/* Populate the answer author */
		var userCache = {};
		async.eachSeries($scope.question.answers,
			function (answer, callback) {
				if (userCache[answer.author]) {
					answer.author = userCache[answer.author];
					callback();
				} else {
					$http({
						method: 'GET',
						url: '/api/user/v0/users/' + answer.author
					}).success(function (response) {
						userCache[answer.author] = response;
						answer.author = response;
						callback();
					});

				}
			});

		tagService.populateTag(question);

	}])