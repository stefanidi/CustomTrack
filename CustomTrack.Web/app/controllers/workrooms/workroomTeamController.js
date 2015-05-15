'use strict';

function WorkroomTeamController($scope, signalRService, popupService, rsTable) {

    $scope.tableParams = rsTable($scope, function () { return $scope.workroom.WorkroomTeam; }, null, null, true);

    $scope.canRemovePerson = function (person) {
        return $scope.workroom.IsLead &&
            ($scope.workroom.Client == null || person.PersonId != $scope.workroom.Client.PersonId) &&
            ($scope.workroom.Provider == null || person.PersonId != $scope.workroom.Provider.PersonId) &&
            person.PartyType == $scope.workroom.UserPartyType;
    };

    $scope.makeLead = function (person) {
        if (person.WorkroomRole == 'Lead') return;
        person.WorkroomRole = "Lead";
        $scope.saveWorkroom();
    }

    $scope.canMakeLead = function (person) {
        return $scope.workroom.IsLead && person.WorkroomRole != 'Lead' && person.PartyType == $scope.workroom.UserPartyType;
    }

    $scope.removeLead = function (person) {
        if (person.WorkroomRole == 'User') return;
        person.WorkroomRole = "User";
        $scope.saveWorkroom();
    }

    $scope.canRemoveLead = function (person) {
        return $scope.workroom.IsLead && person.WorkroomRole != 'User' && $scope.canRemovePerson(person);
    }

    $scope.privateMessage = function (person) {
        popupService.quickMessage(person.PersonId, person.Name, $scope.workroom.Name);
    }


    $scope.removePersonFromTeam = function (person) {
        if (person.WorkroomRole == 'Lead') return;
        $scope.workroom.WorkroomTeam.remove(person);
        $scope.saveWorkroom();
    };

}