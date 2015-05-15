

function MyProvidersController($scope, $routeParams, $location, signalRService, apiServices, popupService, stateService) {

    $scope.myProviders = [];

    loadProviders();
    
    //--- Private Functions ---
    function loadProviders() {
        apiServices.PersonService.GetMyPersons().then(
            function (result) {
                $scope.myProviders = result.data;

                //Watch the Notes to save them
                angular.forEach($scope.myProviders, function (item) {
                    var personModel = item;
                    $scope.$watch(function () { return personModel.MyNotes }, function (newValue, oldValue) {
                        if (newValue != oldValue) {
                            apiServices.PersonService.AddMyPersonNote(personModel.Person.Id, newValue);
                        }
                    });
                });
            });
    };

    $scope.quickMessage = function (id, name) {
        popupService.quickMessage(id, name, '');
    }

    $scope.briefUser = function (user) {
        var id = user.Id.replace("/", "_");//it may contain "/" char
        stateService.set(id, user);
        $location.url('/Engage/CreateBrief?p=' + id);
        if (!$scope.$$phase) $scope.$apply();
    };
};

function ReportsController($scope, $routeParams, $location, signalRService) {
    $scope.isCollapsed = true;
    $scope.toggle = function () { $scope.isCollapsed = !$scope.isCollapsed; }
};

function SpendByBriefController($scope, $routeParams, $location, signalRService) {
    $scope.isCollapsed = true;

    $scope.spendChartConfig = {
        options: {
            chart: {
                type: 'area'
            },
            plotOptions: {
                series: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: false
                }
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            min: 0
        },
        xAxis: {
            categories: [
                'Jetson',
                'Grange',
                'White Rabbit',
                'ACCC'
            ]
        },
        series: [
            {
                name: 'Some data',
                data: [
                231231,
                285455,
                454654,
                321231
                ],
                id: 'series-0',
                dashStyle: 'Solid',
                type: 'bar',
                connectNulls: false
            }
        ],
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        loading: false,
        size: {
            height: '250'
        }
    }

    $scope.toggle = function () { $scope.isCollapsed = !$scope.isCollapsed }
};

function SpendByProviderReportController($scope, $routeParams, $location, signalRService, $filter, ngTableParams) {
    var data = [{ brief: "Jetson MSA", crp: "Andy McNee", date: "3 Jan 2014", amount: 500000 },
                { brief: "Grange MSA", crp: "Anthony Foley", date: "3 Jan 2014", amount: 600000 },
                { brief: "White Rabbit MSA", crp: "Natasha Datos", date: "3 Jan 2014", amount: 400000 },
                { brief: "ACCC Litigation", crp: "Andy McNee", date: "3 Jan 2014", amount: 550000 }];

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
            name: 'asc'     // initial sorting
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

    $scope.spendChartConfig = {
        options: {
            chart: {
                type: 'column'
            },
            plotOptions: {
                series: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    showInLegend: false
                }
            }
        },
        xAxis: {
            categories: [
                'Jan',
                'Feb',
                Date.UTC(2015, 03, 01)
            ]
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        series: [
          {
              data: [
                7,
                17,
                4
              ],
              id: 'series-7',
              type: 'column'
          },
          {
              data: [
                2,
                4,
                19
              ],
              id: 'series-9'
          }
        ],
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        loading: false,
        size: {
            height: 250
        },
        useHighStocks: false
    }

    $scope.paymentsByCategoryChartConfig = {
        options: {
            chart: {
                type: 'pie'
            },
            plotOptions: {
                series: {
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
            name: 'Revenue share',
            data: [
                ['Corporate', 45.0],
                ['Advisory', 26.8],
                {
                    name: 'Technology',
                    y: 12.8
                }
            ]
        }],
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        loading: false,
        size: {
            width: 250,
            height: 300
        }
    }

    $scope.paymentsByBriefChartConfig = {
        options: {
            chart: {
                type: 'area'
            },
            plotOptions: {
                series: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: false
                }
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            min: 0
        },
        xAxis: {
            categories: [
                'Jetson',
                'Grange',
                'White Rabbit',
                'ACCC'
            ]
        },
        series: [
            {
                name: 'Some data',
                data: [
                231231,
                285455,
                454654,
                321231
                ],
                id: 'series-0',
                dashStyle: 'Solid',
                type: 'bar',
                connectNulls: false
            }
        ],
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        loading: false,
        size: {
            width: 522,
            height: 300
        }
    }

    // Slider
    $scope.isCollapsed = true;
    $scope.toggle = function () { $scope.isCollapsed = !$scope.isCollapsed }
};

function AdminController($scope, $routeParams) {

    $scope.Admin = [];

};



function AdminAnalyticsController($scope, $routeParams, $location, signalRService, $filter, ngTableParams) {
    // Slider
    $scope.isCollapsed = true;
    $scope.toggle = function () { $scope.isCollapsed = !$scope.isCollapsed }

    // Table Data
    var data = [{ date: "1 Jun 2013", customer: "Qantas Airways", spend: 0 },
                { date: "29 Sep 2012", customer: "QBE Insurance Group", spend: 534535 },
                { date: "12 Apr 2014", customer: "Winning Appliances", spend: 4534345 },
                { date: "6 May 2014", customer: "Wesfarmers", spend: 6345345 }];

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
            spend: 'desc'     // initial sorting
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

    $scope.revenueChartConfig = {
        options: {
            chart: {
                type: 'areaspline'
            },
            plotOptions: {
                series: {
                    stacking: ''
                }
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            min: 0
        },
        series: [
          {
              name: 'Providers',
              data: [
                5, 324, 897, 1005, 1520
              ],
              connectNulls: true,
              id: 'series-1'
          },
          {
              name: 'Clients',
              data: [
                20, 100, 234, 568, 789
              ],
              id: 'series-0'
          }
        ],
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        loading: false,
        size: {
            height: 250
        }
    }

    $scope.clientsChartConfig = {
        options: {
            chart: {
                type: 'areaspline'
            },
            plotOptions: {
                series: {
                    stacking: ''
                }
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            min: 0
        },
        series: [
          {
              name: 'Clients',
              data: [
                20, 100, 234, 568, 789
              ],
              id: 'series-0'
          }
        ],
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        loading: false,
        size: {
            height: 250
        }
    }

    $scope.providersChartConfig = {
        options: {
            chart: {
                type: 'areaspline'
            },
            plotOptions: {
                series: {
                    stacking: ''
                }
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            min: 0
        },
        series: [
          {
              name: 'Providers',
              data: [
                5, 324, 897, 1005, 1520
              ],
              connectNulls: true,
              id: 'series-1'
          }
        ],
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        loading: false,
        size: {
            height: 250
        }
    }

    $scope.revenueByClientChartConfig = {
        options: {
            chart: {
                type: 'pie'
            },
            plotOptions: {
                series: {
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
            name: 'Revenue share',
            data: [
                ['Qantas', 45.0],
                ['HP', 26.8],
                {
                    name: 'IBM',
                    y: 12.8
                }
            ]
        }],
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        loading: false,
        size: {
            height: 200
        }
    }

    $scope.revenueByCategoryChartConfig = {
        options: {
            chart: {
                type: 'pie'
            },
            plotOptions: {
                series: {
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
            name: 'Revenue share',
            data: [
                ['Qantas', 45.0],
                ['HP', 26.8],
                {
                    name: 'IBM',
                    y: 12.8
                }
            ]
        }],
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        loading: false,
        size: {
            height: 200
        }
    }

    $scope.revenueByProviderChartConfig = {
        options: {
            chart: {
                type: "pie"
            },
            plotOptions: {
                series: {
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
            name: 'Revenue share',
            data: [
                ['Qantas', 45.0],
                ['HP', 26.8],
                {
                    name: 'IBM',
                    y: 12.8
                }
            ]
        }],
        title: {
            text: ""
        },
        credits: {
            enabled: false
        },
        loading: false,
        size: {
            height: 200
        }
    }

    $scope.isActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path.indexOf(r) == 0; });
        }
        return path.indexOf(route) == 0;
    }

    $scope.isExactActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path == r; });
        }
        return path == route;
    }
};

function AdminAnalyticsByCategoryController($scope, $routeParams, $location, signalRService, $filter, ngTableParams) {
    // Slider
    $scope.isCollapsed = true;
    $scope.toggle = function () { $scope.isCollapsed = !$scope.isCollapsed }

    // Table Data
    var data = [{ date: "1 Jun 2013", customer: "Qantas Airways", spend: 0 },
                { date: "29 Sep 2012", customer: "QBE Insurance Group", spend: 534535 },
                { date: "12 Apr 2014", customer: "Winning Appliances", spend: 4534345 },
                { date: "6 May 2014", customer: "Wesfarmers", spend: 6345345 }];

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
            spend: 'desc'     // initial sorting
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

    $scope.spendChartConfig = {
        options: {
            chart: {
                type: 'area'
            },
            plotOptions: {
                series: {
                    stacking: ''
                }
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            min: 0
        },
        series: [
            {
                name: 'Some data',
                data: [
                1,
                2,
                4,
                7,
                3
                ],
                id: 'series-0',
                dashStyle: 'Solid',
                type: 'bar',
                connectNulls: false
            }
        ],
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        loading: false,
        size: {
            height: 250
        }
    }

    $scope.isActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path.indexOf(r) == 0; });
        }
        return path.indexOf(route) == 0;
    }

    $scope.isExactActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path == r; });
        }
        return path == route;
    }
};

function AdminAnalyticsByClientController($scope, $routeParams, $location, signalRService, $filter, ngTableParams) {
    // Slider
    $scope.isCollapsed = true;
    $scope.toggle = function () { $scope.isCollapsed = !$scope.isCollapsed }

    // Table Data
    var data = [{ name: "Maddocks", number: 9999, revenue: 320000, type: "Provider", premium: "No", users: 40, country: "Australia", created: "29 Sep 2012", view: "View" },
                { name: "HP", number: 8000, revenue: 2300000, type: "Client", premium: "Yes", users: 90, country: "Australia", created: "12 Apr 2014", view: "View" },
                { name: "Samsung", number: 5000, revenue: 640000, type: "Client", premium: "Yes", users: 90, country: "Australia", created: "6 May 2014", view: "View" },
                { name: "Freehills", number: 8500, revenue: 0, type: "Provider", premium: "No", users: 0, country: "Australia", created: "1 Jun 2013", view: "View" }];

    $scope.filters = {
        name: ''
    };

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        filter: $scope.filters,
        sorting: {
            name: 'asc'     // initial sorting
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

    $scope.$watch('name', function (value) {
        if (this.last !== undefined) {
            if (!value) {
                $scope.tableParams.filter({});
            } else {
                $scope.tableParams.filter({ status: value });
            }
        }
    });

    $scope.isActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path.indexOf(r) == 0; });
        }
        return path.indexOf(route) == 0;
    }

    $scope.isExactActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path == r; });
        }
        return path == route;
    }
};

function BigDataController($scope, $routeParams, $location, signalRService, $filter, ngTableParams) {
    // Slider
    $scope.isCollapsed = true;
    $scope.toggle = function () { $scope.isCollapsed = !$scope.isCollapsed }

    //chartconfig
    $scope.chart1Config = {
        options: {
            chart: {
                type: 'areaspline'
            },
            plotOptions: {
                series: {
                    stacking: ''
                }
            }
        },
        yAxis: {
            title: {
                text: 'No.'
            },
            min: 0
        },
        series: [
          {
              name: 'Clients',
              data: [
                20, 100, 234, 568, 789
              ],
              id: 'series-0',
              type: 'line'
          },
          {
              name: 'Providers',
              data: [
                5, 324, 897, 1005, 1520
              ],
              connectNulls: true,
              id: 'series-1',
              type: 'line'
          }
        ],
        title: {
            text: ''
        },
        credits: {
            enabled: true
        },
        loading: false,
        size: {
            height: 500
        }
    }

    $scope.chart2Config = {
        options: {
            chart: {
                type: 'pie'
            },
            plotOptions: {
                series: {
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
            name: 'Revenue share',
            data: [
                ['Qantas', 45.0],
                ['HP', 26.8],
                {
                    name: 'IBM',
                    y: 12.8
                }
            ]
        }],
        title: {
            text: ''
        },
        credits: {
            enabled: true
        },
        loading: false,
        size: {
            height: 200
        }
    }

    $scope.chart3Config = {
        options: {
            chart: {
                type: 'pie'
            },
            plotOptions: {
                series: {
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
            name: 'Revenue share',
            data: [
                ['Qantas', 45.0],
                ['HP', 26.8],
                {
                    name: 'IBM',
                    y: 12.8
                }
            ]
        }],
        title: {
            text: ''
        },
        credits: {
            enabled: true
        },
        loading: false,
        size: {
            height: 200
        }
    }

    $scope.chart4Config = {
        options: {
            chart: {
                type: 'pie'
            },
            plotOptions: {
                series: {
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
            name: 'Revenue share',
            data: [
                ['Qantas', 45.0],
                ['HP', 26.8],
                {
                    name: 'IBM',
                    y: 12.8
                }
            ]
        }],
        title: {
            text: ''
        },
        credits: {
            enabled: true
        },
        loading: false,
        size: {
            height: 200
        }
    }

    // Table Data
    var data = [{ date: "1 Jun 2013", customer: "Qantas Airways", spend: 0 },
                { date: "29 Sep 2012", customer: "QBE Insurance Group", spend: 534535 },
                { date: "12 Apr 2014", customer: "Winning Appliances", spend: 4534345 },
                { date: "6 May 2014", customer: "Wesfarmers", spend: 6345345 }];

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
            spend: 'desc'     // initial sorting
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

    $scope.isActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path.indexOf(r) == 0; });
        }
        return path.indexOf(route) == 0;
    }

    $scope.isExactActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path == r; });
        }
        return path == route;
    }
};

function BigDataClientController($scope, $routeParams, $location, signalRService, $filter, ngTableParams) {
    // Slider
    $scope.isCollapsed = true;
    $scope.toggle = function () { $scope.isCollapsed = !$scope.isCollapsed }

    // Table Data
    var data = [{ name: "HP", number: 1, revenue: 32100000, size: "Large", users: 1024, teams: 334, briefs: 7024, rooms: 389, panels: 72 },
                { name: "IBM", number: 2, revenue: 52100000, size: "Large", users: 1233, teams: 423, briefs: 9056, rooms: 231, panels: 44 }];

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
            spend: 'desc'     // initial sorting
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

    //chartconfig
    $scope.clientsChartConfig = {
        options: {
            chart: {
                type: 'areaspline'
            },
            plotOptions: {
                series: {
                    stacking: ''
                }
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            min: 0
        },
        series: [
          {
              name: 'Clients',
              data: [
                20, 100, 234, 568, 789
              ],
              id: 'series-0'
          }
        ],
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        loading: false,
        size: {
            height: 250
        }
    }

    $scope.isActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path.indexOf(r) == 0; });
        }
        return path.indexOf(route) == 0;
    }

    $scope.isExactActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path == r; });
        }
        return path == route;
    }
};

function BigDataProviderController($scope, $routeParams, $location, signalRService, $filter, ngTableParams) {
    // Slider
    $scope.isCollapsed = true;
    $scope.toggle = function () { $scope.isCollapsed = !$scope.isCollapsed }

    // Table Data
    var data = [{ name: "HP", number: 1, revenue: 32100000, size: "Large", users: 1024, teams: 334, briefs: 7024, rooms: 389, panels: 72 },
                { name: "IBM", number: 2, revenue: 52100000, size: "Large", users: 1233, teams: 423, briefs: 9056, rooms: 231, panels: 44 }];

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
            spend: 'desc'     // initial sorting
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

    //chartconfig
    $scope.providersChartConfig = {
        options: {
            chart: {
                type: 'areaspline'
            },
            plotOptions: {
                series: {
                    stacking: ''
                }
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            min: 0
        },
        series: [
          {
              name: 'Providers',
              data: [
                20, 100, 234, 568, 789
              ],
              id: 'series-0'
          }
        ],
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        loading: false,
        size: {
            height: 250
        }
    }

    $scope.isActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path.indexOf(r) == 0; });
        }
        return path.indexOf(route) == 0;
    }

    $scope.isExactActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path == r; });
        }
        return path == route;
    }
};

function BigDataTransactionController($scope, $routeParams, $location, signalRService, $filter, ngTableParams) {
    // Slider
    $scope.isCollapsed = true;
    $scope.toggle = function () { $scope.isCollapsed = !$scope.isCollapsed }

    //chartconfig
    $scope.briefsChartConfig = {
        options: {
            chart: {
                type: 'areaspline'
            },
            plotOptions: {
                series: {
                    stacking: ''
                }
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            min: 0
        },
        series: [
          {
              name: 'Briefs',
              data: [
                20, 100, 234, 568, 789
              ],
              id: 'series-0'
          }
        ],
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        loading: false,
        size: {
            height: 250
        }
    }

    $scope.workroomsChartConfig = {
        options: {
            chart: {
                type: 'areaspline'
            },
            plotOptions: {
                series: {
                    stacking: ''
                }
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            min: 0
        },
        series: [
          {
              name: 'Workrooms',
              data: [
                20, 100, 234, 568, 789
              ],
              id: 'series-0'
          }
        ],
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        loading: false,
        size: {
            height: 250
        }
    }

    $scope.isActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path.indexOf(r) == 0; });
        }
        return path.indexOf(route) == 0;
    }

    $scope.isExactActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path == r; });
        }
        return path == route;
    }
};

function BigDataIndustryController($scope, $routeParams, $location, signalRService, $filter, ngTableParams) {
    // Slider
    $scope.isCollapsed = true;
    $scope.toggle = function () { $scope.isCollapsed = !$scope.isCollapsed }

    // Table Data
    var data = [{ name: "Maddocks", value: 20034872, time: "5.4", size: 17, location: "Sydney", completed: "Yes" },
                { name: "FreeHills", value: 7321421, time: "2.3", size: 5, location: "Sydney", completed: "No" }];

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
            spend: 'desc'     // initial sorting
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

    $scope.top5Config = {
        options: {
            chart: {
                type: "area"
            },
            plotOptions: {
                series: {
                    stacking: ""
                }
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            min: 0
        },
        series: [
            {
                name: "Some data",
                data: [
                1,
                2,
                4,
                7,
                3
                ],
                id: "series-0",
                dashStyle: "Solid",
                type: "bar",
                connectNulls: false
            }
        ],
        title: {
            text: ""
        },
        credits: {
            enabled: false
        },
        loading: false,
        size: {
            height: 250
        }
    }

    $scope.avgSizeConfig = {
        options: {
            chart: {
                type: "areaspline"
            },
            plotOptions: {
                series: {
                    stacking: ""
                }
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            min: 0
        },
        series: [
          {
              name: "Users",
              data: [
                0, 190, 250, 190, 0
              ],
              id: "series-0"
          }
        ],
        title: {
            text: ""
        },
        credits: {
            enabled: false
        },
        loading: false,
        size: {
            height: 250
        }
    }

    $scope.isActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path.indexOf(r) == 0; });
        }
        return path.indexOf(route) == 0;
    }

    $scope.isExactActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path == r; });
        }
        return path == route;
    }
};

function SystemDataOverviewController($scope, $routeParams, $location, signalRService, $filter, ngTableParams) {
    // Slider
    $scope.isCollapsed = true;
    $scope.toggle = function () { $scope.isCollapsed = !$scope.isCollapsed }

    $scope.isActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path.indexOf(r) == 0; });
        }
        return path.indexOf(route) == 0;
    }

    $scope.isExactActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path == r; });
        }
        return path == route;
    }
};

function ProfileController($scope, $routeParams, $location, signalRService, apiServices) {
    $scope.nav = {
        overview: false
    };
    //Check that this is self view
    //$scope.isSelfView = 
    $scope.isExactActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path == r; });
        }
        return path == route;
    }
};