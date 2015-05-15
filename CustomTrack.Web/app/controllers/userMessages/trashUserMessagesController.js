
function TrashUserMessagesController($scope, $routeParams, $location, signalRService, apiServices, $modal, $filter, ngTableParams) {

    $scope.messages = [];
    $scope.totalMessages = 0;
    $scope.allSelected = false;

    // trash sort mode
    $scope.trashCurrentSortMode = { id: 1, name: 'Date' };
    $scope.setTrashCurrentSortMode = function (id, name) {
        $scope.trashCurrentSortMode.id = id;
        $scope.trashCurrentSortMode.name = name;
        $scope.trashTableParams.reload();
    };

    var searched;
    if ($location.search() && $location.search().id) {
        searched = $location.search().id;
        loadMessage(searched);
    }


    function reloadData() {
        if ($scope.trashTableParams) {
            $scope.trashTableParams.reload();
        } else {
            initTrashTable();
        }
    };


    //Initial Load Messages
    function initTrashTable() {
        getMessages().then(function () {
            $scope.trashTableParams = new ngTableParams({
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
            Sort: $scope.trashCurrentSortMode.id,
            Page: page ? page : 0,
            PageSize: pageSize ? pageSize : 10
        };
        return apiServices.UserMessageService.GetTrashMessages(model).then(
            function (result) {
                $scope.messages = result.data.ResultList;
                $scope.totalMessages = result.data.TotalCount;
            });
    }

    initTrashTable();

    $scope.viewMessage = function (m) {
        $location.path('/Inbox/Trash/View').search({ m: m.Id });
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
        apiServices.UserMessageService.DeleteMessagesFromTrash(idsToDelete).then(
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
