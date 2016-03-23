/*global angular, async*/
'use strict';

angular
	.module('stack.service')
	.factory('questionsService', ['$q', 'usersService', 'tagsService', 'answersService', '$stamplay',
		function ($q, usersService, tagsService, answersService, $stamplay) {

			var questions = [];
			var pagination = {};

			function _getTotalVotes(model) {
				return model.actions.votes.users_upvote.length - model.actions.votes.users_downvote.length
			}

			return {

				getQuestions: function (param) {
					var def = $q.defer();
					// Stop request after paging through all elements
					
						$stamplay.Object('question').get(param)
							.then(function (res) {
								pagination = res.pagination.total_elements;
								var list = res.data;
								for(var i = 0; i < list.length; i += 1) {
									list[i].author = list[i].owner;
									questions.push(list[i]);
								};

								def.resolve({ pagination : pagination, questions : questions });
							});
					


					return def.promise;
				},

				searchQuestion: function (questionId) {
					var def = $q.defer();
					
						$stamplay.Object("question").get({
							_id : questionId,
							populate : true,
							populate_owner : true
						}).then(function (res) {
								var question = res.data[0]
								question.author = question.owner;
								$stamplay.Object("answer").get({
									where : JSON.stringify({ _id : { $in : question.answers } }),
									populate_owner : true
								})
								.then(function(res) {
									question.answers = res.data;
									def.resolve(question);
								})
							})
							.catch(function (err) {
								def.reject(err);
							})

					return def.promise;

				},

				/*
				 * Retrieve question and populate answer models
				 */
				getById: function (questionId) {
					var def = $q.defer();

					this.searchQuestion(questionId)
						.then(function (question) {

							def.resolve(question);
						});

					return def.promise;
				},

				updateViews: function (question) {
					var actualViews = question.views || 0;
					actualViews++;
					return $stamplay.Object("question").patch(question._id, { views : actualViews })
				},

				updateModel: function (question, attrs) {
					var questionModel = {};

					attrs.forEach(function (key) {
						if (key !== 'answers' && key !== 'owner' && key !== 'tags' && key !== "author") {
							questionModel[key] = question[key];
						} else {
							var answerIDs = [];
							for(var i = 0; i < question[key].length; i += 1) {
								answerIDs.push(question[key][i]._id);
							};
							questionModel.answers = answerIDs;
						}
					});

					questionModel._id = question._id;

					return $stamplay.Object("question").patch(questionModel._id, questionModel);
				},

				voteUp: function (qModel) {
					var def = $q.defer();
					//cache populate data
					var question = qModel;

					$stamplay.Object("question").upVote(qModel._id)
						.then(function (res) {
							question.actions = res.actions
							def.resolve(_getTotalVotes(question));
						})
						.catch(function (err) {
							def.reject(err);
						})

					return def.promise;
				},

				voteDown: function (qModel) {
					var def = $q.defer();
					//cache populate data
					var question = qModel;

					$stamplay.Object("question").downVote(qModel._id)
						.then(function (res) {
							question.actions = res.actions;
							def.resolve(_getTotalVotes(question));
						})
						.catch(function (err) {
							def.reject(err);
						})

					return def.promise;
				},

				commentQuestion: function (qModel, commentText) {
					var def = $q.defer();
					//cache populate data
					var question = qModel;

					$stamplay.Object("question").comment(question._id, commentText)
						.then(function (res) {
							question.actions = res.actions;
							def.resolve(question);
						})
						.catch(function (err) {
							def.reject(err);
						})

					return def.promise;
				},

				saveQuestion: function (params) {
					var def = $q.defer();
					$stamplay.Object("question").save(params)
						.then(function (res) {
							var question = res.data;
							async.each(params.tags, function (tagId, callback) {
								/* GET for retrieving the tag count  */
								tagsService.getById(tagId)
									.then(function (tag) {
										var count = count || 0;
										tag.count = count++;
										$stamplay.Object("tag").patch(tag._id, tag)
											.then(function () {
												callback();
											}).catch(function (err) {
												callback(err);
											});
									});
							}, function (err) {
									if (err) {
										def.reject(err);
									} else {
										def.resolve(question);
									}
										
								});
						})

					return def.promise;
				},

				submitAnswer: function (question, nAnswer) {
					var newAnswers = question.answers;
					newAnswers.push(nAnswer);
					question.answers = newAnswers;
					return this.updateModel(question, ['answers']);
				}

			};
	}]);