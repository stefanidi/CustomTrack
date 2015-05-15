function PitchPreviewController($scope, $routeParams, $location, signalRService, apiServices, stateService, popupService, $filter, rsTable) {

    //set defaults
    $scope.alternateMilestones = false;
    $scope.isLoading = false;
    $scope.proposal = { Team: [], Attachments: [], AlternativePriceAttachment: {}, IsAlternativePeriod: false, IsAlternativeBilling: false };

    $scope.tableParams = rsTable($scope, function () { return $scope.proposal.Team; }, {  }, true, true, true);

    var entityId = $location.search().id;

    loadProposal(entityId);

    $scope.draft = function () {
        $location.url('/Pitch/Proposal?id=' + $scope.proposal.Id);
        if (!$scope.$$phase) $scope.$apply();
    };

    $scope.pitch = function () {
        $scope.isLoading = true;
        apiServices.BriefsService.PitchProposal($scope.proposal).then(
            function (result) {
                popupService.info('Pitch posted successfully.'); // TODO: Add Email button.
                $location.url('/Pitch/Provider/InvitedBriefs');
                if (!$scope.$$phase) $scope.$apply();
                $scope.isLoading = false;
            });
    }

    function loadProposal(proposalId) {
        $scope.isLoading = true;
        apiServices.BriefsService.GetMyProposal(proposalId).then(function (result) {
            $scope.isLoading = false;
            $scope.brief = result.data.Brief;
            $scope.proposal = result.data;
            loadClientBriefStats();
            if ($scope.proposal.AlternativeMilestones && $scope.proposal.AlternativeMilestones.length > 0) {
                $scope.alternateMilestones = true;
            } else {
                $scope.alternateMilestones = false;
            }
        });
    }

    function loadClientBriefStats() {
        apiServices.BriefsService.GetClientBriefStats($scope.brief.PostedBy.Id).then(function (result) {
            $scope.clientBriefStats = result.data;
        });
    }
}