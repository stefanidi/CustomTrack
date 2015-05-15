'use strict';

function MyTeamController($scope, $routeParams, $location, signalRService, apiServices, $modal) {

    $scope.Team = [];

    getPersonTeam();

    $scope.addPersonToTeam = function () {
        var modalInstance = $modal.open({
            templateUrl: '/Partials/Profile/AddToMyTeamModal.html',
            controller: AddToMyTeamController,
            resolve: {
                team: function () {
                    return $scope.Team;
                } 
            }
        });
        modalInstance.result.then(function () { }, function () {
            getPersonTeam();
        });
    };

    $scope.invitePersonToTeam = function () {
        var modalInstance = $modal.open({
            templateUrl: '/Partials/Profile/InviteToMyTeamModal.html',
            controller: InviteToMyTeamController
        });
        modalInstance.result.then(function() {
            // todo: on invite
        }, function () {
            // todo: on cancel
        });
    };

    

    $scope.removeUser = function (person) {
        apiServices.PersonService.RemovePersonFromTeam(person.Id).then(
        function () {
            getPersonTeam();
        });
    };

    function getPersonTeam() {
        var personId = userData.Id;
        if ($routeParams.id !== undefined) {
            personId = 'user/' + $routeParams.id;
        }
        apiServices.PersonService.GetPersonTeam(personId).then(
            function (result) {
                if (result.data) {
                    $scope.Team = result.data.TeamMembers;
                    $scope.IsOwner = result.data.IsOwner;
                }
            });
    };
};