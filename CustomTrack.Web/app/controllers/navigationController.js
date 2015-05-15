'use strict';

function NavigationController($rootScope, $scope, $route, $routeParams, $location, $q, signalRService, apiServices, $window) {

    $rootScope.nonTransitionPages = ['/Panel/AddPanel'];

    $rootScope.currentPage = $location.path();

    $rootScope.isExactActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path == r; });
        }
        return path == route;
    }

    this.$route = $route;
    this.$location = $location;
    this.$routeParams = $routeParams;

    //isActive - Returns true when the path is active
    $scope.isActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path.indexOf(r) == 0; });
        }
        return path.indexOf(route) == 0;
    }

    //Setup variables
    $rootScope.currentUser = {};
    $scope.workrooms = [];
    $rootScope.messageSummary = {
        Last: [],
        TotalUnreadCount: 0
    };
    $rootScope.notificationSummary = {
        Last: [],
        TotalUnreadCount: 0
    };

    $scope.onNotificationClick = function (notification, isOpen) {
        // remove notification from list
        $rootScope.notificationSummary.Last = $rootScope.notificationSummary.Last.filter(function (item) {
            return item.Id !== notification.Id;
        });

        $rootScope.notificationSummary.TotalUnreadCount = $rootScope.notificationSummary.TotalUnreadCount - 1;

        // mark ar read
        apiServices.NotificationService.MarkNotificationRead(notification.Id);

        // do not reload notifications after mark, because them will be reloaded by signalR call

        // open link if need
        if (isOpen && notification.Link) {
            $location.url(notification.Link);
        }
    };

    //Get the current logged in user data from the session store
    $rootScope.currentUser = $window.userData;

    getUnreadMessages();
    getNotificationSummary();

    //#### Signal R Section ####
    signalRService.bbHub.on('messageRead', function (id) {
        getUnreadMessages();
    });

    signalRService.bbHub.on('removedUserMessage', getUnreadMessages);

    signalRService.bbHub.on('notificationsChanged', function () {
        getNotificationSummary();
    });

    signalRService.onMessageAdded(function (message) {
        $rootScope.messageSummary.Last.unshift(message);
        $rootScope.messageSummary.TotalUnreadCount = $rootScope.messageSummary.TotalUnreadCount + 1;
        $rootScope.$apply();
    });

    function getUnreadMessages() {
        apiServices.UserMessageService.GetMessagesSummary().then(
            function (result) {
                $rootScope.messageSummary = result.data;
            });
    }

    function getNotificationSummary() {
        apiServices.NotificationService.GetNotificationsSummary().then(
            function (result) {
                $rootScope.notificationSummary = result.data;
            });
    }

}