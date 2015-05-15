'use strict';

function MyWorkroomsListController($scope, $routeParams, $location, signalRService, apiServices, $modal) {
    $scope.workrooms = [];
    $scope.isLoading = true;
    $scope.recentActivities = [];

    $scope.search = {};
    $scope.reverse = true;
    $scope.order = 'CreatedDate';
    $scope.queryModel = {
        WorkroomCompletionStatus: "Open"
    };

    $scope.$watch('queryModel.WorkroomCompletionStatus', function () {
        reloadWorkrooms();
    });

    $scope.setWorkroomCompletionStatusFilter = function(status) {
        $scope.queryModel.WorkroomCompletionStatus = status;
    };

    apiServices.WorkroomService.GetWithMostRecentActivity().then(
            function (result) {
                $scope.recentActivities = result.data;
            });

    $scope.createWorkroom = function () {
        var modalInstance = $modal.open({
            templateUrl: '/Partials/Workroom/Modals/CreateWorkroom.html',
            controller: WorkroomCreateController,
            resolve: {
                allowDispute: function() {
                    return window.userData.IsClient;
                }
            }
        });

        modalInstance.result.then(function (wokroom) {
            $location.url('/' + wokroom.Id + '?s=AddTeamMember');

        }, function () {
            $location.url('#');
        });
    }

    function reloadWorkrooms() {
        $scope.isLoading = true;

        apiServices.WorkroomService.GetMyWorkrooms($scope.queryModel).then(
            function (result) {
                $scope.isLoading = false;
                $scope.workrooms = result.data;
            });
    }

};