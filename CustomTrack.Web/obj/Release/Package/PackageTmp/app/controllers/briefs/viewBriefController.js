'use strict';

function ViewBriefController($scope, $location, apiServices) {

    $scope.brief = {};

    var searched = "";

    if ($location.search() && $location.search().b) {
        searched = $location.search().b;
        loadBrief(searched);
    }

    var returnUrl = '/Engage/BriefDetails?b=' + searched;

    if ($location.search() && $location.search()['return']) {
        returnUrl = $location.search()['return'];
    }

    $scope.back = function () {
        $location.url(returnUrl);
        if (!$scope.$$phase) $scope.$apply();
    };

    function loadBrief(id) {
        apiServices.BriefsService.GetClientBrief(id).then(
            function (b) {
                $scope.brief = b.data;
            });
    };
}