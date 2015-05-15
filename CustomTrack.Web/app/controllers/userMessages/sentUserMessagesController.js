
function SentUserMessagesController($scope, $routeParams, $location, signalRService, apiServices, $modal, $filter, ngTableParams) {

    $scope.messages = [];
    $scope.totalMessages = 0;
    $scope.allSelected = false;

    // sent sort mode
    $scope.sentCurrentSortMode = { id: 1, name: 'Date' };
    $scope.setSentCurrentSortMode = function (id, name) {
        $scope.sentCurrentSortMode.id = id;
        $scope.sentCurrentSortMode.name = name;
        $scope.sentTableParams.reload();
    };

    var searched;
    if ($location.search() && $location.search().id) {
        searched = $location.search().id;
        loadMessage(searched);
    }


    function reloadData() {
        if ($scope.sentTableParams) {
            $scope.sentTableParams.reload();
        } else {
            initSentTable();
        }
    };


    //Initial Load Messages
    function initSentTable() {
        getMessages().then(function () {
            $scope.sentTableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10          // count per page
            }, {
                total: $scope.totalMessages, // length of data
                getData: function ($defer, params) {
                    $defer.resolve((getMessages(params.page() - 1, params.count())));
                }
            });
        });
    };

    function getMessages(page, pageSize) {
        var model = {
            Sort: $scope.sentCurrentSortMode.id,
            Page: page ? page : 0,
            PageSize: pageSize ? pageSize : 10
        };
        return apiServices.UserMessageService.GetSentMessages(model).then(
            function (result) {
                $scope.messages = result.data.ResultList;
                $scope.totalMessages = result.data.TotalCount;
            });
    }

    initSentTable();

    $scope.viewMessage = function (m) {
        $location.path('/Inbox/Sent/View').search({ m: m.Id });
    }

    $scope.deleteSelected = function () {
        var idsToDelete = [];
        $scope.cantDelete = true;
        $scope.messages.forEach(function (m) {
            if (m.IsChecked) {
                m.IsChecked = false;
                m.PendingDelete = true;
                idsToDelete.push(m.Id);
            }
        });
        apiServices.UserMessageService.DeleteMessages(idsToDelete).then(
            function () {
                $scope.cantDelete = false;
                reloadData();
            });
    };

    $scope.toggleSelectAll = function () {
        $scope.allSelected = !$scope.allSelected;
        var isChecked = $scope.allSelected;

        $scope.messages.forEach(function (m) {
            m.IsChecked = isChecked;
        });
    };

    function loadMessage(id) {
        //Get message from server side
        //show that message only
        apiServices.UserMessageService.GetMessage(id).then(
        function (result) {
            $scope.viewMessage(result.data);
        });
    }
};
