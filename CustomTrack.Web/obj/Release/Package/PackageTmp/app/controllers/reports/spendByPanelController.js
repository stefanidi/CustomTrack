'use strict';

function SpendByPanelController($scope, $routeParams, $location, signalRService, apiServices) {
    $scope.isCollapsed = true;
    $scope.isLoading = true;


    $scope.queryModel = {
        FromDate: null,
        ToDate: null
    };

    //DatePicker Dropdown stuff - TODO: Place in directive
    $scope.today = (new XDate()).clearTime().toISOString();

    $scope.datepickers = {
        start: false,
        startDate: false,
        endDate: false
    }
    $scope.openDate = function ($event, which) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.datepickers[which] = true;
    };
    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1,
        'show-weeks': false,
        minMode: 'month'
    };
    $scope.format = 'MM/yyyy';
    //End of Datepicker stuff

    $scope.data = {};

    $scope.reload = function () {

        $scope.isLoading = true;
        var loadingCharts = true;

        apiServices.ReportingService.GetSpendByPanels($scope.queryModel).then(function (result) {
            $scope.data = result.data;

            $scope.spendChartConfig.series[0].data.length = 0;
            $scope.spendChartConfig.xAxis.categories.length = 0;

            angular.forEach(result.data.PanelChartValues, function (value) {
                $scope.spendChartConfig.series[0].data.push(value);
            });

            angular.forEach(result.data.PanelChartKeys, function (value) {
                $scope.spendChartConfig.xAxis.categories.push(value);
            });

            $scope.spendChartConfig.loading = false;

            loadingCharts = false;
            $scope.isLoading = loadingCharts;
        });
    };

    $scope.reload();

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
            min: 0,
            labels: {
                format: "${value}"
            }
        },
        xAxis: {
            categories: []
        },
        series: [
            {
                name: 'Some data',
                data: [],
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
        loading: true,
        size: {
            height: 250
        }
    }

    $scope.toggle = function () { $scope.isCollapsed = !$scope.isCollapsed }
};