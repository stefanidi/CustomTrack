'use strict';

function AdminLogsController($scope, $routeParams, $location, apiServices, $filter, rsTable, inputService, $modal) {

    $scope.queryModel = {
        Page: 1,
        PageSize: 50
    };

    $scope.tableData = [];
    $scope.totalCount = 0;
    $scope.tableParams = rsTable($scope, function () { return $scope.tableData; }, true, true, true);
    $scope.tableParams.count(200);
    
    loadData();
    $scope.load = loadData;

    function loadData() {
        $scope.isLoading = true;
        apiServices.AdminService.GetLogs($scope.queryModel).then(
            function(result) {

                $scope.tableData = result.data.ResultList;
                if ($scope.totalCount < result.data.TotalCount) {
                    $scope.totalCount = result.data.TotalCount;
                }
                $scope.isLoading = false;

            });
    };

    $scope.viewRaw = function (item) {
        $modal.open({
            templateUrl: '/Partials/Modals/ViewRawModal.html',
            controller: ViewRawController,
            resolve: {
                raw: function () { return $scope.toRaw(item); }
            }
        });
    };

    

    $scope.toRaw = function(item) {
        return angular.toJson(item, 2);
    };

    $scope.viewStackTrace = function (item) {
        $modal.open({
            templateUrl: '/Partials/Modals/ViewRawModal.html',
            controller: ViewRawController,
            resolve: {
                raw: function () { return item.LogEvent.Exception == null || item.LogEvent.Exception.StackTraceString == null ? "" : item.LogEvent.Exception.StackTraceString; }
            }
        });
    };

    $scope.copyToClipboard = function (item) {
        var json = angular.toJson(item, 2);
        window.prompt("Copy to clipboard, Enter", json);
    };
};