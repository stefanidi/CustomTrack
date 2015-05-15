'use strict';

function WorkroomCompletionController($scope, $route, $modal, apiServices, signalRService) {

    // status for form
    $scope.completionStatus = { client: null, provider: null };
    $scope.workroomCompletionStatuses = ['Open', 'Complete'];
    $scope.currentWorkroomPerson = {};
    $scope.isLoading = false;
    
    $scope.searchProviders = function (value) {
        return value.IsProvider && value.WorkroomRole == 'Lead';
    };

    $scope.searchClients = function (value) {
        return value.IsProvider == false && value.WorkroomRole == 'Lead';
    };

    $scope.setWorkroomCompletionStatus = function () {
        $scope.isLoading = true;
        var completionStatus;

        var modalController;
        var feedbackTemplateUrl;
        if ($scope.currentWorkroomPerson.IsProvider) {
            completionStatus = $scope.completionStatus.provider;

            feedbackTemplateUrl = '/Partials/Workroom/Modals/WorkroomFeedbackProvider.html';
            modalController = WorkroomProviderFeedbackController;
        } else {
            completionStatus = $scope.completionStatus.client;

            feedbackTemplateUrl = '/Partials/Workroom/Modals/WorkroomFeedbackClient.html';
            modalController = WorkroomClientFeedbackController;
        }

        if (completionStatus == 'Complete') {

            if ($scope.workroom.IsUserCreated) {
                apiServices.WorkroomService.SetCompletionStatus(
                    { WorkroomId: $scope.id, Status: completionStatus })
                    .then(function () {
                        $route.reload();
                    });
            } else {
                $modal.open({
                    templateUrl: feedbackTemplateUrl,
                    controller: modalController,
                    resolve: {
                        feedback: function () { return $scope.feedback; },
                        callback: function () { },
                        isCloseout: function () { return true; }
                    },
                    size: 'lg'
                }).result.then(function (result) {
                    // it returned a result
                    apiServices.WorkroomService.SetCompletionStatus(
                    { WorkroomId: $scope.id, Status: completionStatus })
                    .then(function () {
                        $route.reload();
                    });
                }, function () {
                    // it was dismissed
                    if ($scope.currentWorkroomPerson.IsProvider) {
                        $scope.completionStatus.provider = 'Open';
                    } else {
                        $scope.completionStatus.client = 'Open';
                    }
                    $scope.isLoading = false;
                });
            }
            
        }
        else {
            apiServices.WorkroomService.SetCompletionStatus(
               { WorkroomId: $scope.id, Status: completionStatus })
               .then(function () {
                   $route.reload();
               });
        }
    };

    $scope.feedback = null; // Load the saved data from the API into this

    //Load when workroom is loaded
    $scope.loadWorkroom.then(function () {

        $scope.currentWorkroomPerson = $scope.getCurrentWorkroomPerson();
        $scope.completionStatus.provider = $scope.workroom.ProviderCompletionStatus;
        $scope.completionStatus.client = $scope.workroom.ClientCompletionStatus;

        if ($scope.currentWorkroomPerson.IsProvider) {

            apiServices.WorkroomService.GetWorkroomProviderDebrief($scope.id).then(function(result) {
                $scope.feedback = result.data;
            });
        } else {
            apiServices.WorkroomService.GetWorkroomClientDebrief($scope.id).then(function (result) {
                $scope.feedback = result.data;
            });
        }
    });

    $scope.openFeedback = function (callback) {
        if ($scope.currentWorkroomPerson.IsProvider) {
            var feedbackTemplateUrl = '/Partials/Workroom/Modals/WorkroomFeedbackProvider.html';
            var modalController = WorkroomProviderFeedbackController;
        }
        else {
            var feedbackTemplateUrl = '/Partials/Workroom/Modals/WorkroomFeedbackClient.html';
            var modalController = WorkroomClientFeedbackController;
        }
        $modal.open({
            templateUrl: feedbackTemplateUrl,
            controller: modalController,
            resolve: {
                feedback: function() { return $scope.feedback; },
                callback: function () { return callback; },
                isCloseout: function () { return false; }
            },
            size : 'lg'
        });
    }
    
    $scope.openOtherPartyFeedback = function (callback) {
        $scope.isOtherFeedbackLoading = true;
        if ($scope.currentWorkroomPerson.IsProvider) {
            var feedbackTemplateUrl = '/Partials/Workroom/Modals/WorkroomFeedbackClient.html';
            var modalController = WorkroomClientFeedbackController;
            apiServices.WorkroomService.GetWorkroomClientDebrief($scope.id).then(function (result) {
                $scope.isOtherFeedbackLoading = false;
                openFeedback(result.data);
            });
        }
        else {
            var feedbackTemplateUrl = '/Partials/Workroom/Modals/WorkroomFeedbackProvider.html';
            var modalController = WorkroomProviderFeedbackController;
            apiServices.WorkroomService.GetWorkroomProviderDebrief($scope.id).then(function (result) {
                $scope.isOtherFeedbackLoading = false;
                openFeedback(result.data);
            });
        }
        var openFeedback = function (feedback) {
            $modal.open({
                templateUrl: feedbackTemplateUrl,
                controller: modalController,
                resolve: {
                    feedback: function () { return feedback; },
                    id: function () { return $scope.id; },
                    callback: function () { return callback; },
                    isCloseout: function () { return true; }
                },
                size: 'lg'
            });
        };
    }

};

