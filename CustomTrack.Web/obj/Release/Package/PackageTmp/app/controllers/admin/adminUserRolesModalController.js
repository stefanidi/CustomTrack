'use strict';

function AdminUserRolesModalController($scope, $modalInstance, person, apiServices, globalAdministrator) {

    $scope.userId = null;
    $scope.roles = {
        Client: false,
        Provider: false,
        BriefBoxAdmin: false,
        CompanyAdmin: false,
        CanPitch: false,
        CanEditPanels: false
    };

    $scope.globalAdministrator = globalAdministrator;

    $scope.isSaving = false;

    $scope.save = function () {

        $scope.isSaving = true;

        var roles = $linq(Object.keys($scope.roles)).where(function (k) { return $scope.roles[k]; }).toArray();

        var saveUserRoles = globalAdministrator ? apiServices.AdminService.SaveUserRoles : apiServices.CompanyService.SaveUserRoles;

        saveUserRoles($scope.userId, roles).then(function (result) {
            $scope.isSaving = false;
            person.roles = $scope.roles;
            $modalInstance.close();
        });
        
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    }

    $scope.$watch("roles.CompanyAdmin", function (newValue) {
        if (newValue) {
            $scope.roles.CanEditPanels = true;
        }
    });

    $scope.$watch("roles.Client", function (newValue) {
        if (newValue) {
            $scope.roles.CanPitch = false;
        }
    });

    apiServices.AdminService.GetUserRoles(person.Id).then(function (result) {
        $scope.userId = result.data.UserId;

        $linq(result.data.Roles).foreach(function (x) {
            $scope.roles[x] = true;
        });
    });
}