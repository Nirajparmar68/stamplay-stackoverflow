var app = angular.module('stamplay-stack', ['infinite-scroll','ngRoute', 'ui.bootstrap', 'textAngular'])
	.service('tagService', function ($q, $http) {
		// var tags = null;
		// var promise = $http.get('/api/cobject/v0/tags').then(function (response) {
		// 	tags = response.data;
		// });

		// return {
		// 	promise: promise,
		// 	getTags: function () {
		// 		return tags;
		// 	}
		// };
		var resolveId = function (id) {
			var result = tags.filter(function (tag) {
				return tag.id == id
			});
			if (result[0] && result[0].name) {
				return result[0].name;
			} else {
				return null;
			}
		}

		var tags = null;

		var getPromise = function () {
			var def = $q.defer();
			if (tags) {
				def.resolve();
			} else {
				$http.get('/api/cobject/v0/tags').success(function (response) {
					tags = response.data;
					def.resolve();
				}).error(function () {});
			}
			return def.promise;
		}

		var populateTag = function (question) {
			question.tags.forEach(function (tag, i) {
				question.tags[i] = {
					id: tag,
					name: resolveId(tag)
				};
			});
		}

		return {
			getPromise: getPromise,
			getTags: function () {
				return tags;
			},
			populateTag: populateTag,
			resolveId: resolveId
		};
	})
