'use strict';

function GroupCloseController($scope, $route, $modal, apiServices, signalRService) {

    // status for form
    $scope.completionStatus = { client: null, provider: null };
    $scope.groupCompletionStatuses = ['Open', 'Complete'];
    $scope.currentGroupPerson = {};
    $scope.isLoading = false;
};

