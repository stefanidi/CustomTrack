'use strict';

function RecruitController($scope, $routeParams, $location) {
    $scope.isActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path.indexOf(r) == 0; });
        }
        return path.indexOf(route) == 0;
    }

    $scope.manageChartConfig = {
        "options": {
            "chart": {
                "type": "pie",
                "backgroundColor": "none",
                "marginTop": "-50"
            },
            "plotOptions": {
                "series": {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            }
        },
        series: [{
            name: 'Opportunities',
            data: [
                ['No Responses', 6],
                ['Responded', 3],
                {
                    name: 'Responded by Shortlist',
                    y: 1
                }
            ]
        }],
        "title": {
            "text": ""
        },
        "credits": {
            "enabled": false
        },
        "loading": false,
        "size": {
            "height": "300"
        }
    }

}
function RecruitSearchController($scope, $routeParams, $location) {
    $scope.isActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path.indexOf(r) == 0; });
        }
        return path.indexOf(route) == 0;
    }

    $scope.categories = [
        'Cat1',
        'cat2',
        'cat3'
    ];

    $scope.skills = [
        'skill1',
        'skill2'
    ];

    $scope.postqualifications = [
        'All',
        '1-3',
        '4-6',
        '7-9',
        '10+'
    ];

    $scope.salaryexpectations = [
        'All',
        '0-50k',
        '50-100k',
        '101-150k',
        '151-200k',
        '200k+'
    ];

    $scope.locations = [
        'All',
        'Australia',
        'New Zealand'
    ];

    $scope.sublocations = [
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

    $scope.employmenttype = [
        'All',
        'Lawyer',
        'Paralegal',
        'Assistant',
        'Non-Legal'
    ];

    $scope.employmementstyle = [
        'All',
        'Private Practice',
        'In-House',
        'Other'
    ]
    $scope.dateposted = [
        '1 Day',
        '2 - 7 Days',
        '8 - 14 Days',
        '14 - 30 Days',
        '30+ Days'
    ]
    

    $scope.status = {
        isopen: false
    };

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };

}
