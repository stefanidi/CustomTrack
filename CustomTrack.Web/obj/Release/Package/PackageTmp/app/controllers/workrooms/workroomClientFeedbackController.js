'use strict';

function WorkroomClientFeedbackController($scope, $modalInstance, apiServices, feedback, callback, isCloseout) {
    $scope.feedback = feedback;
    $scope.feedbackscore = 0;
    $scope.isCloseout = isCloseout;
    $scope.feedbackComplete = false;
    $scope.updateFeedbackTotal = updateFeedbackTotal;
    updateFeedbackTotal();

    function updateFeedbackTotal () {

        $scope.feedbackscore = ($scope.feedback.FinancialWithinBudgetRating * 10 * 0.3 * 0.7) +
                               ($scope.feedback.FinancialDiscountRating * 10 * 0.3 * 0.2) +
                               ($scope.feedback.FinancialConsistencyRating * 10 * 0.3 * 0.1) +
                               ($scope.feedback.ServiceDeliverablesRating * 10 * 0.6 * 0.6) +
                               ($scope.feedback.ServiceDeliveryOnTimeRating * 10 * 0.6 * 0.3) +
                               ($scope.feedback.ServiceQualityResourcesRating * 10 * 0.6 * 0.1) +
                               ($scope.feedback.OperationalManagementRating * 10 * 0.1 * 0.5) +
                               ($scope.feedback.OperationalCommunicationRating * 10 * 0.1 * 0.4) +
                               ($scope.feedback.OperationalContinuousImprovementRating * 10 * 0.1 * 0.1);

        $scope.feedbackComplete = validScore($scope.feedback.FinancialWithinBudgetRating) &&
                               validScore($scope.feedback.FinancialDiscountRating) &&
                               validScore($scope.feedback.FinancialConsistencyRating) &&
                               validScore($scope.feedback.ServiceDeliverablesRating) &&
                               validScore($scope.feedback.ServiceDeliveryOnTimeRating) &&
                               validScore($scope.feedback.ServiceQualityResourcesRating) &&
                               validScore($scope.feedback.OperationalManagementRating) &&
                               validScore($scope.feedback.OperationalCommunicationRating) &&
                               validScore($scope.feedback.OperationalContinuousImprovementRating);
    }


    function validScore(number) {
        if (isNaN(number)) return false;
        if (number < 1) return false;
        return true;
    }

    $scope.isSaving = false;

    $scope.save = function() {

        $scope.isSaving = true;

        apiServices.WorkroomService.SaveWorkroomClientDebrief($scope.feedback).then(function(result) {
            $scope.isSaving = false;

            $modalInstance.close();

            if (callback) {
                callback();
            }
        });

    };

    $scope.close = function() {
        $modalInstance.close();
    };

    $scope.updateFeedbackTotal();
};