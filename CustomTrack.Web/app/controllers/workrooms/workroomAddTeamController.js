'use strict';

function WorkroomAddTeamController($scope, signalRService, apiServices) {

    $scope.myTeamOnly = true;
    $scope.$watch('myTeamOnly', function (newValue, oldValue) {
        loadTeam();
    });

    $scope.team = []; //This is the select team 
    $scope.disableSaveTeam = true;
    $scope.workroomSelectedTeam = [];
    $scope.noTeamMembers = false;

    //Load when workroom is loaded
    $scope.loadWorkroom.then(loadTeam);

    $scope.save = function () {
        $scope.disableSaveTeam = true;

        $scope.workroom.WorkroomTeam = $scope.workroom.WorkroomTeam.concat($scope.workroomSelectedTeam);

        $scope.saveWorkroom(function (w) {
            $scope.go('Team');
        });
    };

    $scope.addPerson = function (person) {
        person.selected = true;
        $scope.team.sort(teamSelectSort);
        $scope.workroomSelectedTeam.push(person);
    };

    $scope.removePerson = function (person) {
        person.selected = false;
        $scope.team.sort(teamSelectSort);
        $scope.workroomSelectedTeam.remove(person);
    };

    $scope.getSelectedClass = function (person) {
        return person.selected
    };

    function loadTeam() {
        //apiServices.PersonService.GetMyTeamAsRefs().then(
        //    );
        function onSuccess(result) {
            var t = result.data.TeamMembers;
            //remove already selected team
            $scope.workroom.WorkroomTeam.forEach(function (item) {
                t.remove(t.first(function (p) { return p.PersonId === item.PersonId; }));
            });
            $scope.team = t;
            $scope.team.sort(teamSelectSort);

            if (t.length == 0) {
                $scope.noTeamMembers = true;
            }
            else {
                $scope.disableSaveTeam = false;
            }
        }

        if ($scope.myTeamOnly) {
            apiServices.PersonService.GetPersonChooseTeam().then(onSuccess);
        } else {
            apiServices.PersonService.GetCompanyChooseTeam().then(onSuccess);
        }
    }

    function teamSelectSort(x, y) {
        if (y.selected === undefined) y.selected = false;
        if (x.selected === undefined) x.selected = false;

        if (x.selected === y.selected) {
            //sort alphabetically if both are selected or not
            return (x.Name < y.Name) ? -1 : (x.Name > y.Name) ? 1 : 0;
        }
        return x.selected ? -1 : 1;
    }
};