'use strict';

function AdminCustomersController($scope, $routeParams, $location, signalRService, apiServices, $filter, rsTable) {
    
    $scope.isActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path.indexOf(r) == 0; });
        }
        return path.indexOf(route) == 0;
    }

    $scope.companies = [];
    $scope.tableParams = rsTable($scope, function () { return $scope.companies; });
    $scope.tableParams.count(200);

    //Get Users from the authentication database
    apiServices.AdminService.GetCompanies().then(
        function (result) {
            $scope.companies = result.data;
        });
};