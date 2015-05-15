'use strict';

function FooterController($scope, apiServices) {
    apiServices.CompanyService.GetOwnCompanyProfile().then(function (result) {
        $scope.companyModel = result.data;
    });
}