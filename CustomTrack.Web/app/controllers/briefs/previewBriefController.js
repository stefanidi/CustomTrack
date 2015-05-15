'use strict';

function PreviewBriefController($scope, $routeParams, $location, $modal, signalRService, apiServices) {

    $scope.brief = {};
    $scope.isPosted = false;

    var searched;
    if ($location.search() && $location.search().b) {
        searched = $location.search().b;
        loadDraftBrief(searched);
    }

    $scope.postBrief = function () {
        apiServices.BriefsService.PostBrief($scope.brief.Id).then(
            function (b) {
                $scope.isPosted = true;
            });

        var modalInstance = $modal.open({
            templateUrl: '/Partials/Modals/SubmitBriefConfirmation.html',
            controller: function ($scope, $modalInstance, brief) { $scope.brief = brief; },
            resolve: { brief: function () { return $scope.brief; } }
        });
    }

    $scope.back = function () {
        $location.url('/Engage/CreateBrief?b=' + $scope.brief.Id);
        if (!$scope.$$phase) $scope.$apply();
    };

    $scope.editBrief = function () {
        $location.url('/Engage/EditBrief?b=' + $scope.brief.Id);
        if (!$scope.$$phase) $scope.$apply();
    }

    function loadDraftBrief(id) {
        apiServices.BriefsService.GetClientBrief(id).then(
            function (b) {
                $scope.brief = b.data;
            });
    };


    // Load active providers
    apiServices.PersonService.ActiveProviders(10).then(function (result) {
        $scope.activeProviders = result.data;
    });

}