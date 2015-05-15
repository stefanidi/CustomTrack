'use strict';

function InviteToMyTeamController($scope, $routeParams, $location, signalRService, apiServices, $modalInstance) {

    $scope.postModel = {};
    $scope.invitePosted = false;
    $scope.isLoading = false;

    $scope.$watch("emailAddress", function (oldVal, newVal) {
        if (oldVal != newVal) {
            $scope.invitePosted = false;
        }
    });

    $scope.invite = function () {
        $scope.isLoading = true;
        $scope.postModel = { Email: $scope.emailAddress, PersonalMessage: $scope.personalMessage };
        apiServices.UserMessageService.InviteUserToBriefBox($scope.postModel).then(function() {
            $scope.invitePosted = true;
            $scope.isLoading = false;
        });
    };

    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };


};