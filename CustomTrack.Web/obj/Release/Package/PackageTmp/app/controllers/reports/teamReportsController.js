
function TeamReportsController($scope, $routeParams, $location, signalRService, apiServices) {
    $scope.isCollapsed = true;
    $scope.workroomOvertimeMetric = "count";
    $scope.showRefreshButton = false;

    //DatePicker Dropdown stuff - TODO: Place in directive
    $scope.today = (new XDate()).clearTime().toISOString();

    $scope.datepickers = {
        start: false,
        briefStartDate: false,
        briefEndDate: false
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


    //Line graph 
    $scope.workroomOverTimeChartConfig = {
        title: {
            text: null
        },
        xAxis: {
            type: 'datetime',
        },
        yAxis: {
            min: 0,
            title: {
                text: null
            },
        },
        size: {
            height: 350,
            width: 822
        },
        loading: true,
    }

    $scope.workroomChartConfig = {
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
            type: 'category'
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        series: [
          {
              data: [],
              id: 'series-7',
              name: 'Number',
              type: 'column'
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

    $scope.valueChartConfig = {
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
            type: 'category'
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        series: [
          {
              data: [],
              id: 'series-7',
              name: 'Value',
              type: 'column'
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

    load();

    function load() {
        apiServices.ReportingService.GetTeamReport().then(function (result) {
            $scope.teamReport = result.data;

            //workroom Details
            angular.forEach($scope.teamReport, function(value, key){
                $scope.teamReport[key]["popoutWorkrooms"] = false;
            });

            //Chart
            angular.forEach(result.data, function (value, key) {
                $scope.workroomChartConfig.series[0].data.push([value.PersonName, value.Count]);
                $scope.valueChartConfig.series[0].data.push([value.PersonName, value.Value]);
            });
            $scope.workroomChartConfig.loading = false;
            $scope.valueChartConfig.loading = false;
        });

        loadWorkroomOvertimeChart();
    };

    function loadWorkroomOvertimeChart() {
        $scope.workroomOverTimeChartConfig.loading = true;

        apiServices.ReportingService.GetTeamReportByWorkroomsOverTime($scope.workroomOvertimeFrom, $scope.workroomOvertimeTo).then(function (result) {
            $scope.teamReportWorkroomOverTime = result.data;
            applyWorkroomOvertimeChart(result.data);
        });
    }

    function applyWorkroomOvertimeChart(data) {

        if ($scope.workroomOvertimeMetric == "count") {
            $scope.workroomOverTimeChartConfig.series = data.SeriesByCount;
            var valueSuffix = ' Workrooms';
        }
        else {
            $scope.workroomOverTimeChartConfig.series = data.SeriesByValue;
            var valueSuffix = '';
            var valuePrefix = '$';
        }

        $scope.workroomOverTimeChartConfig.loading = false;

        $scope.workroomOverTimeChartConfig.options = {
            colors: ['#00ADBB', '#F38630', '#0007E5', '#555555', '#64E572', '#F28284', '#EA3A00', '#1C5379', '#E2004B', '#000000'],
            chart: {
                type: 'spline'
            },
            plotOptions: {
                spline: {
                    lineWidth: 3,
                    states: {
                        hover: {
                            lineWidth: 4
                        }
                    },
                    marker: {
                        enabled: false
                    },
                },
                series: {
                    pointStart: Date.parse(data.Start),
                    pointIntervalUnit: 'month'
                }
            },
            tooltip: {
                valuePrefix: valuePrefix,
                valueSuffix: valueSuffix
            },
        };

        $scope.showRefreshButton = false;
        $scope.noWorkroomOverTimeData = ($scope.workroomOverTimeChartConfig.series.length == 0);
    }

    $scope.refreshWorkroomOvertime = function () {
        loadWorkroomOvertimeChart();
    }

    $scope.$watch("workroomOvertimeMetric", function (oldVal, newVal) {
        if (oldVal != newVal) {
            loadWorkroomOvertimeChart($scope.teamReportWorkroomOverTime);
        }
    });

    $scope.$watch("workroomOvertimeFrom", function (oldVal, newVal) {
        if (oldVal != newVal) {
            $scope.showRefreshButton = true;
        }
    });

    $scope.$watch("workroomOvertimeTo", function (oldVal, newVal) {
        if (oldVal != newVal) {
            $scope.showRefreshButton = true;
        }
    });
};
