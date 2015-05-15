function EditWatchlistController($scope, $routeParams, $location, $modal, signalRService, apiServices, inputService, $filter, ngTableParams) {

    $scope.isWatchlistActive = false;//Select default tab
    $scope.isAllActive = false;
    $scope.people = [];
    $scope.watchlist = {};
    $scope.watchlist.People = [];
    $scope.listview = true;

    //Add New Watchlist
    if ($location.path() === '/Panel/AddWatchlist') {

        $scope.isAllActive = true;
        $scope.addOrEdit = 'Add Watchlist:';

        //Do A popup and get the name of the panel.
        $scope.watchlist.Name = "New Watchlist";
        $scope.watchlist.People = [];

        openInput();
    };

    //Edit Watchlist
    if ($location.path().contains('EditWatchlist') && $routeParams.watchlist) {

        $scope.isWatchlistActive = true;
        $scope.addOrEdit = 'Edit Watchlist: ';
        //Just for visuals
        $scope.watchlist.Name = $routeParams.watchlist;

        //Load watchlist to Edit
        apiServices.WatchlistService.GetWatchlist($routeParams.watchlist).then(
            function (w) {
                $scope.watchlist = w.data;
                $scope.tableParamsWatchlist.reload();
            });
    }

    //Get a list of all people
    loadPeople();

    //Save Panel
    $scope.savePanel = function () {
        apiServices.WatchlistService.SaveWatchlist($scope.watchlist).then(
            function () {
                $location.url('/Panel/MyWatchlist?w=' + $scope.watchlist.Name);
                if (!$scope.$$phase) $scope.$apply();
            });
    };

    //Cancel button on the panel page.
    $scope.cancelPanel = function () {
        $scope.watchlist = {};
        exit();
    };

    $scope.isSelected = function (person) {
        if (!person) {
            return false;
        }

        return $linq($scope.watchlist.People).any(function (p) {
            return p && p.Id == person.Id;
        });
    };
    $scope.getSelectedClass = function (p) {
        return $scope.isSelected(p) ? 'selected-provider' : '';
    };

    $scope.updateSelection = function ($event, p) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, p);
    };

    $scope.tableParamsWatchlist = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
            name: 'asc'     // initial sorting
        }
    }, {
        total: $scope.watchlist?$scope.watchlist.People.length:0, // length of data
        getData: function ($defer, params) {

            if ($scope.watchlist) {
                // use build-in angular filter
                var orderedData = params.sorting() ?
                                    $filter('orderBy')($filter('filter')($scope.watchlist.People, $scope.searchText), params.orderBy()) :
                                    $scope.watchlist.People;
                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            } else {
                $defer.resolve([]);
            }
        }
    });

    $scope.tableParamsAll = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
            name: 'asc'     // initial sorting
        }
    }, {
        total: $scope.people?$scope.people.length:0, // length of data
        getData: function ($defer, params) {

            if ($scope.people && $scope.people.length > 0) {
                // use build-in angular filter
                var orderedData = params.sorting() ?
                    $filter('orderBy')($filter('filter')($scope.people, $scope.searchAll), params.orderBy()) :
                    $scope.people;
                params.total(orderedData.length);

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            } else {
                $defer.resolve([]);
            }
        }
    });

    $scope.$watch("searchText", function (newValue, oldValue) {
        $scope.tableParamsWatchlist.page(1);
        $scope.tableParamsWatchlist.reload();
    });

    $scope.$watch("searchAll", function (newValue, oldValue) {
        $scope.tableParamsAll.page(1);
        $scope.tableParamsAll.reload();
    });

    function updateSelected(action, person) {
        if (action === 'add') {

            if ($linq($scope.watchlist.People).any(function(p) { return p && p.Id == person.Id; })) {
                return;
            }

            $scope.watchlist.People.push(person);
        }
        else if (action === 'remove') {
            var personToRemove = $linq($scope.watchlist.People).firstOrDefault(null, function(p) { return p && p.Id == person.Id; });

            if (personToRemove) {
                $scope.watchlist.People.remove(personToRemove);
            }
        }
    }

    //Get a list of all people
    function loadPeople() {
        apiServices.WatchlistService.GetAllWatchlistPersons(0).then(
            function (result) {
                $scope.people = result.data;
                $scope.tableParamsAll.reload();
            });
    }

    function openInput() {
        inputService.open('New Watchlist Name',
            //OK:
            function (name) {
                $scope.watchlist.Name = name;
            },
            //cancel operation and go back - user clicked out of the modal
            exit,
            false,
            "",
            apiServices.WatchlistService.ValidateName
        );
    };

    function exit() {
        $location.path('/Panel/MyWatchlist');
        if (!$scope.$$phase) $scope.$apply();
    }
};