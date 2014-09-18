/*
When this controller starts it initializes two variables 
in the `$scope`: `cobj` and `questionSubmitted`. 
The former represent the new instance for the question 
while the latter is a boolean value to check that the 
question has been submitted succesfully.
It also implement the function `getTags` for autocompleting 
the tag that users can bind to the question.
*/

app.controller('createQuestionCtrl', ['$rootScope', '$scope', '$http', '$location',
	function ($rootScope, $scope, $http, $location) {

		$scope.cobj = {};
		$scope.cobj.tags = [];
		$scope.cobj.answers = [];
		$scope.cobj.views = 0;
		$scope.cobj.author = $rootScope.user.id;
		$scope.questionSubmitted = false;

		var tags = [];
		var tagName2Id = {};
		var z = {};

		/* Used from typeahead to retrieve tags that matches the user search */
		$scope.getTags = function (val) {
			var reg = '".*' + val + '.*"'
			return $http.get('/api/cobject/v0/tags', {
				params: {
					'where': '{"name": {"$regex" : ' + reg + '}}'
				}
			}).then(function (res) {

				angular.forEach(res.data.data, function (item) {
					tagName2Id[item.name] = item.id;
					var alreadyExists = false;
					for (var i = 0, j = tags.length; i < j && !alreadyExists; i++) {
						var element = tags[i];
						if (element.id === item.id) {
							alreadyExists = true;
						}
					}
					if (!alreadyExists) {
						tags.push({
							name: item.name,
							id: item._id
						});
					}
				});
				return tags;
			});
		};

		/* We have to watch current for inserting the tag id in the cobj using the tag map */
		$scope.$watch('current', function () {
			var x = tagName2Id[$scope.current];
			if (x) {
				$scope.cobj.tags = [x];
			} else {
				$scope.cobj.tags = [];
			}
		});

		$scope.onSelect = function ($item, $model, $label) {
			$scope.cobj.tags = $item.id;
		};

		/* Creates a new question */
		$scope.createQuestion = function () {
			/* POST for creating the cobject question instance  */
			$http({
				method: 'POST',
				url: '/api/cobject/v0/question',
				data: $scope.cobj
			}).success(function (response) {
				if ($scope.cobj.tags.length === 24 ) {
					$scope.cobj.tags = [$scope.cobj.tags];
				}
				//Get the tag 
				async.each($scope.cobj.tags, function (tagId, callback) {
					/* GET for retrieving the tag count  */
					$http({
						method: 'GET',
						url: '/api/cobject/v0/tags/' + tagId
					}).success(function (tag) {
						var count = tag.count || 0;
						//Updating the tag count
						$http({
							method: 'PATCH',
							url: '/api/cobject/v0/tags/' + tagId,
							data: {
								count: ++count
							}
						}).success(function () {
							callback();
						});
					});

				}, function (err) {
					$scope.cobj = {};
					$scope.cobj.tags = [];
					$scope.cobj.answers = [];
					$scope.cobj.views = 0;
					$scope.cobj.author = $rootScope.user.id;
					$scope.cobj.text = '';
					$scope.current = '';
					$scope.questionSubmitted = true;
					$location.url('/index');
				});

			}).error(function (err) {
				alert('ko');
			});
		}

	}])