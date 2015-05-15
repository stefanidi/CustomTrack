'use strict';

function BriefDetailsController($scope, $routeParams, $location, signalRService, apiServices, $modal, inputService, confirmService, inviteProviderToBriefService) {

    $scope.title = 'Proposal';
    $scope.brief = {};
    $scope.briefStats = {};

    $scope.proposals = { Proposed: {}, Hidden: {}, Rejected: {}, Declined: {} };
    //this double reference is needed because the child controller uses it, and we want to set the reference from parent after child controller has got the reference

    var searched;
    if ($location.search() && $location.search().b) {
        searched = $location.search().b;
        loadBrief(searched);
        loadProposals(searched);
        loadBriefStats(searched);
    }

    signalRService.bbHub.on('newPitchForBrief', function (id) {
        if ($scope.brief && $scope.brief.Id === id) {
            loadProposals(searched);
        }
    });

    signalRService.bbHub.on('updatedPitchForBrief', function (id) {
        if ($scope.brief && $scope.brief.Id === id) {
            loadProposals(searched);
        }
    });


    $scope.addProvider = function () {
        inviteProviderToBriefService.open($scope.brief.Id, function () {
            loadBrief($scope.brief.Id);
        });
    };

    $scope.setHidden = function (proposal) {
        //We can only hide on the proposed tab
        //if ($scope.currentTab == 'Proposed') {
        setStatus(proposal, 'Hidden');
        //}
    }

    $scope.setRejected = function (proposal) {

        inputService.open("Reject Reason (Optional):",
            function (reason) {
                setStatus(proposal, 'Rejected');
                apiServices.BriefsService.RejectProposal(proposal, reason, $scope.brief.Name).then(function () {
                    loadProposals(searched);
                });
            },
            function () { },//Do nothing if user cancelled
            true);
    }

    $scope.setSelected = function (proposal) {

        //Confirm
        var modalInstance = $modal.open({
            templateUrl: '/Partials/Modals/ProposalSelectionConfirmationModal.html',
            controller: ProposalSelectionConfirmationController,
            resolve: { proposal: function () { return proposal; } }
        });
    }

    $scope.cancelBrief = function (brief) {
        confirmService.open("Cancel Brief", "Click OK to cancel your Brief.",
           function (reason) {
               apiServices.BriefsService.CancelBrief(brief).then(
               function (result) {
                   $location.url('/Manage/MyBriefs');
                   if (!$scope.$$phase) $scope.$apply();
               });
           },
           function () { }//Do nothing if user cancelled
           );
    };

    $scope.saveProposalRating = function (proposal) {
        apiServices.BriefsService.SetProposalRating({
            ProposalId: proposal.Id,
            BriefId: proposal.BriefId,
            Rating: proposal.Rating,
        });
    };

    function setStatus(proposal, status) {
        //Check for valid object
        if (!proposal || !status) {
            return;
        }

        var originalStatus = proposal.ProposalStatus;

        //Set status
        proposal.ProposalStatus = status;
        //Save
        setProposalStatus(proposal);
        //Remove from the current viewed collection. 
        $scope.proposals[originalStatus].proposals.remove(proposal);
        //add to the other collection
        $scope.proposals[status].proposals.push(proposal);
    }

    function loadBrief(id) {
        apiServices.BriefsService.GetClientBrief(id).then(
            function (b) {
                $scope.brief = b.data;

                //Check that the user did not click with an action
                if ($location.search() && $location.search().action == 'addProvider'
                                       && $scope.brief.PostingType === 'Provider') {
                    $scope.addProvider();
                }
            });
    };

    function loadProposals(id) {
        apiServices.BriefsService.GetProposalsForBrief(id).then(
            function (result) {
                var p = result.data;
                $scope.proposals.Proposed.proposals = p.Proposed || [];
                $scope.proposals.Hidden.proposals = p.Hidden || [];
                $scope.proposals.Rejected.proposals = p.Rejected || [];
                $scope.proposals.Declined.proposals = p.Declined || [];
            });
    }

    function loadBriefStats(id) {
        apiServices.BriefsService.GetBriefProposalsStats(id).then(
            function (result) {
                $scope.briefStats = result.data;
                $scope.briefStats.NumberOfStates = Object.keys($scope.briefStats.BriefCountByState || {}).length;
            });
    }

    function setProposalStatus(proposal) {
        apiServices.BriefsService.SetProposalStatus(proposal).then(
            function (p) {
                //TODO: update just in case.
            });
    }
}
function BriefDetailsProposalChildController($scope) {
    $scope.selectedProposals = $scope.proposals.Proposed; //Double so we can change the second reference, and it get's reflected in this child controller;

    $scope.search = '';
    $scope.order = 'SubmitedOn';
    $scope.reverse = true;
    $scope.orderName = 'Proposal Posted (Latest)';
}
function BriefDetailsHiddenChildController($scope) {
    $scope.selectedProposals = $scope.proposals.Hidden; //Double so we can change the second reference, and it get's reflected in this child controller;
    $scope.hideDisabled = true;

    $scope.search = '';
    $scope.order = 'SubmitedOn';
    $scope.reverse = true;
    $scope.orderName = 'Proposal Posted (Latest)';
}
function BriefDetailsRejectedChildController($scope) {
    $scope.selectedProposals = $scope.proposals.Rejected; //Double so we can change the second reference, and it get's reflected in this child controller;
    $scope.hideDisabled = true;
    $scope.rejectDisabled = true;
    $scope.selectDisabled = true;

    $scope.search = '';
    $scope.order = 'SubmitedOn';
    $scope.reverse = true;
    $scope.orderName = 'Proposal Posted (Latest)';
}
function BriefDetailsDeclinedChildController($scope) {
    $scope.title = 'Decline';
    $scope.selectedProposals = $scope.proposals.Declined; //Double so we can change the second reference, and it get's reflected in this child controller;
    $scope.hideDisabled = true;
    $scope.rejectDisabled = true;
    $scope.selectDisabled = true;

    $scope.search = '';
    $scope.order = 'SubmitedOn';
    $scope.reverse = true;
    $scope.orderName = 'Proposal Posted (Latest)';
}