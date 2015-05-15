'use strict';

function EngageController($scope, $routeParams, $location, categorySkills, apiServices) {

    //Probably don't need this
    //$scope.searchOrBrowse = 'Search';

    $scope.marketSummary = {};

    $scope.bfChartConfig = {
        options: {
            chart: {
                renderTo: 'chart-container',
                margin: 0,
                type: 'pie'
            },
            plotOptions: {
                series: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    borderWidth: 0,
                    size: '100%',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            }
        },
        series: [{
            name: 'Total',
            data: [
                ['Clients', 0],
                ['Providers', 0],
            ]
        }],
        title: {
            text: 'Market Data'
        },
        credits: {
            enabled: false
        },
        loading: false
    }
    $scope.bfChartConfig.loading = true;

    $scope.activeProviders = [];
    
    // Load active providers
    apiServices.PersonService.ActiveProviders(10).then(function (result) {
        $scope.activeProviders = result.data;
    });

    //Load the summary
    function loadSummary() {
        apiServices.SearchService.GetMarketSummary().then(
            function (result) {
                $scope.marketSummary = result.data;

                //Chart
                $scope.bfChartConfig.loading = false;
                $scope.bfChartConfig.series[0].data = [['Clients', $scope.marketSummary.Clients], ['Providers', $scope.marketSummary.Providers]];
            });
    };
    loadSummary();



    // Slider
    $scope.isCollapsed = true;
    $scope.toggle = function () { $scope.isCollapsed = !$scope.isCollapsed }
    $scope.oneAtATime = true;

    $scope.searchType = userData.IsClient ? "Provider" : "Client";
    
    $scope.categories = [];
    var id = 1;

    $.each(categorySkills, function (key, value) {
        var obj = {
            title: key,
            id: 'data' + id,
            skills: value,
            hasSkills: value.length == 0
        }

        $scope.categories.push(obj)

        id++;
    });

    $scope.expandCategory = function (categoryId) {

        var category = $linq($scope.categories).firstOrDefault(null, function (g) { return g.id == categoryId; });

        if (category && category.hasSkills) {
            $location.url("/Engage/Search?type=" + $scope.searchType + "&category=" + window.encodeURIComponent(category.title));
        } else {
            var targetDiv = $('div#' + categoryId + '_data');
            targetDiv.siblings().addClass('hide');
            targetDiv.removeClass('hide');
        }
    };

    //Probably don't needs this
    //$scope.addItem = function () {
    //    var newItemNo = $scope.items.length + 1;
    //    $scope.items.push('Item ' + newItemNo);
    //};

    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };
};