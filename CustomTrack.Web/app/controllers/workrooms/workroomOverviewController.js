'use strict';

function WorkroomOverviewController($scope, signalRService, apiServices, $position) {

    $scope.LastMessages = [];
    $scope.LastAttachments = [];
    $scope.LastEvents = [];
    $scope.LastActivities = [];
    $scope.TotalWorkroomTime = 0;
    $scope.TotalWorkroomProviderTime = 0;

    loadOverview();

    function loadOverview() {
        apiServices.WorkroomService.GetWorkroomOverview($scope.id).then(function (result) {
            $scope.LastMessages = result.data.LastMessages;
            $scope.LastAttachments = result.data.LastAttachments;
            $scope.LastActivities = result.data.LastActivities;
            $scope.LastEvents = result.data.LastEvents;
            $scope.TotalWorkroomTime = result.data.TotalWorkroomTime;
            $scope.TotalWorkroomProviderTime = result.data.TotalWorkroomProviderTime;
            $scope.FeedbackScore = result.data.FeedbackScore;
        });
    }
};