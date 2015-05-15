'use strict';

function SearchController($scope, $routeParams, $location, categorySkills, apiServices, signalRService, countries, popupService, stateService, $modal) {

    $scope.searchOrBrowse = 'Search';

    $scope.result = {TotalRecords:0,Items:[]};

    // Slider
    $scope.isCollapsed = true;
    $scope.toggle = function () { $scope.isCollapsed = !$scope.isCollapsed; }

    $scope.categories = Object.keys(categorySkills);

    $scope.skills = $linq($routeParams.category?[$routeParams.category]: $scope.categories).selectMany(function (k) {
        return categorySkills[k];
    }).distinct().orderBy("s => s").toArray();

    $scope.search = {
        text: $routeParams.text ? $routeParams.text : null,
        type: $routeParams.type ? $routeParams.type : "",
        categories: $routeParams.category ? [$routeParams.category] : "",
        skills: $routeParams.skill ? [$routeParams.skill] : "",
        country: "",
        city: "",
        pageIndex: 1,
        pageSize: 50,
        orderBy: "Name",
        orderReverse: false
    };

    $scope.messageToCompany = function (item) {
        popupService.messageToCompany(item.Id, item.Name);
    }

    $scope.types = [
        'Client',
        'Provider'
    ];


    $scope.invitePersonToTeam = function () {
        var modalInstance = $modal.open({
            templateUrl: '/Partials/Profile/InviteToMyTeamModal.html',
            controller: InviteToMyTeamController
        });
    };

    $scope.countries = countries;

    $scope.cities = $linq(countries).selectMany(function (c) {
        return c.States ? $linq(c.States).selectMany(function (s) { return s.Cities; })
                        : c.Cities;
    }).where("c=>c!='Other'").orderBy("c=>c").toArray();;

    $scope.pendingSearch = false;
    $scope.isSearching = false;

    $scope.doSearch = function () {
        if ($scope.pendingSearch == false) {

            $scope.isSearching = true;

            apiServices.SearchService.Search($scope.search).then(function (result) {
                $scope.isSearching = false;
                $scope.result.Items = result.data.Items;
                $scope.result.TotalRecords = result.data.TotalRecords;
                $scope.search.pageSize = result.data.PageSize;
            });
        }
    };

    $scope.resetSearch=function() {

        $scope.pendingSearch = true;

        $scope.search.text= null;
        $scope.search.type= "";
        $scope.search.categories= [];
        $scope.search.skills= [];
        $scope.search.country= "";
        $scope.search.city= "";
        //$scope.search.pageIndex= 1;
        //$scope.search.pageSize= 50;
        //$scope.search.orderBy= "Name";
        //$scope.search.orderReverse = false;
        
        setTimeout(function () {
            $scope.pendingSearch = false;
        }, 0);
    }

    $scope.briefUser = function (user) {
        var id = user.PersonId.replace("/", "_");//it may contain "/" char
        stateService.set(id, {Id:user.PersonId, Name:user.Name});
        $location.url('/Engage/CreateBrief?p=' + id);
        if (!$scope.$$phase) $scope.$apply();
    };

    $scope.$watch("search.type", function (n, v) {

        if (n === v) {
            return;
        }

        if ($scope.search.text) {
            $scope.doSearch();
        }
    });
    
    $scope.$watch("search.categories", function (n,v) {

        if (n === v) {
            return;
        }

        $scope.pendingSearch = true;

        //reset selected skills
        $scope.search.skills = [];

        $scope.skills = $linq($scope.search.categories.length > 0 ? $scope.search.categories : $scope.categories).selectMany(function (k) {
            return categorySkills[k];
        }).distinct().orderBy("s => s").toArray();

        //timeout here is used to let "watchers" to run without doing search (because of pendingSearch flag)
        setTimeout(function() {
                $scope.pendingSearch = false;
                if ($scope.search.text) {
                    $scope.doSearch();
                }
            }, 0);
        
    });

    $scope.$watch("search.skills", function (n, v) {
        if (n === v) {
            return;
        }

        if ($scope.search.text) {
            $scope.doSearch();
        }
    });

    $scope.$watch("search.country", function (n, v) {
        if (n === v) {
            return;
        }

        $scope.pendingSearch = true;

        if ($scope.search.country)
        {
            var country = $linq(countries).first("c=>c.Name == '" + $scope.search.country + "'"); //search.country is string (because needs to be for server) find country object
            $scope.cities = (country.States ? $linq(country.States).selectMany(function (state) { return state.Cities; })
                                                        : $linq(country.Cities)).where("c=>c!='Other'").orderBy("c=>c").toArray();
        } else {
            $scope.cities = $linq(countries).selectMany(function(c) {
                return c.States ? $linq(c.States).selectMany(function(s) { return s.Cities; })
                                : c.Cities;
            }).where("c=>c!='Other'").orderBy("c=>c").toArray();
        }
        $scope.search.city = "";

        setTimeout(function () {
            $scope.pendingSearch = false;
            if ($scope.search.text) {
                $scope.doSearch();
            }
        }, 0);
    });

    $scope.$watch("search.city", function (n, v) {

        if (n === v) {
            return;
        }

        if ($scope.search.text) {
            $scope.doSearch();
        }
    });

    $scope.$watch("search.orderBy", function (n, v) {
        if (n === v) {
            return;
        }
        $scope.doSearch();
    });

    $scope.$watch("search.orderReverse", function (n, v) {
        if (n === v) {
            return;
        }
        $scope.doSearch();
    });


    if ($routeParams.type || $routeParams.category || $routeParams.skill || $routeParams.text) {
        $scope.doSearch();
    }
};