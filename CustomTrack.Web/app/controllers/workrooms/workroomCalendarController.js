'use strict';

function WorkroomCalendarController($scope, $compile, $modal, apiServices, uiCalendarConfig) {
    $scope.isLoading = true;
    $scope.events = [];
    $scope.calendarTemplate = '';
    
    function loadEvents() {
        apiServices.WorkroomService.GetWorkroomCalendarEvents($scope.id).then(
            function (events) {
                //event.start and end should be in js date not strig, so this is needed here anyway
                angular.forEach(events.data, function (event, key) {
                    event.start = moment(event.starts_at).toDate();
                    event.end = moment(event.ends_at).toDate();
                    $scope.events.push(event);
                });
                $scope.isLoading = false;
                $scope.calendarTemplate = 'workroomCalendarInnerCalendarTemplate.htm'; //We cab now load calendar, it will render correctly as event data is available
            });
    };

    loadEvents();

    $scope.eventsF = function (start, end, timezone, callback) {
        callback($scope.events);
    };
    $scope.eventlists = [$scope.eventsF];

    // ui-calendar config
    $scope.uiConfig = {
        calendar: {
            lazyFetching: false,
            height: 650,
            editable: false,
            header: {
                left: 'title',
                center: 'month,agendaWeek,agendaDay',
                right: 'prev,today,next'
            },
            eventClick: eventClicked,
            eventRender: eventRender
        }
    };

    $scope.renderCalender = function () {
        uiCalendarConfig.calendars['workroomCalendar'].fullCalendar('refetchEvents');
    };

    function eventClicked(event, ele, v) {
        $scope.search = event.title;
        if (moment(event.starts_at).isBefore())
            $scope.showPast = true;
    };
    function eventRender(event, element, view) {
        var desc = event.description ? (' - ' + event.description) : '';
        element.attr({
            'tooltip': event.title + desc,
            'tooltip-append-to-body': true
        });
        $compile(element)($scope);
    };

    $scope.eventDeleted = function (event) {
        //showModal('Deleted', event); //TOD: Should we show a confirmation Modal?
        if (event.deletable) {
            apiServices.WorkroomService.RemoveWorkroomCalendarEvent(event).then(
                    function (events) {
                        refreshEvents(events.data);
                    });
        }
    };

    $scope.isHidingPast = function (date) {
        return moment(date).isBefore(moment().startOf('day')) ? $scope.showPast ? 'privacyHidden' : 'hide' : '';
    }

    $scope.createEventAtStartDate = function (startDate) {
        $scope.createEventModal(null, startDate);
    };

    $scope.createEventModal = function (callback, startDate) {
        $modal.open({
            templateUrl: '/Partials/Workroom/Modals/CalendarCreate.html',
            controller: CreateEventController,
            resolve: {
                workroomId: function () { return $scope.id; },
                events: function () { return function (events) { refreshEvents(events); } },
                startDate: function () { return startDate; }
            },
            size: 'md'
        });
    }

    function refreshEvents(events) {
        $scope.events.length = 0;
        angular.forEach(events, function (event, key) {
            event.start = moment(event.starts_at).toDate();
            event.end = moment(event.ends_at).toDate();
            $scope.events.push(event);
        });
        $scope.renderCalender();
    }
};

function CreateEventController($scope, $filter, $modalInstance, apiServices, workroomId, events, startDate) {
    $scope.event = {
        WorkroomId: workroomId,
        starts_at_time: null,
        ends_at_time: null
    };
    
    // setted true when starts_at > ends_at
    $scope.eventEndAtMustGreaterStartAtError = false;


    //DatePicker Dropdown stuff - TODO: Place in directive
    $scope.today = (new XDate()).clearTime().toISOString();
    
    $scope.datepickers = {
        start: false,
        briefStartDate: false,
        briefEndDate: false
    }
    $scope.canSelectTime = {
        starts_at: false,
        ends_at: false
    };
    
    $scope.openDate = function ($event, which) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.datepickers[which] = true;
        $scope.canSelectTime[which] = true;
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
        $scope.event.allDay = !$scope.event.starts_at_time && !$scope.event.ends_at_time;
        apiServices.WorkroomService.AddWorkroomCalendarEvents([$scope.event]).then(
            function (newEvents) {
                $scope.isSaving = false;
                events(newEvents.data);
                $modalInstance.close();
            });
    };

    $scope.refreshDates = function() {
        $scope.event.starts_at = addTimeToDate($scope.event.starts_at_date, $scope.event.starts_at_time, false);
        $scope.event.ends_at = addTimeToDate($scope.event.ends_at_date == null ? $scope.event.starts_at_date : $scope.event.ends_at_date, $scope.event.ends_at_time, true);
        $scope.eventEndAtMustGreaterStartAtError = $scope.event.starts_at != null && $scope.event.ends_at != null && $scope.event.ends_at < $scope.event.starts_at;
    }

    $scope.$watch("event.starts_at_date", $scope.refreshDates, true);
    $scope.$watch("event.ends_at_date", $scope.refreshDates, true);
    $scope.$watch("event.starts_at_time", $scope.refreshDates, true);
    $scope.$watch("event.ends_at_time", $scope.refreshDates, true);

    function addTimeToDate(date, time, endOfDay) {
        var result = moment(date).toDate();
        if (time != null) {
            result.setHours(time.getHours());
            result.setMinutes(time.getMinutes());
        } else if (endOfDay) {

            // todo: Dmitry Goncharov: this is not correct when some peoples in workroom will use different timezones.
            result.setHours(23);
            result.setMinutes(59);
        }
        return result;
    }

    // set start date
    if (startDate != null) {
        $scope.event.starts_at_date = startDate;
        $scope.canSelectTime.starts_at = true;
    }
}