'use strict';

function ViewMessageController($scope, $routeParams, $window, $location, signalRService, apiServices, popupService) {

    $scope.message = {};
    
    // detect message id and load message
    var searched;
    if ($location.search() && $location.search().m) {
        searched = $location.search().m;
        loadMessage(searched);
    }

    $scope.deleteMessage = function () {
        if ($scope.message.IsTrash) {
            apiServices.UserMessageService.DeleteMessagesFromTrash([$scope.message.Id]).then(
                function () {
                    $window.history.back();
                });
        } else {
            apiServices.UserMessageService.DeleteMessages([$scope.message.Id]).then(
                function () {
                    $window.history.back();
                });
        }

    };

    $scope.viewMessage = function (m) {
        if (m.IsTrash) {
            $location.path('/Inbox/Trash/View').search({ m: m.Id });
        } else if (m.IsSent) {
            $location.path('/Inbox/Sent/View').search({ m: m.Id });
        } else {
            $location.path('/Inbox/View').search({ m: m.Id });
        }
    };

    $scope.replyToMessage = function () {
        var replyTo = $scope.message.IsInbox ? $scope.message.From : $scope.message.To;
        var dialog = popupService.quickMessage(replyTo.Id, replyTo.Name, $scope.message.Subject, $scope.message.Id);
        dialog.result['finally'](function () { loadMessage(searched); });
    }

    function loadMessage(id) {
        apiServices.UserMessageService.GetMessage(id).then(
            function (m) {
                $scope.message = m.data;
            });
    };
}
