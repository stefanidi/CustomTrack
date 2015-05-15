'use strict';

function AddToMyTeamController($scope, $routeParams, $location, signalRService, apiServices, $modalInstance, team) {

    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.excludeAddedFilter = function (person) {

        // exclude current user
        if (person.Id == userData.Id) {
            return false;
        }

        var result = $.grep(team, function (e) { return e.Id == person.Id; });
        if (result.length == 0) {
            return true;
        } else {
            return false;
        }
    };

    $scope.addTeamMember = function (person) {
        person.IsAdding = true;
        apiServices.PersonService.AddPersonToTeam(person.Id).then(
          function () {
              person.IsAdding = false;
              person.IsAdded = true;
          }
        );
    };

    apiServices.PersonService.GetMyTeam().then(
        function (result) {
            $scope.myCompanyTeam = result.data;
        }
    );
};