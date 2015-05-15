'use strict';

function ViewRawController($scope, $modalInstance, raw) {
    $scope.data = raw;

    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    }
};