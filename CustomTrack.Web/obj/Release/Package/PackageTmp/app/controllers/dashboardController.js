'use strict';

function DashboardController($scope, apiServices) {
    $scope.bfChartConfig = {
        options: {
            chart: {
                renderTo: 'chart-container',
                margin: 0,
                type: 'pie',
                marginTop: -30
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
            text: ""
        },
        credits: {
            enabled: false
        },
        loading: false,
        size: {
            height: 280
        }
    }
    $scope.bfChartConfig.loading = true;

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
}

DashboardController.$inject = ['$scope', 'apiServices'];