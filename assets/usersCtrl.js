app.controller('usersCtrl', ['$scope', 'users', '$http',
	function ($scope, users, $http) {

		$scope.sortOnNewUsers = true;
		$scope.searchUser = '';
		$scope.users = users;

		$scope.search = function () {
			var reg = '".*' + $scope.searchUser + '.*"';
			$http.get('/api/user/v0/users', {
				params: {
					'where': '{"displayName": {"$regex" : ' + reg + ', "$options": "i"}}'
				}
			}).success(function (response) {
				$scope.users = response.data;
			});
		}

	}])