'use strict';

function SpendOverviewController($scope, $routeParams, $location, signalRService, apiServices) {
    $scope.isCollapsed = true;
    $scope.isLoading = true;
    $scope.isSpend = $location.path().indexOf("pend") > -1;
    var label1 = $scope.isSpend ? "Spend" : "Fees";
    var label2 = $scope.isSpend ? "Spend Share" : "Revenue Share";


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
    $scope.dataByDay = {};

    $scope.reload = function () {

        $scope.isLoading = true;
        var loadingByDay = true, loadingCharts = true;
        
        apiServices.ReportingService.GetSpendByDay($scope.queryModel).then(function (result) {
            $scope.dataByDay = result.data;
            loadingByDay = false;
            $scope.isLoading = loadingByDay || loadingCharts;
        });

        apiServices.ReportingService.GetSpendOverview($scope.queryModel).then(function (result) {
            $scope.data = result.data;

            $scope.paymentsByBriefConfig.series[0].data.length = 0;
            angular.forEach(result.data.PaymentsByBriefsData, function (value, key) {
                $scope.paymentsByBriefConfig.series[0].data.push(value);
            });
            $scope.paymentsByBriefConfig.loading = false;

            $scope.paymentsByPanelConfig.series[0].data.length = 0;
            angular.forEach(result.data.PaymentsByPanelsData, function (value, key) {
                $scope.paymentsByPanelConfig.series[0].data.push(value);
            });
            $scope.paymentsByPanelConfig.loading = false;

            $scope.paymentsByProviderConfig.series[0].data.length = 0;
            angular.forEach(result.data.PaymentsByProvidersData, function (value, key) {
                $scope.paymentsByProviderConfig.series[0].data.push(value);
            });
            $scope.paymentsByProviderConfig.loading = false;

            loadingCharts = false;
            $scope.isLoading = loadingByDay || loadingCharts;
        });
    };

    $scope.reload();


    //Line graph 
    $scope.spendChartConfig = {
        title: {
            text: null
        },
        yAxis: {
            title: {
                text: label1
            },
            labels: {
                format: "${value}"
            }
        },
        xAxis: {
            categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ]
        },
        plotOptions: {
            series: {}
        },

        series: [],
        loading: true,
    }

    loadSpendChart();

    function loadSpendChart() {

        apiServices.ReportingService.SpendByMonths().then(function (result) {
            applySpendChartConfig(result.data);
            $scope.spendChartConfig.loading = false;
        });
    }

    function applySpendChartConfig(data) {
        $scope.spendChartConfig.series.length = 0;
        data.Details.forEach(function (item) {
            $scope.spendChartConfig.series.push(item);
        });
    }

    $scope.paymentsByPanelConfig = {
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
            name: label2,
            data: []
        }],
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        loading: true,
        size: {
            height: 300
        }
    }

    $scope.paymentsByBriefConfig = {
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
            name: label2,
            data: []
        }],
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        loading: true,
        size: {
            height: 300
        }
    }

    $scope.paymentsByProviderConfig = {
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
            name: label2,
            data: []
        }],
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        loading: true,
        size: {
            height: 300
        }
    }

    $scope.toggle = function () { $scope.isCollapsed = !$scope.isCollapsed }
};