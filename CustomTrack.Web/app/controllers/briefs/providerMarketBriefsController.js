function ProviderMarketBriefsController($scope, $routeParams, signalRService, apiServices, categorySkills) {

    $scope.briefs = [];
    $scope.totalCount = 0;
    $scope.categorySkills = categorySkills;
    $scope.marketBriefsCategories = [];
    $scope.search = {};
    $scope.isLoading = false;
    $scope.isSearchMore = false;

    $scope.queryModel = {
        Sort: 'PostedDate',
        SortDesc: true,
        Category: '',
        Page: 1,
        PageSize: 50,
        Search: ""
    };

    $scope.$watch("search.$", function (oldVal, newVal) {
        if ($scope.isSearchMore) {
            $scope.queryModel.Search = $scope.search.$;
            if (!$scope.search.$) {
                $scope.isSearchMore = false;
            }
            loadBriefs();
        }
    });

    loadBriefs();
    loadMarketBriefsCategories();

    $scope.searchMore = function () {
        $scope.isSearchMore = true;
        $scope.queryModel.Search = $scope.search.$;
        loadBriefs();
    };

    $scope.onSortClick = function (sortBy) {
        $scope.queryModel.SortDesc = $scope.queryModel.Sort === sortBy ? !$scope.queryModel.SortDesc : $scope.queryModel.SortDesc;
        $scope.queryModel.Sort = sortBy;
        loadBriefs();
    };

    $scope.onCategoryClick = function (category) {
        $scope.queryModel.Category = $scope.queryModel.Category === category ? '' : category;
        loadBriefs();
    };

    $scope.load = loadBriefs;

    function loadBriefs() {
        if ($scope.isLoading) {
            return;
        }
        $scope.isLoading = true;
        //$scope.totalCount = 0;
        apiServices.BriefsService.GetMarketBriefs($scope.queryModel).then(
            function (result) {
                $scope.briefs = result.data.ResultList;
                $scope.totalCount = result.data.TotalCount;
                $scope.isLoading = false;
            });
    };

    function loadMarketBriefsCategories() {
        apiServices.BriefsService.GetMarketBriefsCategories().then(function(result) {
            $scope.marketBriefsCategories = result.data;
        });
    }
};