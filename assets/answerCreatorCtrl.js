app.controller('answerCreatorCtrl', ['$scope', '$http',
		function ($scope, $http) {

		if ($scope.user) {
			$scope.newAnswer = {
				checked: false,
				author: $scope.user.id,
				text: ''
			};
		}

		$scope.successInCreation = false;
		$scope.errorInCreation = false;

		$scope.createAnswer = function () {
			$http({
				method: 'POST',
				url: '/api/cobject/v0/answer',
				data: $scope.newAnswer
			}).success(function (response) {
				response.author = $scope.user;
				response.dt_create = moment(response.dt_create).format('ll');
				$scope.question.answers.push(response);
				var answersIds = [];
				$scope.question.answers.forEach(function (answer) {
					return answersIds.push(answer._id);
				});

				$http({
					method: 'PATCH',
					url: '/api/cobject/v0/question/' + $scope.question._id,
					data: {
						answers: answersIds
					}
				}).success(function (response) {
					$scope.successInCreation = true;
					setTimeout(function () {
						$scope.$apply(function () {
							$scope.successInCreation = false;
							$scope.newAnswer.text = '';

						})
					}, 2000);

				}).error(function (err) {
					$scope.errorInCreation = true;
					setTimeout(function () {
						$scope.successInCreation = false;
					}, 2000);
					alert('KO');
				});

			}).error(function (err) {
				$scope.errorInCreation = true;
				alert('KO')
			});
		}

		}])