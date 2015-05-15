'use strict';

function UserProfileController($scope, $route, $routeParams, $location, apiServices, avatarUpload, stateService, categorySkills) {

    $scope.notFound = false;
    $scope.isLoading = true;
    $scope.person = null;
    $scope.currentUserId = $routeParams.id == null ? userData.Id : 'user/' + $routeParams.id;
    $scope.isOwnProfile = $routeParams.id == null || userData.Id == 'user/' + $routeParams.id;
    $scope.IsProvider = false;
    $scope.showOverview = true;
    $scope.providerBriefStats = null;
    $scope.clientBriefStats = null;
    $scope.skillsSelectOptions = { maxHeight: 200, numberDisplayed: 0 };
    $scope.categoriesDuplicates = [];

    $scope.clickOverview = function() {
        $scope.showOverview = true;
        $scope.showExperience = false;
        $scope.showHistory = false;
        $scope.showTeam = false;
    }

    $scope.clickHistory = function () {
        $scope.showOverview = false;
        $scope.showExperience = false;
        $scope.showHistory = true;
        $scope.showTeam = false;
    }

    $scope.clickExperience = function () {
        $scope.showOverview = false;
        $scope.showExperience = true;
        $scope.showHistory = false;
        $scope.showTeam = false;
    }

    $scope.clickTeam = function () {
        $scope.showOverview = false;
        $scope.showExperience = false;
        $scope.showHistory = false;
        $scope.showTeam = true;
    }

    if ($scope.isOwnProfile) {

        $scope.categorySkills = categorySkills;
        $scope.categories = [];
        $scope.IsProvider = userData.IsProvider;
        $scope.editCategoriesMode = false;

        $scope.editCategories = function() {
            $scope.categories = $scope.person.Categories.slice(0);

            if ($scope.categories.length == 0) {
                $scope.addCategory();
            }
            $scope.editCategoriesMode = true;
        };

        $scope.saveCategories = function () {

            $scope.categoriesDuplicates = [];
            
            $scope.categories.forEach(function (c) {
                c.duplicate = false;
            });

            var duplicates =
                $linq($scope.categories)
                .groupBy(function (c) { return c.Name; }, function (c) { return c; })
                .where(function (c) { return c.values.length >= 2; })
                .toArray();
            
            if (duplicates.length > 0) {
                duplicates.forEach(function(c) {
                    c.duplicate = true;
                });
                $scope.categoriesDuplicates = duplicates;
                return;
            }

            $scope.person.Categories = $linq($scope.categories).where(function (c) { return c.Name; }).toArray();
            onProfileChanged().then(function() {
                $scope.editCategoriesMode = false;
                $scope.categories = [];
            });
        }

        $scope.cancelEditCategories = function() {
            $scope.editCategoriesMode = false;
            $scope.categories = [];
        }

        $scope.addCategory = function () {
            $scope.categories.push({ Name: "", LookupSkills: [], Skills: [] });
        };

        $scope.removeCategory = function (category) {
            $scope.categories.remove(category);
        };


        if (userData.IsProvider) {
            $route.current.templateUrl = '/Partials/Profile/Provider/IndividualOwn/Overview.html';
        } else {
            $route.current.templateUrl = '/Partials/Profile/Client/IndividualOwn/Overview.html';
        }

        //connect avatar upload
        $scope.onFileSelect = function ($files) {
            avatarUpload.upload($files, 1, function (data) {
                $scope.person.ProfileImage = data;
            });
        }
    }

    loadPerson();

    $scope.nav = {
        overview: true
    };

    $scope.briefUser = function (user) {
        var id = user.Id.replace("/", "_");//it may contain "/" char
        stateService.set(id, user);
        $location.url('/Engage/CreateBrief?p=' + id);
        if (!$scope.$$phase) $scope.$apply();
    };

    function getTeam() {
        apiServices.PersonService.GetMyTeam().then(
            function (result) {
                $scope.Team = result.data;
            });
    };

    $scope.checkPrivacy = function(type) {

        if ($scope.person === null) {
            return false;
        }

        return $linq($scope.person.PrivacySettings).any(function (p) { return p === type; });
    };

    $scope.notFoundSearch = function (searchText) {
        var searchType = userData.IsProvider ? "client" : "provider";
        $location.url("/Engage/Search?type=" + searchType + "&text=" + searchText);
    }

    getTeam();

    
    //--- Private Funcs ---

    function onProfileChanged() {
        return apiServices.PersonService.SaveProfile($scope.person);
    }

    function loadProviderBriefStats() {
        apiServices.BriefsService.GetProviderBriefStats($scope.currentUserId).then(function (result) {
            $scope.providerBriefStats = result.data;
        });
    }

    function loadClientBriefStats() {
        apiServices.BriefsService.GetClientBriefStats($scope.currentUserId).then(function (result) {
            $scope.clientBriefStats = result.data;
        });
    }

    function loadPerson() {
        if ($scope.isOwnProfile) {
            apiServices.PersonService.GetOwnProfile().then(function (result) {
                $scope.isLoading = false;
                $scope.person = result.data;
                
                $scope.$watch("person.About", function(newValue, oldValue) {
                    onProfileChanged();
                });
            });
        } else {
            apiServices.PersonService.Get($routeParams.id).then(function (result) {
                $scope.isLoading = false;
                if (result.data) {
                    $scope.notFound = false;
                    $scope.person = result.data;
                    $scope.IsProvider = result.data.PersonRef.IsProvider;
                } else {
                    $scope.notFound = true;
                    $scope.searchFor = $routeParams.id;
                }
            });
        }

        //We always want to load stats for profile. This is shown both on public profile and on own profile.
        //At this stage it doesn't mapper if we load both provider and client. only relevant one will be used anyway
        loadProviderBriefStats();
        loadClientBriefStats();
    };
};