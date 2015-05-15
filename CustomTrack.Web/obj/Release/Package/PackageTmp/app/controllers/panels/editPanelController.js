function EditPanelController($scope, $routeParams, $location, $modal, lookupProviderService, signalRService, apiServices, inputService, confirmService, $filter, ngTableParams) {

    $scope.isWatchlistActive = false;//Select default tab
    $scope.isAllActive = false;
    $scope.listview = true;
    $scope.people = [];
    $scope.myWatchlists = [];
    $scope.watchlist = {}; //selected watchlist
    $scope.panel = {};

    //Get a list of my watchlists
    apiServices.PanelService.GetUserPanels().then(
            function (result) {
                $scope.myWatchlists = result.data;
                if (result.data.length > 0) {
                    $scope.watchlist = result.data[0];
                }
            });

    

    //Add New Panel
    if ($location.path() == '/Panel/AddPanel/') {
        $scope.isAllActive = true;

        //Do A popup and get the name of the panel.
        $scope.panel.Name = "New Panel";
        $scope.panel.People = [];

        //Get a list of all people
        apiServices.PersonService.GetAllProviders(0).then(
                function (result) {
                    $scope.people = result.data;
                });

        openInput();
    };

    //Edit Watchlist
    if ($location.path().contains('EditPanel') && $routeParams.panel) {

        $scope.isAllActive = true;
        //Just for visuals
        $scope.panel.Name = $routeParams.panel;

        //Load watchlist to Edit
        loadPanel($routeParams.panel);
    }

    $scope.addProvider = function () {
        lookupProviderService.open($scope.panel.Name, function (added) {
            if (added) {

                if ($linq($scope.panel.People).any(function (p) { return p.Id == added.Id; })) {
                    return;
                }

                $scope.people.push(added);
                $scope.panel.People.push(added);
                $scope.tableParams.reload();
            }
        });
    };

    //Save Panel
    $scope.savePanel = function () {
        confirmService.open("Confirm Save", "Are you sure you want to update your panel?",
            function (reason) {
                //Set who owns the panel - panels are owned by a company.
                apiServices.PanelService.SavePanel($scope.panel).then(
                function () {
                    $location.url('/Panel/MyPanels?p=' + $scope.panel.Name);
                    if (!$scope.$$phase)
                        $scope.$apply();
                });
            },
            function () { }//Do nothing if user cancelled
            );
        //TODO: Do some validations
    };

    //Cancel button on the panel page.
    $scope.cancelPanel = function () {
        $scope.panel = {};
        exit();
    };

    $scope.isSelected = function (person) {
        return $linq($scope.panel.People).any(function (p) {
            return p.Id == person.Id;
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

    $scope.tableParams = new ngTableParams({
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
                                    $filter('orderBy')($filter('filter')($scope.people, $scope.searchText), params.orderBy()) :
                                    $scope.people;
                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            } else {
                $defer.resolve([]);
            }
        }
    });

    $scope.$watch("searchText", function (newValue, oldValue) {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    });

    //--- Private Functions ---
    function updateSelected(action, person) {
        if (action === 'add') {

            if ($linq($scope.panel.People).any(function (p) { return p && p.Id == person.Id; })) {
                return;
            }

            $scope.panel.People.push(person);
        }
        else if (action === 'remove') {
            var personToRemove = $linq($scope.panel.People).firstOrDefault(null, function (p) { return p && p.Id == person.Id; });

            if (personToRemove) {
                $scope.panel.People.remove(personToRemove);
            }
        }
    }

    function openInput() {
        inputService.open('New Panel Name',
            //OK:
            function (name) {
                $scope.panel.Name = name;
            },
            //cancel operation and go back - user clicked out of the modal
            exit,
            false,
            "",
            apiServices.PanelService.ValidateName
        );
    };

    function exit() {
        $location.path('/Panel/MyPanels');
        if (!$scope.$$phase) $scope.$apply();
    }

    function loadPanel(panelName) {
        apiServices.PanelService.GetPanel(panelName).then(
           function (w) {
               $scope.panel = w.data;
               $scope.people = w.data.People.slice(0);
               $scope.tableParams.reload();
           });
    }

};
