'use strict';

function NotificationController($scope, $routeParams, $route, $location, signalRService, apiServices, $modal, $filter) {
    // filter notifications or messages by tag
    $scope.$root.selectedFilterTag = null;
    $scope.searchText = null;
    $scope.notificationGroups = null;
    $scope.hasMore = false;
    $scope.isLoading = false;
    var defaultPageCount = 20;
    var nextTimestampFrom = null;

    //Initial Load 
    getNotifications(defaultPageCount);

    // look for notifications via signalR
    signalRService.bbHub.on('notificationsChanged', function (guid) {
        if (guid && signalRService.guids.exists(guid)) {
            return;
        }
        $route.reload();
    });

    $scope.notificationsFilter = function (notification) {
        if ($scope.$root.selectedFilterTag && notification.Tag != $scope.$root.selectedFilterTag) {
            return false;
        }
        return true;
    };

    $scope.dismissAll = function () {
        apiServices.NotificationService.MarkAllNotificationRead();
        $scope.notificationGroups.forEach(function (n) {
            n.Value.forEach(function (n1) {
                n1.IsRead = true;
            });
        });
    };

    $scope.onClickNotification = function (notification) {

        if (notification.IsRead == false) {
            notification.IsRead = true;
            apiServices.NotificationService.MarkNotificationRead(notification.Id);
        }

        if (notification.Link) {
            $location.url(notification.Link);
        }
    }

    $scope.loadMore = function () {
        getNotifications();
    };

    function getNotifications(pageCount) {
        $scope.isLoading = true;

        var model = {
            TimestampFrom: nextTimestampFrom,
            PageCount: pageCount == null ? defaultPageCount + 1 : pageCount // +1 because one first loaded notitification can be equal with last already loaded
        };

        apiServices.NotificationService.GetNotifications(model).then(
            function (result) {
                $scope.hasMore = result.data.HasMore;
                nextTimestampFrom = result.data.NextTimestampFrom;


                if ($scope.notificationGroups == null) {
                    $scope.notificationGroups = result.data.Result;
                } else {
                    if (result.data.Result.length == 0) {
                        $scope.isLoading = false;
                        return;
                    }
                    // merge results
                    // add in last group new rows from first group of result
                    var lastGroupPrev = $scope.notificationGroups[$scope.notificationGroups.length - 1].Value;
                    var firstGroupNew = result.data.Result[0].Value;
                    var mergeAfter = false;
                    for (var i1 = 0; i1 < firstGroupNew.length; i1++) {
                        if (mergeAfter == false) {
                            var currNotificationId = firstGroupNew[i1].Id;
                            var isExist = $.grep(lastGroupPrev, function (e) { return e.Id == currNotificationId; }).length > 0;
                            if (isExist == false) {
                                mergeAfter = true;
                            }
                        }

                        if (mergeAfter) {
                            lastGroupPrev.push(firstGroupNew[i1]);
                        }
                    }

                    // add over groups
                    for (var j1 = 1; j1 < result.data.Result.length; j1++) {
                        $scope.notificationGroups.push(result.data.Result[j1]);
                    }
                }
                $scope.isLoading = false;
            });
    }
};