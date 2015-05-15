'use strict';

function WorkroomFilesController($scope, $routeParams, $location, attachmentUpload, apiServices, rsTable, signalRService) {

    $scope.Attachments = [];
    $scope.uploadingAttachments = [];
    $scope.isLoadingAttachments = false;

    loadAttachments();

    signalRService.bbHub.on('changedWorkroomAttachments', function (workroomId) {
        if ($scope.workroom.Id == workroomId) {
            loadAttachments();
        }
    });

    // click to upload new file
    $scope.onFileSelect = function ($files) {
        var uploadingAttachment = {
            FileName: $files[0].name,
            UploadProgress: 0,
            Attachment: null,
            AttachedBy: userData.Name
        };
        $scope.uploadingAttachments.unshift(uploadingAttachment);
        attachmentUpload.upload($files, function (data) {
            $scope.uploadingAttachments.remove(uploadingAttachment);
            $scope.Attachments.unshift(data);
            loadAttachments();
        }, function (p) {
            uploadingAttachment.UploadProgress = p;
        }, 'api/Workroom/AddWorkroomAttachment/' + $scope.id);
    };


    $scope.canRemoveAttachment = function (attachment) {
        if (attachment.CanDelete != true) {
            return false;
        }
        return new Date(attachment.CanDeleteBefore) > new Date();
    };

    $scope.removeAttachment = function (i) {
        var attachment = $scope.Attachments[i];
        if (attachment.CanDelete != true) {
            bootbox.alert("You can delete only your own attachments, uploaded in Workroom");
            return;
        }
        $scope.Attachments.splice(i, 1);
        apiServices.WorkroomService.RemoveWorkroomAttachments(attachment.Id, $scope.id, attachment).then(function (result) {
            $scope.Attachments = result.data;
        });
    };

    $scope.removeNewAttachment = function (i) {
        var attachment = $scope.uploadingAttachments[i];
        $scope.uploadingAttachments.splice(i, 1);
        apiServices.WorkroomService.RemoveWorkroomAttachments($scope.id, attachment.Attachment);
    };

    function loadAttachments() {
        if ($scope.isLoadingAttachments) {
            return;
        }
        $scope.isLoadingAttachments = true;
        apiServices.WorkroomService.GetWorkroomAttachments($scope.id).then(function (result) {
            $scope.Attachments = result.data;
            $scope.isLoadingAttachments = false;
        });
    }

    $scope.tableParams = rsTable($scope, function () { return $scope.Attachments; }, { Source: 'asc' }, true, true);

};