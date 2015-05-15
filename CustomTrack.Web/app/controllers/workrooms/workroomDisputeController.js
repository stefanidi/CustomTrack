'use strict';

function WorkroomDisputeController($scope, $location, signalRService, apiServices, attachmentUpload, confirmService) {

    $scope.businessUnits = ['HR', 'IT', 'Legal'];
    $scope.mattertypes = ['Commercial' , 'Bankruptcy' , 'Employment' , 'Environmental' , 'Investigation' , 'IP' ];

    $scope.dispute = {
        Attachments:[]
    };

    $scope.uploadingAttachments = [];

    //region datepickers stuff
    $scope.datepickers = {
        suitfiled: false,
    }

    $scope.showWeeks = true;
    $scope.toggleWeeks = function () {
        $scope.showWeeks = false;
    };

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.open = function ($event, which) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.datepickers[which] = true;
    };

    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1,
        'show-weeks': false,
    };

    $scope.formats = ['dd/MM/yyyy'];
    $scope.format = $scope.formats[0];
    //end region // datepickers stuff

    $scope.isSaving = false;

    $scope.remove = function () {
        confirmService.open("Remove Dispute Status", "Are you sure you want to remove disputes from this workroom and delete all dispute data?", function () {
            apiServices.WorkroomService.RemoveWorkroomDispute($scope.id).then(function(result) {
                if (result.data) {
                    //Reload workroom
                    $scope.workroom.IsDispute = false;
                    $scope.go('Overview');
                }
            });
        });
    };

    $scope.save = function () {

        $scope.isSaving = true;

        apiServices.WorkroomService.SaveWorkroomDispute($scope.dispute).then(function (result) {
            $scope.dispute = result.data;

            $scope.isSaving = false;
        });
    }

    $scope.onFileSelect = function (files) {

        for (var i = 0; i < files.length; i++) {
            
            var uploadingAttachment = {
                FileName: files[i].name,
                UploadProgress: 0,
                File:files[i]
            };

            $scope.uploadingAttachments.push(uploadingAttachment);
        }

        attachmentUpload.upload(files, function (data,file) {
            for (var i = 0; i < data.length; i++) {
                $scope.dispute.Attachments.push(data[i]);
            }

            var attachment = $linq($scope.uploadingAttachments).firstOrDefault(null, function (a) { return a.File === file; });
            if (attachment) {
                $scope.uploadingAttachments.remove(attachment);
            }

        }, function (p, file) {
            var attachment = $linq($scope.uploadingAttachments).firstOrDefault(null, function(a) { return a.File === file; });
            if (attachment) {
                attachment.UploadProgress = p;
            }
        });
    };

    $scope.canRemoveAttachment = function (attachment) {
        if (attachment.CanDelete != true) {
            return false;
        }
        return new Date(attachment.CanDeleteBefore) > new Date();
    };

    $scope.removeAttachment = function (i) {
        $scope.dispute.Attachments.splice(i, 1);
    };

    apiServices.WorkroomService.GetWorkroomDispute($scope.id).then(function (result) {
        $scope.dispute = result.data;
    });
};