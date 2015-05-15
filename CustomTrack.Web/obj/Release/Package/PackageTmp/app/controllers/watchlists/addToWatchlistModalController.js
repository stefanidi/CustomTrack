function AddToWatchlistModalController($scope, $modalInstance, $location, watchlistService, person, panel) {

    $scope.loading = false;
    $scope.added = false;
    $scope.person = person;
    $scope.panel = panel;
    $scope.watchlists = [];
    $scope.selected = {};
    $scope.isLoadingList = true;

    if ($scope.panel) {
        loadPanels();
        $scope.title = 'Add to Panel';
    }
    else {
        loadWatchlists();
        $scope.title = 'Add to Watchlist';
    }

    //--- View Action Handlers ---
    $scope.ok = function () {
        if ($scope.selected.selected) {
            if ($scope.panel) {
                watchlistService.addToPanel($scope.selected.selected.Id, person.Id || person.PersonId, addedConfirmation);
            }
            else {
                watchlistService.addToWatchlist($scope.selected.selected.Id, person.Id || person.PersonId, addedConfirmation);
            }
        }
        //$modalInstance.close();
        $scope.loading = true;
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.goToAdded = function () {
        $modalInstance.close();
        if ($scope.panel) {
            $location.url('/Panel/MyPanels?p=' + $scope.selected.selected.Name);
        }
        else {
            $location.url('/Panel/MyWatchlist?w=' + $scope.selected.selected.Name);
        }
        if (!$scope.$$phase) $scope.$apply();
    };

    //--- Private Functions ---
    function loadWatchlists() {
        watchlistService.getWatchlists(function (w) {
            $scope.watchlists = w;
            $scope.isLoadingList = false;
        });
    }

    function loadPanels() {
        watchlistService.getPanels(function (w) {
            $scope.watchlists = w;
            $scope.isLoadingList = false;
        });
    }

    function addedConfirmation(w) {
        $scope.loading = false;
        $scope.added = true;
        $scope.title = 'Person added';
    }


};