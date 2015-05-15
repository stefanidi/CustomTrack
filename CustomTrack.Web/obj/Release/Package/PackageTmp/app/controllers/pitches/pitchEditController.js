function PitchEditController($scope, $routeParams, $location, signalRService, apiServices, stateService, popupService, $filter, rsTable) {

    //set defaults
    $scope.alternateMilestones = false;
    $scope.proposal = { Team: [], Attachments: [], AlternativePriceAttachment: {}, IsAlternativePeriod: false, IsAlternativeBilling: false };

    $scope.tableParams = rsTable($scope, function () { return $scope.proposal.Team; }, { Name: 'asc' }, true, true, true);

    //Set default Form Values
    $scope.alternateMilestones = false;

    $scope.formData = {};

    $scope.datepickers = {
        timingdt: false,
        timingdt2: false,
        milestonedt: false
    }
    $scope.today = function () {
        $scope.formData.timingdt = new Date();
        $scope.formData.timingdt2 = new Date();
        $scope.formData.milestonedt = new Date();
    };

    $scope.showWeeks = true;
    $scope.toggleWeeks = function () {
        $scope.showWeeks = false;
    };

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.addMilestone = function () {
        $scope.proposal.AlternativeMilestones.push({ Date: null, Name: "", Amount: null });
    };

    $scope.deleteMilestone = function (m) {
        $scope.proposal.AlternativeMilestones.remove(m);

        if ($scope.proposal.AlternativeMilestones.length == 0) {
            $scope.addMilestone();
        }
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

    $scope.tableParams = rsTable($scope, function () { return $scope.proposal.Team; }, { Name: 'asc' }, true, true, true);

    var entityId = $location.search().id;

    loadProposal(entityId);

    $scope.cancel = function () {
        $location.url('/Pitch/Provider/InvitedBriefs');
        if (!$scope.$$phase) $scope.$apply();
    };

    $scope.save = function () {
        apiServices.BriefsService.SaveProposal($scope.proposal).then(
            function (result) {
                popupService.info('Pitch updated successfully.');
                $location.url('/Pitch/Provider/InvitedBriefs');
                if (!$scope.$$phase) $scope.$apply();
            });
    }

    function loadProposal(proposalId) {
        apiServices.BriefsService.GetMyProposal(proposalId).then(function (result) {
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