app.controller('menuCtrl', ['$rootScope', '$scope', '$http', '$location',
	function ($rootScope, $scope, $http, $location) {
		$scope.$on('$routeChangeSuccess', function () {
			$scope.url = $location.url();
		});
		$scope.user = $rootScope.user;
	}])