
function InboxController($scope, $routeParams, $location, signalRService, apiServices, $modal, $filter, ngTableParams, popupService) {

    $scope.messages = [];
    $scope.totalMessages = 0;
    $scope.allSelected = false;

    // inbox sort mode
    $scope.inboxCurrentSortMode = { id: 1, name: 'Date' };
    $scope.setInboxCurrentSortMode = function (id, name) {
        $scope.inboxCurrentSortMode.id = id;
        $scope.inboxCurrentSortMode.name = name;
        $scope.inboxTableParams.reload();
    };

    var searched;
    if ($location.search() && $location.search().id) {
        searched = $location.search().id;
        loadMessage(searched);
    }

    //#### Signal R Section ####
    signalRService.onMessageAdded(function (message) {
        $scope.inboxTableParams.settings().$scope = $scope;
        $scope.inboxTableParams.reload(); 
    });

    signalRService.bbHub.on('messageRead', function (id) {
        $scope.messages.forEach(function(m) {
            if (m.Id == id) {
                m.IsRead = true;
            }
        });
    });
    
    function reloadData() {
        if ($scope.inboxTableParams) {
            $scope.inboxTableParams.reload();
        } else {
            initInboxTable();
        }
    };

    
    //Initial Load Messages
    function initInboxTable() {
        getMessages().then(function() {
            $scope.inboxTableParams = new ngTableParams({
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
            Sort: $scope.inboxCurrentSortMode.id,
            Page: page ? page : 0,
            PageSize: pageSize ? pageSize : 10
        };
        return apiServices.UserMessageService.GetInboxMessages(model).then(
            function (result) {
                $scope.messages = result.data.ResultList;
                $scope.totalMessages = result.data.TotalCount;
            });
    }
    
    initInboxTable();

    $scope.viewMessage = function (m) {
        $location.path('/Inbox/View').search({ m: m.Id });
        m.IsRead = true;
        apiServices.UserMessageService.MarkAsRead(m.Id);
    }

    $scope.deleteSelected = function () {
        var idsToDelete = [];
        $scope.cantDelete = true;
        $scope.messages.forEach(function(m) {
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


    $scope.markAsReadSelected = function () {
        var idsToMarkRead = [];
        $scope.messages.forEach(function (m) {
            if (m.IsChecked) {
                m.IsRead = true;
                idsToMarkRead.push(m.Id);
            }
        });
        apiServices.UserMessageService.MarkMessagesAsRead(idsToMarkRead).then(
            function () {
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

    $scope.newMessage = function() {
        var dialog = popupService.newMessage();
        dialog.result['finally'](function () { reloadData(); });
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
