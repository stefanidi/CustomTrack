'use strict';

function WorkroomMessagesController($scope, signalRService, apiServices, $modal, attachmentUpload) {

    $scope.totalCount = 0;
    $scope.queryModel = {
        Page: 1,
        PageSize: 10,
        WorkroomId: $scope.id
    };

    signalRService.bbHub.on('workroomMessage', function (wId, mId) {
        if ($scope.id == wId && !$scope.messages.first(function (m) { return m.Id === mId; })) {
            //Our workroom and we do not have this message already.
            loadMessages();
        }
    });

    $scope.AttachmentsContainer = { Attachments: [] };
    $scope.loadMessages = loadMessages;

    loadMessages();

    function loadMessages() {

        apiServices.WorkroomService.GetWorkRoomMessages($scope.queryModel).then(
            function (result) {
                $scope.messages = result.data.ResultList;
                $scope.totalCount = result.data.TotalCount;
            }
        );
    };

    $scope.onFileSelect = function ($files) {
        attachmentUpload.upload($files, function (data) {
            for (var i = 0; i < data.length; i++) {
                $scope.Attachments.push(data[i]);
            }
        });
    };


    $scope.addMessage = function () {

        var newMessage = {};
        newMessage.WorkroomId = $scope.id;
        newMessage.Attachments = $scope.AttachmentsContainer.Attachments;
        $scope.AttachmentsContainer.Attachments = [];
        newMessage.Content = $scope.newMessageContent;
        //newMessage.From = $scope.currentUser;//Set on the server
        //newMessage.CreatedDate = new Date();//Set on the server

        apiServices.WorkroomService.AddMessage(newMessage).then(
                function (result) {
                    $scope.messages.unshift(result.data);
                });

        $scope.newMessageContent = null;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };

    $scope.viewMessage = function (m) {

        $modal.open({
            templateUrl: '/Partials/Modals/WorkroomMessageViewModal.html',
            controller: function ($scope, $modalInstance, m) { $scope.m = m; },
            resolve: { m: function () { return m; } }
        });

        //Mark Message as read.
    }
};