'use strict';

function ActiveClientsController($scope, apiServices) {
    $scope.companies = [];
    var countOfCompanies = 10;

    apiServices.CompanyService.ActiveClients(countOfCompanies).then(function (result) {
        $scope.companies = result.data;
    });
}