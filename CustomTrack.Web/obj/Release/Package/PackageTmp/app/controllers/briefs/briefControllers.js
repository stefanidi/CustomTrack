'use strict';

// PROVIDER CONTROLLERS
function ProviderBriefsController($scope, $routeParams, $location, signalRService, apiServices, stateService, inputService) {
    $scope.isLoading = true;
    $scope.manageChartConfig = {
        "options": {
            "chart": {
                "type": "pie",
                "backgroundColor": "none",
                "marginTop": "-20"
            },
            "plotOptions": {
                "series": {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        distance: -50,
                        style: {
                            fontWeight: 'bold',
                            color: 'white' 
                        }
                    },
                    showInLegend: true
                }
            }
        },
        series: [{
            name: 'Value',
            data: [
                ['Invited', 0],
                ['Panel', 0],
            ]
        }],
        "title": {
            "text": ""
        },
        "credits": {
            "enabled": false
        },
        "loading": true,
        "size": {
            "height": "250"
        }
    }

    $scope.briefs = { Open: [], Pitched: [], Hidden: [], Declined: [], Rejected: [] };
    //this double reference is needed because the child controller uses it, and we want to set the reference from parent after child controller has got the reference

    $scope.briefStats = {};
    $scope.hideChart = false; //Chart should be visible to start with otherwise the legends get squished up.s

    loadBriefs();

    //Cause refresh if there is a new brief posted - server should ensure only right providers get this
    signalRService.bbHub.on('newBriefPosted', loadBriefs);

    $scope.setHidden = function (proposal) {
        setStatus(proposal, 'Hidden');
    }

    $scope.setDeclined = function (proposal) {

        inputService.open("Decline Reason (Optional):",
            function (reason) {
                apiServices.BriefsService.DeclineBrief(proposal, reason).then(function() {
                    loadBriefs();
                });
            },
            function () { },//Do nothing if user cancelled
            true);
    }

    $scope.pitch = function (brief) {

        var id = brief.Id;//.replace("/", "_");//it may contain "/" char
        stateService.set(id.toLowerCase(), brief);
        $location.url('/Pitch/Proposal?id=' + id);
        if (!$scope.$$phase) $scope.$apply();
    }

    function setStatus(providerBriefView, status) {
        //Check for valid object
        if (!providerBriefView || !status) {
            return;
        }

        var originalStatus = providerBriefView.ProviderBriefViewStatus;

        //Set status
        providerBriefView.ProviderBriefViewStatus = status;

        //Save
        apiServices.BriefsService.SetProviderBriefViewStatus({ PreferenceId: providerBriefView.Id, Status: status }).then(
            function () {
                //Remove from the current viewed collection. 
                $scope.briefs[originalStatus].briefs.remove(providerBriefView);
                //add to the other collection
                $scope.briefs[status].briefs.push(providerBriefView);
            });
        
        
    }

    function loadBriefs() {
        apiServices.BriefsService.GetProviderBriefs().then(
            function (result) {
                $scope.isLoading = false;
                //These are BriefProviderPreference objects
                $scope.briefs.Open.briefs = result.data.Open || [];
                $scope.briefs.Pitched.briefs = result.data.Pitched || [];
                $scope.briefs.Hidden.briefs = result.data.Hidden || [];
                $scope.briefs.Declined.briefs = result.data.Declined || [];
                $scope.briefs.Rejected.briefs = result.data.Rejected || [];
            });
        loadInvitedBriefsStats();
    };

    function loadInvitedBriefsStats() {
        $scope.manageChartConfig.loading = true;
        apiServices.BriefsService.GetInvitedBriefsStats().then(
            function (result) {
                $scope.briefStats = result.data;
                $scope.briefStats.TotalBriefs = $scope.briefStats.InvitedBriefsCount + $scope.briefStats.PanelBriefsCount;
                $scope.briefStats.NumberOfStates = Object.keys($scope.briefStats.ProposalCountByState || { }).length;
                $scope.hideChart = !$scope.briefStats.TotalBriefs;
                $scope.manageChartConfig.loading = false;
                $scope.manageChartConfig.series[0].data = [['Invited', $scope.briefStats.InvitedBriefsValue], ['Panel', $scope.briefStats.PanelBriefsValue]];
            });
    };
}

function ProviderBriefsChildController($scope) {
   
    $scope.selectedBriefs = $scope.briefs.Open; //Double so we can change the second reference, and it get's reflected in this child controller;
    $scope.briefStatus = 'Open';
    $scope.search = '';
    $scope.order = 'CreatedDate';
    $scope.reverse = true;
    $scope.orderName = 'Posted (Latest)';
}

function ProviderHiddenBriefsChildController($scope) {
    $scope.selectedBriefs = $scope.briefs.Hidden; //Double so we can change the second reference, and it get's reflected in this child controller;
    $scope.hideDisabled = true;
    $scope.briefStatus = 'Hidden';

    $scope.search = '';
    $scope.order = 'CreatedDate';
    $scope.reverse = true;
    $scope.orderName = 'Posted (Latest)';
}
function ProviderDeclinedBriefsChildController($scope) {
    $scope.selectedBriefs = $scope.briefs.Declined; //Double so we can change the second reference, and it get's reflected in this child controller;
    $scope.hideDisabled = true;
    $scope.declineDisabled = true;
    $scope.pitchDisabled = true;
    $scope.briefStatus = 'Declined';
    $scope.order = 'CreatedDate';
    $scope.reverse = true;
    $scope.orderName = 'Posted (Latest)';
}
function ProviderPitchedBriefsChildController($scope) {
    $scope.selectedBriefs = $scope.briefs.Pitched; //Double so we can change the second reference, and it get's reflected in this child controller;
    $scope.hideDisabled = true;
    $scope.declineDisabled = true;
    $scope.pitchDisabled = true;
    $scope.briefStatus = 'Pitched';
    $scope.order = 'CreatedDate';
    $scope.reverse = true;
    $scope.orderName = 'Posted (Latest)';
}
function ProviderRejectedBriefsChildController($scope) {
    $scope.selectedBriefs = $scope.briefs.Rejected; //Double so we can change the second reference, and it get's reflected in this child controller;
    $scope.hideDisabled = true;
    $scope.declineDisabled = true;
    $scope.pitchDisabled = true;
    $scope.briefStatus = 'Rejected';
    $scope.order = 'CreatedDate';
    $scope.reverse = true;
    $scope.orderName = 'Posted (Latest)';
}
function ProviderDraftBriefsChildController($scope, apiServices) {

    
    $scope.selectedBriefs = { briefs: [] };
    $scope.hideDisabled = false;
    $scope.declineDisabled = false;
    $scope.pitchDisabled = false;
    $scope.briefStatus = 'Draft';
    $scope.order = 'CreatedDate';
    $scope.reverse = true;
    $scope.orderName = 'Posted (Latest)';

    $scope.loadDraftBriefs = function() {
        $scope.isLoading = true;
        apiServices.BriefsService.GetDraftProviderBriefs().then(
            function (result) {
                $scope.isLoading = false;
                $scope.selectedBriefs.briefs = result.data || [];
            });
    };
}




