function MyWatchlistsController($scope, $location, signalRService, apiServices, watchlistService, addProviderService, stateService, inputService, $filter, ngTableParams) {

    $scope.panels = null;
    $scope.people = [];
    $scope.searched = null;
    $scope.listview = false;

    loadPanels();

    if ($location.search() && $location.search().w) {
        $scope.searched = $location.search().w;
    }

    $scope.tickerpeople = [
        { name: "Andy Mcnee", expertise: "Commercial", firm: "Maddocks" },
        { name: "Paul Lanzone", expertise: "ITO", firm: "Hewlett Packard" },
        { name: "Daniel Ferguson", expertise: "Freehils", firm: "Bakers" },
        { name: "Brendan Coady", expertise: "Technology", firm: "Microsoft" },
        { name: "Paul Piper", expertise: "MSA", firm: "Ashurt" },
        { name: "Andy Carr", expertise: "Commercial", firm: "Fairfax" }]

    //--- View Action Handlers ---
    $scope.selectPanel = function (panel) {
        $scope.selectedPanel = panel;
        $scope.tableParams.reload();
        $location.search('w', panel.Name);
        $scope.searched = $location.search().w;
    };

    $scope.briefUser = function (user) {
        var id = user.Id.replace("/", "_");//it may contain "/" char
        stateService.set(id, user);
        $location.url('/Engage/CreateBrief?p=' + id);
        if (!$scope.$$phase) $scope.$apply();
    };

    $scope.addProvider = function () {
        addProviderService.open($scope.selectedPanel, function (added) {
            if (added) { loadPanels(); }
        }, true);
    };

    $scope.deleteWatchlist = function () {
        bootbox.confirm("Are you sure you want to delete this Watchlist?", function (confirmed) {
            if (confirmed == true) {
                apiServices.WatchlistService.DeleteWatchlist($scope.selectedPanel.Id).then(function () {
                    loadPanels();
                });
            }
        });
    };

    $scope.removePerson = function (watchlist, person) {
        watchlistService.removeFromWatchlist(watchlist.Id, person.Id, function (w) {
            //watchlist.People.remove(person);
            //$scope.$apply();
        });
        //Lets just remove the these, and not wait for server. Should be OK
        watchlist.People.remove(person);
    };

    $scope.renamePanel = function () {
        inputService.open('Enter New Watchlist Name',
            //OK:
            function (name) {
                $scope.selectedPanel.Name = name;
                $scope.selectPanel($scope.selectedPanel);
            },
            //cancel operation and go back - user clicked out of the modal
            null,
            false,
            $scope.selectedPanel.Name,
            function (name) { return apiServices.WatchlistService.Rename($scope.selectedPanel.Id, name); }
        );
    };

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
            name: 'asc'     // initial sorting
        }
    }, {
        total: $scope.selectedPanel?$scope.selectedPanel.People.length:0, // length of data
        getData: function ($defer, params) {
            if ($scope.selectedPanel) {
                // use build-in angular filter
                var orderedData = params.sorting() ?
                                    $filter('orderBy')($filter('filter')($scope.selectedPanel.People, $scope.searchText), params.orderBy()) :
                                    $scope.selectedPanel.People;
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

    // Load active providers
    apiServices.PersonService.ActiveProviders(10).then(function (result) {
        $scope.activeProviders = result.data;
    });

    //--- Private Funcs ---
    function loadPanels() {
        apiServices.WatchlistService.GetUserWatchlists().then(function (result) {
            setPanels(result.data);
        });
    };

    function setPanels(panels) {
        $scope.panels = panels;

        var selectedPanel;

        if ($scope.searched) {
            selectedPanel = $linq(panels).firstOrDefault(null, function (p) { return p.Name === $scope.searched; });
        }
        else if ($scope.selectedPanel) {
            selectedPanel = $linq(panels).firstOrDefault(null, function (p) { return p.Id === $scope.selectedPanel.Id; });
        }

        selectedPanel = selectedPanel ? selectedPanel : panels[0];

        if (selectedPanel) {
            $scope.selectPanel(selectedPanel);
        }
    };
};