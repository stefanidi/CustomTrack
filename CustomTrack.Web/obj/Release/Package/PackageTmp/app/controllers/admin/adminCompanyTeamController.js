'use strict';

function AdminCompanyTeamController($scope, $routeParams, $location, apiServices, $filter, rsTable, inputService, $modal) {

    $scope.users = [];
    $scope.tableParams = rsTable($scope, function () { return $scope.users; });
    $scope.tableParams.count(200);

    $scope.setRate = function(person) {
        inputService.open("Set rate for " + person.Name, function(rate) {
            apiServices.CompanyService.SetUserRate(person.Id, rate).then(function(result) {
                person.Rate = result.data.Rate;
            });
        });
    };

    $scope.block = function (person) {
        apiServices.CompanyService.ToggleUserActive(person.Id).then(function (result) {
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
    apiServices.CompanyService.GetCompanyUsers().then(
        function (result) {
            $scope.users = result.data;

            for (var i = 0; i < $scope.users.length; i++) {
                $scope.users[i].roles = {
                    Client: false,
                    Provider: false,
                    BriefBoxAdmin: false,
                    CompanyAdmin: false,
                    CanPitch: false,
                    CanEditPanels: false
                };

                $linq($scope.users[i].Roles).foreach(function (x) {
                    $scope.users[i].roles[x] = true;
                });
            }
        });
};