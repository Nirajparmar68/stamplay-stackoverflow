angular
	.module('stack')
	.controller('tagsCtrl', ['tagsService',
		function (tagsService) {
			var tagsModel = this;
			/* Handles the tag filtering options */
			tagsModel.sort = {
				popular: true,
				name: false,
				'-dt_create': false
			};
			tagsModel.order = '-count';

			/* The user search */
			tagsModel.searchTag = '';
			/* All tags, pagination in real world app */
			tagsService.getTags().then(function (response) {
				/* tagsModel.tags are the visible tags*/
				tagsModel.tags = response;
				/* All tags, pagination in real world app */
				tagsModel.allTags = response;
			})

			/* Handles search */
			tagsModel.search = function () {
				var reg = '".*' + tagsModel.searchTag + '.*"';
				var query = {
					'where': '{"name": {"$regex" : ' + reg + '}}'
				};

				tagsService.searchTag(query).then(function (response) {
					tagsModel.tags = response;
				});
			};
		}
	])