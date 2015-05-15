'use strict';

angular.module('bbApp', ['bbApp.constants', 'bbApp.services']).
        controller('SignupController', ['$scope', 'countries', 'apiServices', function ($scope, countries, apiServices) {

            $scope.data = {
                email: null,
                companyId: null,
                location: null,
                state: null,
                city: null
            };

            $scope.model = {
                email: '',
                company: ''
            };
            
            $scope.selectedLocation = {
                Country: null,
                State: null,
                City: null
            };

            $scope.Countries = countries;

            var companyType = window.registrationType == "Client" ? 1 : 2;
            apiServices.CompanyService.GetCompanies(companyType).then(function (result) {
                $scope.Companies = result.data;

                if ($scope.data.companyId) {
                    $scope.model.company = $linq($scope.Companies).firstOrDefault(null, function (c) { return c.Id === $scope.data.companyId; });
                }

                if ($scope.data.email) {
                    $scope.model.email = $scope.data.email;
                }

                $scope.selectedLocation.Country = $linq($scope.Countries).firstOrDefault(null, function (e) { return e.Name == $scope.data.location; });
                if ($scope.selectedLocation.Country) {
                    $scope.selectedLocation.State = $linq($scope.selectedLocation.Country.States).firstOrDefault(null, function (e) { return e.Name == $scope.data.state; });
                    $scope.selectedLocation.City = $linq($scope.selectedLocation.State ? $scope.selectedLocation.State.Cities : $scope.selectedLocation.Country.Cities).firstOrDefault("Other", function (e) { return e == $scope.data.city; });
                }
                
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
            
        }]);
