/*
This controller is responsible to enable/disable UI controls
in the view that shows details and answers of a question. 
It checks if the user looking at it is the author (so that he 
can eventually check answers as correct) or if the user 
previously voted for it. 
The main functions defined here are: `setChecked`, `comment`, `voteUp` and `voteDown`
*/
app.controller('pointsCtrl', ['$scope', '$rootScope','$http',
	function ($scope, $rootScope, $http) {
		$scope.user = $rootScope.user;
		if($scope.user && $scope.user.id){
			$http({
				method: 'GET',
				url: '/api/gm/v0/challenges/stackchallenge/userchallenges/' + $scope.user.id
			}).success(function(response) {
				if(response.points){
					$scope.points = response.points;
				}
			})
		}
	}])