'use strict';

function AdminUsersController($scope, $routeParams, $location, signalRService, apiServices, $filter, $modal, rsTable) {

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

    $scope.block = function (person) {

        apiServices.AdminService.ToggleUserActive(person.Id).then(function (result) {
            person.IsActive = result.data.IsActive;
        });
    };

    $scope.manageRoles = function(person) {
        $modal.open({
            templateUrl: '/Partials/Admin/UserRolesModal.html',
            controller: AdminUserRolesModalController,
            resolve: {
                person: function () { return person; },
                globalAdministrator: function () { return true; }
            }
        });
    };

    //Get Users from the authentication database
    apiServices.AdminService.GetUsers().then(
        function (result) {
            $scope.users = result.data;
        });
};