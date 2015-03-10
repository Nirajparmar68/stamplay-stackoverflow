angular
	.module('stack')
	.controller('logoutCtrl', ['$rootScope', '$scope', '$http',
		function ($rootScope, $scope, $http) {
			window.location.href = '/auth/v0/logout';
		}
	])