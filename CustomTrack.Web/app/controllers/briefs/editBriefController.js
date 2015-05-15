'use strict';

function EditBriefController($scope, $routeParams, $location, signalRService, apiServices, categorySkills, providerAutoCompleteService) {

    $scope.categorySkills = categorySkills;
    $scope.brief = {};

    $scope.panels = [];
    $scope.providers = [];
    $scope.selectedPanel = {};
    $scope.selectedProvider = {};

    $scope.addedProviders = [];


    //DatePicker Dropdown stuff - TODO: Place in directive
    $scope.today = (new XDate()).clearTime().toISOString();
    $scope.datepickers = {
        briefExpiry: false,
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


    $scope.postingTypeChanged = function () {
        $scope.providerSelected = false;
        $scope.panelOrWlSelected = false;
        $scope.marketSelected = false;

        $scope.panels = [];
        $scope.providers = [];
        $scope.selectedProvider = null;

        if ($scope.brief.PostingType === 'Provider') {
            $scope.providerSelected = true;
        }
        else if ($scope.brief.PostingType === 'Panel') {
            $scope.panelOrWlSelected = true;
            loadPanels();
        }
        else if ($scope.brief.PostingType === 'Watchlist') {
            $scope.panelOrWlSelected = true;
            loadWatchlist();
        }
        else if ($scope.brief.PostingType === 'Market') {
            $scope.marketSelected = true;
        }
    };

    $scope.onSelectedProvider = function (p) {

        var has = false;
        $scope.addedProviders.forEach(function (item) {
            if (item.Name === p.Name) {
                has = true;
                return;
            }
        });
        if (!has) {
            $scope.addedProviders.push(p);
        }
        validateProviders();
        $scope.selectedProvider = null;
    }

    $scope.removeProvider = function (i) {
        $scope.addedProviders.splice(i, 1);
        validateProviders();
    }

    $scope.addAllProviders = function () {
        $scope.providers.forEach(function (item) {
            $scope.onSelectedProvider(item);
        });
    }

    $scope.save = function () {

        if ($scope.brief.PostingType && $scope.brief.PostingType != "Market") {
            if ($scope.addedProviders.length == 0) {
                $scope.formBrief.$setValidity("addProvider", false);
            }
            else {
                $scope.formBrief.$setValidity("addProvider", true);
            }
        }
        else {
            $scope.formBrief.$setValidity("addProvider", true);
        }

        //delete empty milestones
        if ($scope.brief.IsMilestoneRequired == false) {
            $scope.brief.Milestones.length = 0;
        } else {
            $scope.brief.Milestones = $.grep($scope.brief.Milestones, function (m, i) {
                return (m.Date || m.Name || m.Amount);
            });
        }

        var isValid = !$scope.formBrief.$invalid;

        if (!isValid) {

            $scope.formBrief.briefExpiry.$pristine = false;
            $scope.formBrief.briefBilling.$pristine = false;

            $scope.formBrief.briefBillingFixedAmount.$pristine = false;
            $scope.formBrief.briefBillingEstimateAmount.$pristine = false;

            $scope.formBrief.briefStartDate.$pristine = false;
            $scope.formBrief.briefEndDate.$pristine = false;

            $scope.formBrief.briefStatusReport.$pristine = false;
            $scope.formBrief.briefMilestones.$pristine = false;
            $scope.formBrief.briefPostingType.$pristine = false;

            return;
        }



        $scope.brief.InitialProviders = $scope.addedProviders;

        //For nice UX we need to deep copy the brief object so changes to the date does not flash up on the screen 
        var brief = angular.copy($scope.brief);
        brief.TimezoneOffset = new Date().getTimezoneOffset();//We need to know the client's timezone on the server for validations
        brief.Expiry = new Date(brief.Expiry);//make this JS date (in editBrief this is a string)
        brief.Expiry.setHours(23); //We want the brief to expire end of the day
        brief.Expiry.setMinutes(59);
        brief.Expiry.setSeconds(59);

        apiServices.BriefsService.SaveOpenBrief(brief).then(
            function (b) {
                $location.url('/Engage/BriefDetails?b=' + b.data.Id);
            });

    };

    $scope.cancel = function () {
        $location.url('/Engage/BriefDetails?b=' + $scope.brief.Id);
    };

    $scope.disableExpiryDate = function () {
        return (new XDate($scope.brief.StartDate)).toDate() < new Date();
    }

    $scope.addMilestone = function () {
        $scope.brief.Milestones.push({ Date: null, Name: "", Amount: null });
    };

    $scope.deleteMilestone = function (m) {
        $scope.brief.Milestones.remove(m);

        if ($scope.brief.Milestones.length == 0) {
            $scope.addMilestone();
        }
    };

    $scope.searchProvider = function (term) {
        return providerAutoCompleteService.searchProvider(term);
    };

    //--- Private Funcs ---
    function validateProviders() {
        var allFromAnotherCompany = true;
        $scope.addedProviders.forEach(function (item) {
            if (item.Company.CompanyId.toLowerCase() == userData.CompanyId) {
                allFromAnotherCompany = false;
            }
        });
        $scope.formBrief.$setValidity("providerWithSameCompany", allFromAnotherCompany);
    }

    function loadPanels() {
        apiServices.PanelService.GetUserPanels().then(function (result) {
            setPanel(result.data);
        });

    };

    function loadWatchlist() {
        apiServices.WatchlistService.GetUserWatchlists().then(function (result) {
            setPanel(result.data);
        });
    };

    function setPanel(panel) {
        $scope.panels = panel;
        $scope.providers = panel.People;
        
        if ($scope.brief.PanelId) {
            $scope.selectedPanel = $.grep(panel, function (p) { return p.Id == $scope.brief.PanelId; })[0];
        };
    }

    function loadBrief(id) {
        apiServices.BriefsService.GetClientBrief(id).then(
            function (b) {
                b.data.Expiry = (new XDate(b.data.Expiry)).clearTime().toISOString();

                $scope.brief = b.data;

                if (!$scope.brief.Milestones || $scope.brief.Milestones.length == 0) {
                    $scope.brief.Milestones = [];
                    $scope.addMilestone();
                }

                $scope.postingTypeChanged();

                b.data.InitialProviders.forEach(function (p) {
                    $scope.onSelectedProvider(p);
                });
            });
    };

    var searched;
    if ($location.search() && $location.search().b) {
        searched = $location.search().b;
        loadBrief(searched);
    }
}