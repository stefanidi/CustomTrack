'use strict';

function AdminTeamController($scope, $routeParams, $location, apiServices, $filter, rsTable, inputService, $modal) {

    $scope.isActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path.indexOf(r) == 0; });
        }
        return path.indexOf(route) == 0;
    }

    $scope.users = [];
    $scope.tableParams = rsTable($scope, function () { return $scope.users; });
    $scope.tableParams.count(200);

    $scope.setRate = function(person) {
        inputService.open("Set rate for " + person.Name, function(rate) {

            apiServices.AdminService.SetUserRate(person.Id, rate).then(function(result) {
                person.Rate = result.data.Rate;
            });

        });
    };

    $scope.block = function (person) {

        apiServices.AdminService.ToggleUserActive(person.Id).then(function (result) {
            person.IsActive = result.data.IsActive;
        });
    };

    $scope.manageRoles = function (person) {
        $modal.open({
            templateUrl: '/Partials/Admin/UserRolesModal.html',
            controller: AdminUserRolesModalController,
            resolve: {
                person: function () { return person; },
                globalAdministrator: function () { return false; }
            }
        });
    };

    //Get Users from the authentication database
    apiServices.AdminService.GetBriefBoxUsers().then(
        function (result) {
            $scope.users = result.data;
        });
};