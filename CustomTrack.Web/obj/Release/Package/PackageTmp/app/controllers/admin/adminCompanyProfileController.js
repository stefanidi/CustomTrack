'use strict';

function AdminCompanyProfileController($scope, apiServices, countries, avatarUpload) {

    $scope.company = {};
    $scope.domains = {};
    $scope.selectedLocation = {
        Country: null,
        State: null,
        City: null
    };

    $scope.Countries = countries;

    $scope.uploadAvatar = function ($files) {
        avatarUpload.upload($files, 2, function (data) {
            $scope.company.ProfileImage = data;
        });
    }

    $scope.addDomain = function() {
        $scope.domains.push({ domain: "" });
    };

    $scope.deleteDomain = function(domain) {
        $scope.domains.remove(domain);
    }

    $scope.isSaving = false;
    $scope.save = function () {

        $scope.isSaving = true;

        $scope.company.Country = $scope.selectedLocation.Country ? $scope.selectedLocation.Country.Name : null;
        $scope.company.State = $scope.selectedLocation.State ? $scope.selectedLocation.State.Name : null;
        $scope.company.City = $scope.selectedLocation.City;

        $scope.company.AllowedDomains = $linq($scope.domains).where(function (d) { return d.domain; }).select(function (d) { return d.domain; }).orderBy("d=>d.domain").toArray();

        apiServices.CompanyService.SaveProfile($scope.company).then(function (result) {

            $scope.isSaving = false;
        });
    };

    apiServices.CompanyService.GetOwnCompanyProfile().then(function(result) {

        $scope.company = result.data;
        $scope.domains = $linq(result.data.AllowedDomains).select(function (d) { return { domain: d }; }).toArray();

        $scope.selectedLocation.Country = $linq($scope.Countries).firstOrDefault(null, function (e) { return e.Name == result.data.Country; });
        $scope.selectedLocation.State = $linq($scope.selectedLocation.Country.States).firstOrDefault(null, function (e) { return e.Name == result.data.State; });
        $scope.selectedLocation.City = $linq($scope.selectedLocation.State ? $scope.selectedLocation.State.Cities : $scope.selectedLocation.Country.Cities).firstOrDefault("Other", function (e) { return e == result.data.City; });

        $scope.$watch("selectedLocation.Country", function (oldVal, newVal) {
            if (oldVal != newVal) {
                $scope.selectedLocation.State = null;
                $scope.selectedLocation.City = null;
            }
        });

        $scope.$watch("selectedLocation.State", function (oldVal, newVal) {
            if (oldVal != newVal) {
                $scope.selectedLocation.City = null;
            }
        });

    });
}