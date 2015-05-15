'use strict';

function InvoiceReportController($scope, apiServices, ngTableParams, $filter) {
    $scope.isLoading = false;
    $scope.totalCount = 0;
    $scope.isClientSideSearch = true;
    $scope.isNextLoadMore = false;

    //DatePicker Dropdown stuff - TODO: Place in directive
    $scope.today = (new XDate()).clearTime().toISOString();
    $scope.datepickers = {
        ends_at: false,
        starts_at: false
    }
    $scope.open = function ($event, which) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.datepickers[which] = true;
    };
    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1,
        'show-weeks': false,
    };

    // lookups:
    $scope.invoiceStates = [
       { Key: 'Paid', Text: 'Paid' },
       { Key: 'PendingPayment', Text: 'Payment Pending' },
       { Key: 'Invoice', Text: 'Invoiced' },
       { Key: 'Dispute', Text: 'Disputed' }
    ];

    $scope.completionStatuses = [
       { Key: 'Open', Text: 'Open' },
       { Key: 'Complete', Text: 'Complete' }
    ];
    // end lookups

    $scope.queryModel = {
        StartDate: null,
        EndDate: null,
        CompletionStatus: null,
        InvoiceState: null,
        Search: null,
        Page: 1,
        PageSize: 10,
        OrderBy: "CreateDate",
        OrderReverse: true
    };

    $scope.tableParams = new ngTableParams({
        noPager: true,
        sorting: {
            CreateDate: 'desc'     // initial sorting
        }
    }, {
        counts: [] ,
        total: 0, // length of data
        getData: function ($defer, params) {
            $scope.isLoading = true;

            // when sorting is changed need to load more
            if (params.orderBy() != null && params.orderBy().length > 0) {
                var sortByField = params.orderBy()[0].substr(1);
                var sortIsDesc = params.orderBy()[0][0] == "-";
                if (sortByField != $scope.queryModel.OrderBy || sortIsDesc != $scope.queryModel.OrderReverse) {
                    $scope.queryModel.OrderBy = sortByField;
                    $scope.queryModel.OrderReverse = sortIsDesc;
                    $scope.isNextLoadMore = true;
                }
            }

            if ($scope.isNextLoadMore || $scope.data == null) {
                apiServices.ReportingService.GetInvoiceReport($scope.queryModel).then(
                    function (result) {
                        $scope.data = result.data.ResultList;
                        $scope.totalCount = result.data.TotalCount;
                        $scope.isLoading = false;
                        $defer.resolve($scope.data);
                        $scope.isNextLoadMore = false;
                    });
            } else {
                var orderedData = params.sorting() ?
                                    $filter('orderBy')($filter('filter')($scope.data, $scope.queryModel.Search), params.orderBy()) :
                                    $scope.data;
                
                $defer.resolve(orderedData);
                $scope.isLoading = false;
            }
        }
    });

    $scope.setServerSideSearch = function() {
        $scope.isClientSideSearch = false;
        $scope.reload();
    };

    $scope.searchChanged = function() {
        if ($scope.isClientSideSearch) {
            $scope.tableParams.reload();
        } else {
            if (!($scope.queryModel.Search)) {
                $scope.isClientSideSearch = true;
            }
            $scope.reload();
        }
    }

    $scope.reload = function () {
        $scope.isNextLoadMore = true;
        $scope.tableParams.reload();
    }
    
    $scope.loadData = function () {
        $scope.isLoading = true;
        apiServices.ReportingService.GetInvoiceReport($scope.queryModel).then(
            function (result) {
                $scope.data = result.data.ResultList;
                $scope.totalCount = result.data.TotalCount;
                $scope.isLoading = false;
            }
        );
    };
    //<select ng-model="queryModel.CompletionStatus" ng-options="item.Key as item.Text for item in invoiceStates" ng-change="loadData()"></select>
    $scope.isCollapsed = true;

    $scope.toggle = function () { $scope.isCollapsed = !$scope.isCollapsed; }
}