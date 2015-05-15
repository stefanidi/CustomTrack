'use strict';

function CompanyProfileController($scope, $route, $routeParams, $location, apiServices, popupService, avatarUpload) {

    $scope.isLoading = true;
    $scope.notFound = false;
    $scope.companyModel = null;
    $scope.Team = [];
    $scope.companyId = $routeParams.id ? 'company/' + $routeParams.id : window.userData.CompanyId;
    $scope.isOwnProfile = ($routeParams.id == null || window.userData.CompanyId.toLowerCase() == ('company/' + $routeParams.id.toLowerCase())) && window.userData.IsCompanyAdmin;
    $scope.companyStats = [];
    $scope.firmStats = [];
    $scope.listview = true;

    if ($scope.isOwnProfile) {

        $scope.companyId = window.userData.CompanyId;

        //connect avatar upload
        $scope.onFileSelect = function ($files) {
            avatarUpload.upload($files, 2, function (data) {
                $scope.companyModel.ProfileImage = data;
            });
        }
    }

    $scope.tab = $routeParams.tab ? $routeParams.tab.toLowerCase() : "overview";

    loadCompany();
    loadTeam();
    loadFirmStats();
    loadCompanyStats();

    $scope.showTab = function (tab) {
        $scope.tab = tab ? tab.toLowerCase() : "overview";
        //$location.url('/company/' + $routeParams.id.toLowerCase() + '/'+$scope.tab);
    };

    $scope.notFoundSearch = function (searchText) {
        var searchType = userData.IsProvider ? "client" : "provider";
        $location.url("/Engage/Search?type=" + searchType + "&text=" + searchText)
    }

    $scope.messageToCompany = function() {
        popupService.messageToCompany($scope.companyId, $scope.companyModel.Name);
    }

    //--- Private Funcs ---

    function onProfileChanged() {
        apiServices.CompanyService.SaveProfile($scope.companyModel);
    }

    function loadCompany() {

        if ($scope.isOwnProfile) {

            apiServices.CompanyService.GetOwnCompanyProfile().then(function (result) {
                $scope.companyModel = result.data;
                $scope.CompanyType = result.data.CompanyType;
                checkLocation();

                $scope.$watch("companyModel.Overview", function () {
                    onProfileChanged();
                });
            });

        } else {
            apiServices.CompanyService.GetCompanyProfile($scope.companyId).then(function (result) {
                $scope.isLoading = false;
                if (result.data == null) {
                    $scope.notFound = true;
                    $scope.searchFor = $routeParams.id;
                    return;
                }
                $scope.notFound = false;
                $scope.companyModel = result.data;
                $scope.CompanyType = result.data.CompanyType;
                checkLocation();
            });

        }
    };

    function loadTeam() {
        apiServices.CompanyService.GetCompanyTeam($scope.companyId).then(function (result) {
            $scope.isLoading = false;
            $scope.Team = result.data.Team;
        });
    };

    function loadFirmStats() {
        apiServices.CompanyService.GetFirmStats($scope.companyId).then(function (result) {
            $scope.firmStats = result.data;
        });
    };

    function loadCompanyStats() {
        apiServices.CompanyService.GetCompanyStats($scope.companyId).then(function (result) {
            $scope.companyStats = result.data;
        });
    };

    //Ensure that we are showing correct html template for company/firm
    function checkLocation() {
        if (new RegExp($scope.companyModel.CompanyType, 'i').test($location.path()) == false) {
            if (/Company/i.test($location.path())) $location.url($location.url().replace(/Company/i, 'Firm'));
            else if (/Firm/i.test($location.path())) $location.url($location.url().replace(/Firm/i, 'Company'));
        }
    }
};
