'use strict';

function WorkroomTimeController($scope, apiServices, $routeParams, $location) {

    $scope.today = (new XDate()).clearTime().toISOString();
    $scope.addToLogDate = $scope.today;

    $scope.locked = false;

    $scope.dateOptions = {
        startingDay: 1
    };
    $scope.timeDateVal = $scope.today;

    //Should only be able to add time if hours are greater than 0 and if there is description
    $scope.isTimeDisabled = function () {
        return !(!$scope.locked && $scope.timeModel && $scope.timeModel.AddWorkroomTimeModel
                && $scope.timeModel.AddWorkroomTimeModel.Time && $scope.timeModel.AddWorkroomTimeModel.Time > 0
                && $scope.timeModel.AddWorkroomTimeModel.Description && $scope.timeModel.AddWorkroomTimeModel.Description.length > 0);
    };

    $scope.loadWorkroom.then(function () {
        $scope.person = $scope.workroom.WorkroomTeam.first(function (person) { return person.PersonId === userData.Id });
        loadTimes();
    });

    $scope.AddWorkroomTime = function () {
        $scope.locked = true;
        var localDate = moment($scope.addToLogDate);
        $scope.timeModel.AddWorkroomTimeModel.Date = moment.utc([localDate.year(), localDate.month(), localDate.date()]);
        apiServices.WorkroomService.AddWorkroomTime($scope.timeModel.AddWorkroomTimeModel).then(function (result) {
            $scope.timeModel = result.data;
            $scope.locked = false;
        });
    };

    $scope.RemoveWorkroomTime = function (item) {
        $scope.locked = true;
        apiServices.WorkroomService.RemoveWorkroomTime(item.Id).then(function (result) {
            $scope.timeModel = result.data;
            $scope.locked = false;
        });
    };

    $scope.timeModel = null;

    function loadTimes() {

        apiServices.WorkroomService.GetWorkroomTimes($scope.id).then(function (result) {
            $scope.timeModel = result.data;

        });

    };
};