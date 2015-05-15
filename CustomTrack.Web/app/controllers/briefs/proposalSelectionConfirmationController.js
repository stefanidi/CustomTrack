'use strict';

function ProposalSelectionConfirmationController($scope, $modalInstance, proposal, apiServices, $location) {
    $scope.proposal = proposal;
    $scope.isLoading = false;

    $scope.hasManyPanelsForProvider = false;
    $scope.panels = [];
    $scope.selectedPanel = null;
    $scope.triedConfirm = false;

    $scope.confirm = function () {

        $scope.triedConfirm = true;
        if ($scope.hasManyPanelsForProvider && ($scope.selectedPanel == null)) {
            return;
        }
        $scope.isLoading = true;

        $scope.proposal.ProviderPanel = $scope.selectedPanel == null ? ($scope.panels.length == 0 ? null : $scope.panels[0]) : $scope.selectedPanel;
        apiServices.BriefsService.AcceptProposal($scope.proposal).then(
            function (result) {
                var w = result.data;
                //Show Workroom confirmation
                //popupService.info('Workroom created ' + w.Id);
                $location.url(w.Url);
                $scope.isLoading = false;
                if (!$scope.$$phase) $scope.$apply();
                $modalInstance.close();
            });
    }

    if ($scope.proposal.Brief.PostingType != 'Panel') {

        $scope.isLoading = true;
        apiServices.PanelService.GetProviderInPanelsModel($scope.proposal.Person.PersonId).then(function (result) {
            $scope.hasManyPanelsForProvider = result.data.Panels.length > 1;
            $scope.panels = result.data.Panels;
            $scope.isLoading = false;
        });

    }
}