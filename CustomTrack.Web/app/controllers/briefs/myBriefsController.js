'use strict';

function MyBriefsController($scope, $routeParams, signalRService, apiServices, $modal, confirmService, categorySkills) {

    $scope.queryModel = {
        Disputes: 'All',
        LoadAllStatuses: false
    };

    $scope.search = {
        BriefStatus: '',
        BriefPostingType: ''
    };
    $scope.reverse = true;
    $scope.order = 'PostedOn';
    $scope.categorySkills = categorySkills;
    $scope.briefs = [];
    $scope.userId = userData.Id;
    var isLoadedAllStatuses = false;

    loadBriefs();

    function loadBriefs() {
        apiServices.BriefsService.GetMyPostedBriefs($scope.queryModel).then(
            function (result) {
                $scope.briefs = result.data;
                isLoadedAllStatuses = $scope.queryModel.LoadAllStatuses;
            });
    };

    $scope.briefsFilter = function(value) {
        return (
                    ($scope.search.BriefStatus == '' && value.BriefStatus != 'Cancelled' && value.BriefStatus != 'Closed') ||
                    ($scope.search.BriefStatus == value.BriefStatus)
                ) &&
                (
                    ($scope.search.BriefPostingType == '') ||
                    ($scope.search.BriefPostingType == value.PostingType) ||
                    ($scope.search.BriefPostingType == "Invited" && (value.PostingType == 'Provider' || value.PostingType=='Watchlist'))
                );
    };

    $scope.setSearchBriefStatus = function(briefStatus) {
        $scope.search.BriefStatus = $scope.search.BriefStatus === briefStatus ? '' : briefStatus;
        if ((briefStatus == 'Cancelled' || briefStatus == 'Closed') && isLoadedAllStatuses == false) {
            $scope.queryModel.LoadAllStatuses = true;
            loadBriefs();
        }
    };

    $scope.setSearchDisputes = function (disputes) {
        $scope.queryModel.Disputes = disputes;
        loadBriefs();
    };

    $scope.setSearchBriefPostingType = function (postingType) {
        $scope.search.BriefPostingType = $scope.search.BriefPostingType === postingType ? '' : postingType;
    };

    $scope.cancelBrief = function (brief) {
        confirmService.open("Cancel Brief", "Click OK to cancel your Brief. <br /> All cancelled Briefs will be shown under 'Cancelled' in <strong>Browse by Status</strong>",
           function (reason) {
               apiServices.BriefsService.CancelBrief(brief).then(
               function (result) {
                   $scope.briefs.remove(brief);
               });
           },
           function () { }//Do nothing if user cancelled
           );
    };

    $scope.isWRMenuVisible = function (brief) {
        return brief.BriefStatus == 'Working' && brief.PostedBy.Id == window.userData.Id;
    }

    $scope.manageChartConfig = {
        "options": {
            "chart": {
                "type": "pie"
            },
            "plotOptions": {
                "series": {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            }
        },
        series: [{
            name: 'Revenue share',
            data: [
                ['Apple', 45.0],
                ['Samsung', 26.8],
                {
                    name: 'HTC',
                    y: 12.8
                }
            ]
        }],
        "title": {
            "text": ""
        },
        "credits": {
            "enabled": false
        },
        "loading": false,
        "size": {
            "height": "350"
        }
    }

    signalRService.bbHub.on('newPitchForBrief', function (id) {
        loadBriefs();
    });
};