function ProviderInvitedBriefsController($scope, $routeParams, signalRService, apiServices) {

    $scope.briefs = [];

    loadBriefs();

    function loadBriefs() {
        apiServices.BriefsService.GetInvitedBriefs(0).then(
            function (result) {
                $scope.briefs = result.data;
            });
    };
};