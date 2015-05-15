'use strict';

function WorkroomPitchesController($scope, apiServices) {

    $scope.RejectedProposals = [];
    $scope.SelectedProposals = [];
    loadWorkroomPitches();

    function loadWorkroomPitches() {
        apiServices.WorkroomService.GetWorkroomProposals($scope.id).then(function (result) {
            $scope.SelectedProposals = result.data.Selected;
            $scope.RejectedProposals = result.data.Rejected;
        });
    }
};
