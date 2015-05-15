'use strict';

function SearchGroupsController($scope, $routeParams, $location, signalRService, apiServices, $q) {
    $scope.listview = false;

    //DUMMY DATA
    $scope.group = {};
    $scope.group.Url = "#/Group";
    $scope.group.LogoImage = true;
    $scope.group.LogoUrl = "http://www.coopermills.com.au/wp-content/uploads/2013/06/technology-law.jpg";
    $scope.group.Name = "Technology Lawyers";
    $scope.group.Description = "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    $scope.group.Members = 3;
};