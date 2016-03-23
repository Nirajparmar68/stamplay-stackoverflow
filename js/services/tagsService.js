/*global angular*/
'use strict';

angular
	.module('stack.service')
	.factory('tagsService', ['$q', '$stamplay', function ($q, $stamplay) {

		return {

			getTags: function (options) {
				var def = $q.defer();
				options = options || {};
				
				$stamplay.Object('tag').get(options)
					.then(function (res) {
						def.resolve(res.data);
					})
					.catch(function (err) {
						def.reject(err);
					});

				return def.promise;
			},

			getById: function (tagId) {
				var def = $q.defer();

				$stamplay.Object('tag').get({ _id : tagId })
					.then(function (res) {
						def.resolve(res.data[0]);
					})
					.catch(function (err) {
						def.reject(err);
					});
				

				return def.promise;
			},

			searchTag: function (params) {

				var def = $q.defer();

				$stamplay.Object("tag").get(params)
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