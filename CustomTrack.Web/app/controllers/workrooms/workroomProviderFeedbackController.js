'use strict';

function WorkroomProviderFeedbackController($scope, $modalInstance, apiServices, feedback, callback, isCloseout) {
    $scope.feedback = feedback;
    $scope.isCloseout = isCloseout;

    $scope.isSaving = false;

    $scope.feedbackComplete = false;
    
    $scope.updateCompletion = function () {
        $scope.feedbackComplete =
            validScore(feedback.BriefClearRating) &&
            validScore(feedback.TimeframeRating) &&
            validScore(feedback.PricingRating) &&
            validScore(feedback.PaymentRating) &&
            validScore(feedback.CommunicationRating) &&
            validScore(feedback.TeamRating) &&
            validScore(feedback.DecisionRating);
    }
    $scope.updateCompletion();

    function validScore(number) {
        if (isNaN(number)) return false;
        if (number < 1) return false;
        return true;
    }

    $scope.save = function () {

        $scope.isSaving = true;

        apiServices.WorkroomService.SaveWorkroomProviderDebrief($scope.feedback).then(function (result) {
            $scope.isSaving = false;

            $modalInstance.close();

            if (callback) {
                callback();
            }
        });

    };

    $scope.close = function () {
        $modalInstance.close();
    };
};