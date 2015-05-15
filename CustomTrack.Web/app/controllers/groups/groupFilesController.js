'use strict';

function GroupFilesController($scope, $routeParams, $location, attachmentUpload, apiServices, rsTable) {

    $scope.Attachments = [];
    $scope.uploadingAttachments = [];

    loadAttachments();

    // click to upload new file
    $scope.onFileSelect = function ($files) {
        var uploadingAttachment = {
            FileName: $files[0].name,
            UploadProgress: 0,
            Attachment: null,
            AttachedBy: userData.Name
        };
        $scope.uploadingAttachments.push(uploadingAttachment);

        attachmentUpload.upload($files, function (data) {
            $scope.uploadingAttachments.remove(uploadingAttachment);
            $scope.Attachments.push(data);
        }, function (p) {
            uploadingAttachment.UploadProgress = p;
        }, 'api/Group/AddGroupAttachment/' + $scope.id);
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
            bootbox.alert("You can delete only your own attachments, uploaded in Group");
            return;
        }
        $scope.Attachments.splice(i, 1);
        apiServices.GroupService.RemoveGroupAttachments(attachment.Id, $scope.id, attachment).then(function (result) {
            $scope.Attachments = result.data;
        });
    };

    $scope.removeNewAttachment = function (i) {
        var attachment = $scope.uploadingAttachments[i];
        $scope.uploadingAttachments.splice(i, 1);
        apiServices.GroupService.RemoveGroupAttachments($scope.id, attachment.Attachment);
    };

    function loadAttachments() {
        apiServices.GroupService.GetGroupAttachments($scope.id).then(function (result) {
            $scope.Attachments = result.data;
        });
    }

    $scope.tableParams = rsTable($scope, function () { return $scope.Attachments; }, { Source: 'asc' }, true, true);

};