/*global angular*/
'use strict';

angular
	.module('stack.service')
	.factory('answersService', ['$q', 'usersService', '$stamplay', function ($q, usersService, $stamplay) {

		function _getTotalVotes(model) {
			return model.actions.votes.users_upvote.length - model.actions.votes.users_downvote.length
		}

		return {

			createAnswer: function (params) {
				var def = $q.defer();
				var answerModel = {}

				angular.forEach(params, function (value, key) {
					answerModel[key] = value;
				});

				$stamplay.Object("answer").save(answerModel)
					.then(function (res) {
						def.resolve(res);
					})
					.catch(function (err) {
						def.reject(err);
					});

				return def.promise;
			},

			updateModel: function (answer, attrs) {
				var checkedAnswer = {};
				attrs.forEach(function (key) {
					checkedAnswer[key] = answer[key];
				});
				

				return $stamplay.Object("answer").patch(answer._id, checkedAnswer);

			},

			voteUp: function (aModel) {
				var def = $q.defer();
				//cache populate data
				var answer = aModel;

				$stamplay.Object("answer").upVote(answer._id)
					.then(function (res) {
						answer.actions = res.actions;
						def.resolve(_getTotalVotes(answer));
					})
					.catch(function (err) {
						def.reject(err);
					})

				return def.promise;
			},

			voteDown: function (aModel) {
				var def = $q.defer();
				//cache populate data
				var answer = aModel;

				$stamplay.Object("answer").downVote(answer._id)
					.then(function (res) {
						answer.actions = res.actions;
						def.resolve(_getTotalVotes(answer));
					})
					.catch(function (err) {
						def.reject(err);
					})

				return def.promise;
			},

			comment: function (aModel, commentText) {
				var def = $q.defer();
				//cache populate data
				var answer = aModel;

				$stamplay.Object("answer").comment(answer._id, commentText)
					.then(function (res) {
						answer.actions = res.actions;
						def.resolve();
					})
					.catch(function (err) {
						def.reject(err);
					})

				return def.promise;
			},

			getById: function (answerId) {
				var def = $q.defer();
				var answerModel = $stamplay.Cobject('answer').Model;

				answerModel.fetch(answerId)
					.then(function () {
						return usersService.getById(answerModel.get('author'));
					})
					.then(function (authorModel) {
						answerModel.set('author', authorModel);
						def.resolve(answerModel);
					})
					.catch(function (err) {
						def.reject(err);
					});

				return def.promise;
			}
		};
	}]);