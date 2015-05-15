'use strict';

function GroupOverviewController($scope, signalRService, apiServices, $position) {

    $scope.LastMessages = [];
    $scope.LastAttachments = [];
    $scope.LastEvents = [];
    $scope.LastActivities = [];
    $scope.TotalGroupTime = 0;
    $scope.TotalGroupProviderTime = 0;

    loadOverview();

    function loadOverview() {
        
    }
};