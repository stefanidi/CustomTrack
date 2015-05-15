'use strict';

function ActiveProvidersController($scope, apiServices) {
    $scope.persons = [];
    var countPersons = 10;

    apiServices.PersonService.ActiveProviders(countPersons).then(function (result) {
        $scope.persons = result.data;
    });
}