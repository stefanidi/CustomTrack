'use strict';

function AdminCustomerDetailsController($scope, $routeParams, $location, apiServices, countries, avatarUpload, validationPopupService) {
    $scope.isLoading = true;

    $scope.company = {};
    $scope.domains = [];
    $scope.selectedLocation = {
        Country: null,
        State: null,
        City: null
    };

    loadCompany();
    function loadCompany() {
        $scope.isLoading = true;
        apiServices.AdminService.GetCompany($routeParams.id).then(function (result) {
            $scope.company = result.data;

            $scope.selectedLocation.Country = $scope.company.Country == null ? null : $.grep(countries, function (e) { return e.Name == $scope.company.Country; })[0];
            $scope.selectedLocation.State = $scope.company.State == null || $scope.selectedLocation.Country.States == null ? null : $.grep($scope.selectedLocation.Country.States, function (e) { return e.Name == $scope.company.State; })[0];
            $scope.selectedLocation.City = $scope.company.City;

            $scope.domains = $linq($scope.company.AllowedDomains).select(function (d) { return { domain: d } }).toArray();

            $scope.isLoading = false;
        });
    }

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

        apiServices.AdminService.SaveCompany($scope.company, function (result) {
            $scope.isSaving = false;

            validationPopupService.show("One or more errors occured while saving company.", result);
        }).then(function (result) {

            $scope.isSaving = false;

            $location.url('/Admin/Customers');
        });
    };

    $scope.cancel = function () {
        $location.url('/Admin/Customers');
    };
}