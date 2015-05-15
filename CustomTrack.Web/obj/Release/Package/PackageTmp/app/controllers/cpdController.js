'use strict';

function CPDController($scope, $location) {
    $scope.isActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path.indexOf(r) == 0; });
        }
        return path.indexOf(route) == 0;
    }

}

function CPDSearchController($scope, $location, categorySkills) {
    $scope.isActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path.indexOf(r) == 0; });
        }
        return path.indexOf(route) == 0;
    }

    $scope.topics = [
        'Cat1',
        'cat2',
        'cat3'
    ];

    $scope.type = [
        'In Person',
        'Online',
        'Video'
    ];

    $scope.locations = [
    'All',
    'Australia',
    'New Zealand'
    ];

    $scope.area = [
        'All',
        'Sydney',
        'Melbourne',
        'Brisbane',
        'Adelaide',
        'Peth',
        'Hobart',
        'Wellington',
        'Auckland'
    ];

    $scope.cost = [
        'All',
        '$0-100',
        '$101-500',
        '$501-1000',
        '$1000+'
    ];

    $scope.status = {
        isopen: false
    };

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };

    $scope.categorySkills = categorySkills;


}
function CPDSettingsController($scope, $location, categorySkills) {
    $scope.areasOfInterest = categorySkills;

    $scope.show = 'interests';

    $scope.clickInterests = function () {
        $scope.show = 'interests';
    }
    $scope.clickYear = function () {
        $scope.show = 'year';
    }
    $scope.clickContact = function () {
        $scope.show = 'contact';
    }

    $scope.isActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path.indexOf(r) == 0; });
        }
        return path.indexOf(route) == 0;
    }

}

function CPDTrackerController($scope, $filter, $location, ngTableParams) {
    var data = [{ topic: "Contract Management", year: "2015", date: "1st Feb", points: 5, company: "International Contract" },
                { topic: "Contract Drafing", year: "2015", date: "1st Mar", points: 2, company: "Baker + McKenzie" }];

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
            year: 'asc'     // initial sorting
        }
    }, {
        total: data.length, // length of data
        getData: function ($defer, params) {
            // use build-in angular filter
            var orderedData = params.sorting() ?
                                $filter('orderBy')(data, params.orderBy()) :
                                data;
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });

    $scope.isCollapsed = true;
    $scope.toggle = function () { $scope.isCollapsed = !$scope.isCollapsed }

    $scope.isActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path.indexOf(r) == 0; });
        }
        return path.indexOf(route) == 0;
    }

}