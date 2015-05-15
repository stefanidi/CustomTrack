'use strict';

function WorkroomStatusDetailsController($scope, apiServices, signalRService) {

    signalRService.bbHub.on('onWorkroomStatusUpdate', function (workroomId) {
        if ($scope.workroom.Id == workroomId) {
            loadModel();
        }
    });

    $scope.today = (new XDate()).clearTime().toISOString();
    $scope.locked = false;
    $scope.addStatusCommentModel = {};
    $scope.model = {};

    addStatusCommentModelInit();
    loadModel();

    $scope.dateOptions = {
        startingDay: 1
    };
    $scope.timeDateVal = $scope.today;

    $scope.addStatusComment = function () {
        $scope.locked = true;

        $scope.addStatusCommentModel.WorkroomStatusId = $scope.workroomStatusId;

        apiServices.WorkroomService.AddStatusComment($scope.addStatusCommentModel).then(function (result) {
            addStatusCommentModelInit();
            $scope.locked = false;
            loadModel();
        });
    }

    function addStatusCommentModelInit() {
        $scope.addStatusCommentModel.Text = "";
        $scope.addStatusCommentModel.WorkroomStatusId = $scope.workroomStatusId;
    }

    function loadModel() {
        apiServices.WorkroomService.GetStatusDetails($scope.workroomStatusId).then(function (result) {
            $scope.model = result.data;
        });
    };
};