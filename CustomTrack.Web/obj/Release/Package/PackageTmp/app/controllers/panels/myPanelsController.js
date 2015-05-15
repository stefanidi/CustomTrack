function MyPanelsController($scope, $location, signalRService, apiServices, addProviderService, inputService, stateService, $filter, ngTableParams, userRoles) {

    $scope.panels = null;
    $scope.people = [];
    $scope.searched = null;
    $scope.listview = false;

    $scope.readOnly = $linq(window.userData.Roles).any(function(r) { return r == userRoles.CanEditPanels; }) === false;

    signalRService.bbHub.on('savePanel', function (panel) {
        loadPanels();
    });

    signalRService.bbHub.on('addPanel', function (panel) {
        $scope.panels.push(panel);
        $scope.$apply();
    });

    loadPanels();

    if ($location.search() && $location.search().p) {
        $scope.searched = $location.search().p;
    }

    //--- View Action Handlers ---
    $scope.selectPanel = function (panel) {
        $scope.selectedPanel = panel;
        $scope.tableParams.reload();
        $location.search('p', panel.Name);
        $scope.searched = $location.search().p;
    };

    $scope.deletePanel = function () {
        bootbox.confirm("Are you sure you want to delete this Panel?", function (confirmed) {
            if (confirmed == true) {
                apiServices.PanelService.DeletePanel($scope.selectedPanel.Id).then(function () {
                    loadPanels();
                });
            }
        });
    };

    $scope.briefUser = function (user) {
        var id = user.Id.replace("/", "_");//it may contain "/" char
        stateService.set(id, user);
        $location.url('/Engage/CreateBrief?p=' + id);
        if (!$scope.$$phase) $scope.$apply();
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

    $scope.$watch("searchText", function(newValue, oldValue) {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    });

    $scope.addProvider = function () {
        addProviderService.open($scope.selectedPanel, function (added) {
            if (added) { loadPanels(); }
        });
    };

    $scope.renamePanel = function () {
        inputService.open('Enter New Panel Name',
            //OK:
            function (name) {
                $scope.selectedPanel.Name = name;
                $scope.selectPanel($scope.selectedPanel);
            },
            //cancel operation and go back - user clicked out of the modal
            null,
            false,
            $scope.selectedPanel.Name,
            function (name) { return apiServices.PanelService.Rename($scope.selectedPanel.Id, name); }
        );
    };

    //--- Private Funcs ---
    function loadPanels() {
        apiServices.PanelService.GetUserPanels().then(function (result) {
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
