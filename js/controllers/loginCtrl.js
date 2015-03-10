angular
	.module('stack')
	.controller('loginCtrl', ['$rootScope', '$scope', '$http',
		function ($rootScope, $scope, $http) {
			window.location.href = '/auth/v0/github/connect';
		}
	])