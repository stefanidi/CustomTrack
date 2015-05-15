'use strict';

function WorkroomStatusController($scope, apiServices, signalRService) {
    $scope.today = (new XDate()).clearTime().toISOString();
    $scope.locked = false;
    $scope.workroomStatuses = null;
    $scope.addStatusModel = {};

    signalRService.bbHub.on('onWorkroomStatusUpdate', function (workroomId) {
        if ($scope.workroom.Id == workroomId) {
            loadStatuses();
        }
    });

    // when StatusDetails - isStatusView = true
    // when Status List - isStatusView = false
    $scope.isStatusDetails = false;
    $scope.workroomStatusId = 0;

    addStatusModelInit();
    loadStatuses();

    $scope.dateOptions = {
        startingDay: 1
    };
    $scope.timeDateVal = $scope.today;

    $scope.AddStatus = function () {
        $scope.locked = true;
        $scope.addStatusModel.WorkroomId = $scope.workroom.Id;
        apiServices.WorkroomService.AddStatus($scope.addStatusModel).then(function (result) {
            $scope.addStatusModel.StatusText = "";
            $scope.locked = false;
            loadStatuses();
        });
    };

    $scope.showStatusDetails = function (id) {
        $scope.workroomStatusId = id;
        $scope.isStatusDetails = true;

        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };

    $scope.showStatusList = function () {
        $scope.isStatusDetails = false;

        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };

    function loadStatuses() {

        apiServices.WorkroomService.GetWorkroomStatuses($scope.id).then(function (result) {
            $scope.workroomStatuses = result.data;
            var workroomUser = $scope.getCurrentWorkroomPerson();
            $scope.canAddStatus = workroomUser.PartyType == 'Provider' && $scope.IsOpen();
        });

    };

    function addStatusModelInit() {

        $scope.addStatusModel.StatusText = "";
        $scope.addStatusModel.WorkroomStatusType = "OK";
        $scope.addStatusModel.Date = $scope.today;
    }
};