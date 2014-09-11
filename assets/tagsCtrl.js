app.controller('tagsCtrl', ['$scope', 'tagService', '$http',
	function ($scope, tagService, $http) {

		/* Handles the tag filtering options */
		$scope.sort = {
			popular: true,
			name: false,
			'-dt_create': false
		};
		$scope.order = '-count';

		/* The user search */
		$scope.searchTag = '';
		/* All tags, pagination in real world app */
		$scope.allTags = tagService.getTags();
		/* $scope.tags are the visible tags*/
		$scope.tags = $scope.allTags;

		/* Handles search */
		$scope.search = function () {
			var reg = '".*' + $scope.searchTag + '.*"';
			$http.get('/api/cobject/v0/tags', {
				params: {
					'where': '{"name": {"$regex" : ' + reg + '}}'
				}
			}).success(function (response) {
				$scope.tags = response.data;
			});
		}
	}])