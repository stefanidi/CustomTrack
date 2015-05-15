function WorkroomCreateController($scope, $modalInstance, apiServices, allowDispute, categorySkills, providerAutoCompleteService) {
    $scope.categorySkills = categorySkills;
    $scope.selectedProvider = null;
    $scope.allowDispute = true;// allowDispute;
    $scope.isSaving = false;
    $scope.isExternalWorkroom = false;
    $scope.isLoadingPanelsForProvider = false;
    $scope.panels = [];
    
    $scope.workroom = {
        Name: "",
        IsDispute: false,
        Attachments: [],
        ProviderPanel: null
    };

    $scope.$watch("workroom.Category", function (newValue, oldValue) {
        if (oldValue != null) {
            $scope.workroom.Skills = [];
        }
        var skills = categorySkills[newValue];
        $scope.Skills = skills == null ? [] : skills;
    });

    $scope.$watch("isExternalWorkroom", function (newValue, oldValue) {
        $scope.externalWorkroom.$setPristine(true);
    });

    $scope.searchProvider = function (term) {
        return providerAutoCompleteService.searchProvider(term);
    };

    $scope.onSelectedProvider = function ($item, $model, $label) {
        $scope.workroom.Provider = $item;
        $scope.externalWorkroom.$setValidity("workroomProvider", true);
        loadProviderPanels($item.Id);
    }

    function loadProviderPanels(providerId) {
        $scope.workroom.ProviderPanel = null;
        $scope.isLoadingPanelsForProvider = true;

        apiServices.PanelService.GetProviderInPanelsModel(providerId).then(function (result) {
            $scope.panels = result.data.Panels;
            $scope.isLoadingPanelsForProvider = false;
            if ($scope.panels.length == 1) {
                $scope.workroom.ProviderPanel = $scope.panels[0];
            }
        });
    }
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }

    $scope.save = function () {
        $scope.isSaving = true;
        
        //Internal Workroom Creation
        if ($scope.isExternalWorkroom == false) {

            if (!$scope.workroom.Name) {
                $scope.externalWorkroom.$setValidity("workroomName", false);
                $scope.externalWorkroom.workroomName.$pristine = false;

                $scope.isSaving = false;
                return;
            }

            apiServices.WorkroomService.CreateManualWorkroom($scope.workroom).then(function (result) {
                $scope.isSaving = false;
                $modalInstance.close(result.data);
            });

            return;
        }

        //External workroom Creation
        if (!$scope.isExternalWorkroom) { return; }

        if (!$scope.workroom.Provider || !$scope.workroom.Provider.Id) {
            $scope.externalWorkroom.$setValidity("workroomProvider", false);
        }

        var isValid = !$scope.externalWorkroom.$invalid;

        if (!isValid) {
            $scope.externalWorkroom.workroomName.$pristine = false;
            $scope.externalWorkroom.briefDescription.$pristine = false;
            $scope.externalWorkroom.briefCategory.$pristine = false;
            $scope.externalWorkroom.briefBilling.$pristine = false;
            $scope.externalWorkroom.briefBillingFixedAmount.$pristine = false;
            $scope.externalWorkroom.providerPanel.$pristine = false;
            $scope.externalWorkroom.briefBillingEstimateAmount.$pristine = false;

            $scope.externalWorkroom.workroomProvider.$pristine = false;

            $scope.isSaving = false;
            return;
        }

        apiServices.BriefsService.CreateExternalWorkroom($scope.workroom).then(
            function (result) {
                $scope.isSaving = false;
                $modalInstance.close(result.data);
            });
    };

}