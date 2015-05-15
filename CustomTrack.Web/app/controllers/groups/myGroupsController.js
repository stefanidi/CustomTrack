'use strict';

function MyGroupsController($scope, $routeParams, $location, signalRService, apiServices, $q) {
    $scope.listview = false;

    //DUMMY DATA
    $scope.group = {};
    $scope.group.Url = "#/Group";
    $scope.group.LogoImage = true;
    $scope.group.LogoUrl = "http://www.coopermills.com.au/wp-content/uploads/2013/06/technology-law.jpg";
    $scope.group.Name = "Technology Lawyers";
    $scope.group.Description = "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
    $scope.group.Members = 3;

    $scope.discussion = {};
    $scope.discussion.Url = "#/Group?s=Discussions";
    $scope.discussion.GroupUrl = "#/Group";
    $scope.discussion.Name = "Privacy Changes 2015";
    $scope.discussion.AuthorName = "Paul Lanzone";
    $scope.discussion.AuthorUrl = "#/Profile/43";
    $scope.discussion.Group = "Technology Lawyers";
    $scope.discussion.Description = "here are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable";
};