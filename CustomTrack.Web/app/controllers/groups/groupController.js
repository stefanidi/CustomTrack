'use strict';

function GroupController($scope, $routeParams, $location, signalRService, apiServices, $q) {

    $scope.go = function (action) {
        $scope.activeGroupTemplate = action;
        $location.search('s', action); 
        if (!$scope.$$phase) $scope.$apply();
    };
    $scope.isLoadingGroup = false;

    $scope.go(($location.search() && $location.search().s) || 'Overview');

    $scope.isActive = function (route) {
        return $scope.activeGroupTemplate.contains(route);
    }

    //DUMMY DATA
    $scope.group = {
        Name: "Technology Lawyers"
    };
};