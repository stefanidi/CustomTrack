'use strict';

function InboxWidgetController($scope, $location, signalRService, apiServices) {
    
    // array of tag filter in format: { 'name', 'label-class' }
    $scope.tagClasses = {
        Panels: 'warning',
        Briefs: 'danger',
        Workrooms: 'info',
        BriefBox: 'default'
    };
    $scope.tagFilters = ['Briefs', 'Panels', 'Workrooms', 'BriefBox'];
    
    $scope.acceptTagFilter = function (tag) {
        if (tag == $scope.$root.selectedFilterTag) {
            $scope.$root.selectedFilterTag = null;
        } else {
            $scope.$root.selectedFilterTag = tag;
        }
    }

    $scope.getTagClass = function(tag) {
        var result = 'btn-'+ $scope.tagClasses[tag];
        if (tag == $scope.$parent.selectedFilterTag) {
            result = result + ' active ';
        }
        return result;
    };

    $scope.isActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path.indexOf(r) == 0; });
        }
        return path.indexOf(route) == 0;
    }

    $scope.statistic = {};

    getStatistic();

    // subscribe on signalr update message and notification events
    signalRService.bbHub.on('messageRead', function (id) {
        getStatistic();
    });

    signalRService.bbHub.on('notificationsChanged', function () {
        getStatistic();
    });

    signalRService.onMessageAdded(function () {
        getStatistic();
    });

    function getStatistic() {
        apiServices.UserMessageService.GetIndoxPageWidgetStatistic().then(
            function (result) {
                $scope.statistic = result.data;
            });
    };
};