'use strict';

//Parent Workroom controller
function MyWorkroomController($scope, $routeParams, $location, signalRService, apiServices, $q, editableOptions){

    $scope.workroom = {
        WorkroomTeam: []
    }; // .Brief, .Email .Id
    $scope.id = 'Workroom/' + $routeParams.id;
    $scope.isLoadingWorkroom = false;


    signalRService.bbHub.on('changedWorkroomCompletionStatus', function (workroomId) {
        if ($scope.workroom.Id == workroomId) {
            $scope.reloadWorkroom();
        }
    });

    $scope.go = function (action) {
        $scope.activeWorkroomTemplate = action;
        $location.search('s', action);
        if (!$scope.$$phase) $scope.$apply();
    };

    $scope.IsOpen = function () {
        return $scope.workroom.WorkroomCompletionStatus == 'Open';
    };

    $scope.getCurrentWorkroomPerson = function () {
        var foundedUser = null;
        angular.forEach($scope.workroom.WorkroomTeam, function (wuser, key) {
            if (wuser.PersonId == userData.Id) {
                foundedUser = wuser;
                //HACK: Workroom team 'PartyType' shows the role of the person in the workroom. Even thought the persoon is provider, they can be acting as "client" in the workroom. So we nned to reflect this
                foundedUser.IsProvider = foundedUser.PartyType == 'Provider';
            }
        });
        return foundedUser;
    };

    $scope.go(($location.search() && $location.search().s) || 'Overview');

    $scope.isActive = function (route) {
        return $scope.activeWorkroomTemplate.contains(route);
    }

    $scope.saveWorkroom = saveWorkroom;

    loadWorkRoom();

    $scope.reloadWorkroom = loadWorkRoom;

    function loadWorkRoom() {
        $scope.isLoadingWorkroom = true;
        var loadingWorkroom = $q.defer();
        $scope.loadWorkroom = loadingWorkroom.promise;

        apiServices.WorkroomService.GetWorkroom($scope.id).then(
            function (result) {
                $scope.isLoadingWorkroom = false;
                $scope.workroom = result.data;
                loadingWorkroom.resolve(result.data);
            });
    };

    function saveWorkroom(onFinished) {
        apiServices.WorkroomService.SaveWorkroom($scope.workroom).then(
            function (w) {
                $scope.workroom = w.data;
                if (onFinished) onFinished(w.data);
            });
    };

    editableOptions.theme = 'bs2';
 
    $scope.$on('$destroy', function () {
        editableOptions.theme = 'default';
    });
};