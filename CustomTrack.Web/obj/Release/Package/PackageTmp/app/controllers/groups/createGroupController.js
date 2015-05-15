'use strict';

function CreateGroupController($scope, $routeParams, $location, signalRService, apiServices, stateService, popupService, $filter, $modal, categorySkills, providerAutoCompleteService) {
    $scope.cancel = function () {
        $location.url('/Groups');
        if (!$scope.$$phase) $scope.$apply();
    };
};