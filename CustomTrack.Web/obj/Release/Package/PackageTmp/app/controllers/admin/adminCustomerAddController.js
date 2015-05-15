'use strict';

function AdminCustomerAddController($scope, $routeParams, $location, apiServices, countries, avatarUpload, validationPopupService) {
    $scope.company = {};
    $scope.domains = [];
    $scope.selectedLocation = {
        Country: null,
        State: null,
        City: null
    };

    $scope.Countries = countries;

    $scope.addDomain = function () {
        $scope.domains.push({ domain: "" });
    };

    $scope.deleteDomain = function (domain) {
        $scope.domains.remove(domain);
    }

    $scope.isSaving = false;
    $scope.save = function () {

        $scope.isSaving = true;

        $scope.company.Country = $scope.selectedLocation.Country ? $scope.selectedLocation.Country.Name : null;
        $scope.company.State = $scope.selectedLocation.State ? $scope.selectedLocation.State.Name : null;
        $scope.company.City = $scope.selectedLocation.City;

        $scope.company.AllowedDomains = $linq($scope.domains).where(function (d) { return d.domain; }).select(function (d) { return d.domain; }).orderBy("d=>d").toArray();

        apiServices.AdminService.SaveCompany($scope.company, function(result) {
            $scope.isSaving = false;

            validationPopupService.show("One or more errors occured while adding new company.", result);
        }).then(function (result) {

            $scope.isSaving = false;

            $location.url('/Admin/Customers');
        });
    };

    $scope.cancel = function() {
        $location.url('/Admin/Customers');
    };
}