/*global angular*/
'use strict';

angular
.module('stack.service')
.factory('userService', ['$q', '$http', '$stamplay', "$rootScope", function ($q, $http, $stamplay, $rootScope) {

	var logged = false;

	$rootScope.login = function() {
		$stamplay.User.socialLogin('github');
	}

	$rootScope.logout = function() {
		$stamplay.User.logout();
	}

	return {
		isLogged: function () {
			return logged;
		},



		getUserModel: function () {
			var def = $q.defer();

			$stamplay.User.currentUser()
			.then(function(res) {

				if (res.user.hasOwnProperty('_id')) {		
					res.user.points = res.user.points || 0;
					logged = true;
					def.resolve(res.user);
				} else {
					logged = false;
					def.resolve(false)
				}

			})
			.catch(function (err) {
				def.reject(err);
			});


			return def.promise;
		}
	};
}])

.factory('usersService', ['$q', '$stamplay', function ($q, $stamplay) {

	return {

		getUsers: function () {
			var def = $q.defer();

			$stamplay.User.get({})
			.then(function (res) {
				def.resolve(res.data);
			})
			.catch(function (err) {
				def.reject(err);
			});

			return def.promise;
		},

		getById: function (userId) {
			var def = $q.defer();

			$stamplay.User.get({ _id : userId })
			.then(function (res) {
				def.resolve(res.data[0]);
			})
			.catch(function (err) {
				def.reject(err);
			});
			

			return def.promise;
		},

		searchUser: function (params) {

			var def = $q.defer();

			$stamplay.User.get(params)
			.then(function (res) {
				def.resolve(res.data);
			})
			.catch(function (err) {
				def.reject(err);
			});

			return def.promise;
		}

	};
}])