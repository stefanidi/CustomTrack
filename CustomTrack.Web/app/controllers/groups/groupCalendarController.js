'use strict';

function GroupCalendarController($scope, $modal, apiServices) {
 
};

function CreateEventController($scope, $modalInstance, apiServices, workroomId, events) {
    $scope.event = { GroupId: workroomId };

    //DatePicker Dropdown stuff - TODO: Place in directive
    $scope.today = (new XDate()).clearTime().toISOString();
    $scope.datepickers = {
        start: false,
        briefStartDate: false,
        briefEndDate: false
    }
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
    $scope.format = 'dd/MM/yyyy';
    //End of Datepicker stuff

    $scope.save = function () {
        $scope.isSaving = true;

        apiServices.GroupService.AddGroupCalendarEvents([$scope.event]).then(
            function (newEvents) {
                $scope.isSaving = false;
                events(newEvents.data);
                $modalInstance.close();
            });
    };
}