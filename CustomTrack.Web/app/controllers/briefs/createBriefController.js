'use strict';

function CreateBriefController($scope, $routeParams, $location, signalRService, apiServices, stateService, popupService, $filter, $modal, categorySkills, providerAutoCompleteService) {
    $scope.categorySkills = categorySkills;

    $scope.isCreateDisabled = false;
    $scope.addedProviders = [];
    $scope.brief = { IsBudgetVisible: true, AllowAlternative:false, Attachments: [], Skills: [], Milestones: [{ Date: null, Name: "", Amount: null }] , Category: null }; //Defaultss

    $scope.panels = [];
    $scope.providers = [];
    $scope.selectedPanel = {};
    $scope.selectedProvider = null;

    $scope.Skills = [];

    $scope.$watch("brief.Category", function (newValue, oldValue) {
        if (oldValue != null) {
            $scope.brief.Skills = [];
        }
        var skills = categorySkills[newValue];
        $scope.Skills = skills == null ? [] : skills;
    });

    //DatePicker Dropdown stuff - TODO: Place in directive
    $scope.today = (new XDate()).clearTime().toISOString();
    $scope.datepickers = {
        ends_at: false,
        starts_at: false
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


    var searched;
    if ($location.search() && $location.search().b) {
        searched = $location.search().b;
        loadDraftBrief(searched);
    }

    if ($location.search() && $location.search().r) {
        searched = $location.search().r;
        loadExpiredBrief(searched);
    }

    var directProvider;
    if ($location.search() && $location.search().p) {
        directProvider = $location.search().p;
        $scope.brief.PostingType = 'Provider';
        $scope.addedProviders.push(stateService.get(directProvider));
    }

    $scope.postingTypeChanged = function () {
        $scope.providerSelected = false;
        $scope.panelOrWlSelected = false;
        $scope.panelOrWlLoading = false;
        $scope.marketSelected = false;

        $scope.panels = [];
        $scope.providers = [];
        $scope.selectedProvider = null;

        $scope.addedProviders = [];

        if ($scope.brief.PostingType === 'Provider') {
            $scope.providerSelected = true;
        }
        else if ($scope.brief.PostingType === 'Panel') {
            $scope.panelOrWlLoading = true;
            $scope.panelOrWlSelected = true;
            loadPanels();
        }
        else if ($scope.brief.PostingType === 'Watchlist') {
            $scope.panelOrWlLoading = true;
            $scope.panelOrWlSelected = true;
            loadWatchlist();
        }
        else if ($scope.brief.PostingType === 'Market') {
            $scope.marketSelected = true;
        }
    };

    $scope.panelChanged = function () {
        $scope.providers = $.grep($scope.selectedPanel.People, function (p) { return p.PartyType == 'Provider'; });
        $scope.addedProviders = [];
        $scope.addAllProviders();
        $scope.brief.PanelId = $scope.selectedPanel.Id;
    };
    
    $scope.onSelectedProvider = function ($item, $model, $label) {
        var has = false;
        $scope.addedProviders.forEach(function (item) {
            if (item.Name === $item.Name) {
                has = true;
                return;
            }
        });
        if (!has) {
            $scope.addedProviders.push($item);
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

    $scope.PostingTypeModal = function (modalname) {
        $modal.open({
            templateUrl: '/Partials/Support/Tooltips/CreateBriefPostingType.html',
            controller: function ($scope, $modalInstance) {
                $scope.close = function () {
                    $modalInstance.dismiss('cancel');
                };
            },
            //resolve: { feedback: function () { return $scope.feedback; } },
            size: 'md'
        });
    }


    $scope.save = function () {
        $scope.isCreateDisabled = true;
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
            $scope.formBrief.briefName.$pristine = false;
            $scope.formBrief.briefDescription.$pristine = false;
            $scope.formBrief.briefCategory.$pristine = false;
            $scope.formBrief.briefExpiry.$pristine = false;
            $scope.formBrief.briefBilling.$pristine = false;

            $scope.formBrief.briefBillingFixedAmount.$pristine = false;
            $scope.formBrief.briefBillingEstimateAmount.$pristine = false;

            $scope.formBrief.briefStartDate.$pristine = false;
            $scope.formBrief.briefEndDate.$pristine = false;

            $scope.formBrief.briefStatusReport.$pristine = false;
            $scope.formBrief.briefMilestones.$pristine = false;
            $scope.formBrief.briefPostingType.$pristine = false;

            $scope.isCreateDisabled = false;
            return;
        }

        //delete empty milestones
        if ($scope.brief.IsMilestoneRequired == false) {
            $scope.brief.Milestones.length = 0;
        } else {
            $scope.brief.Milestones = $.grep($scope.brief.Milestones, function (m, i) {
                return (m.Date || m.Name || m.Amount);
            });
        }

        $scope.brief.InitialProviders = $scope.addedProviders;
        $scope.brief.BriefStatus = 'Draft';
        $scope.brief.PanelId = $scope.selectedPanel ? $scope.selectedPanel.Id : null;

        //For nice UX we need to deep copy the brief object so changes to the date does not flash up on the screen 
        var brief = angular.copy($scope.brief);
        brief.TimezoneOffset = new Date().getTimezoneOffset();//We need to know the client's timezone on the server for validations
        brief.Expiry = new Date(brief.Expiry);//make this JS date (in editBrief this is a string)
        brief.Expiry.setHours(23); //We want the brief to expire end of the day
        brief.Expiry.setMinutes(59);
        brief.Expiry.setSeconds(59);

        apiServices.BriefsService.SaveBrief(brief).then(
            function (b) {
                $location.url('/Engage/PreviewBrief?b=' + b.data.Id);
                if (!$scope.$$phase) $scope.$apply();
            });

    };

    $scope.addMilestone = function () {
        $scope.brief.Milestones.push({ Date: null, Name: "", Amount: null });
    };

    $scope.deleteMilestone = function (m) {
        $scope.brief.Milestones.remove(m);

        if ($scope.brief.Milestones.length == 0) {
            $scope.addMilestone();
        }
    };

    $scope.cancel = function () {
        $location.url('/');
        if (!$scope.$$phase) $scope.$apply();
    };

    $scope.dateOptions = {
        startingDay: 1
    };

    $scope.searchProvider = function (term) {
        return providerAutoCompleteService.searchProvider(term);
    };

    //--- Private Funcs ---

    function validateProviders() {
        var allFromAnotherCompany = true;
        $scope.addedProviders.forEach(function(item) {
            if (item.Company.CompanyId.toLowerCase() == userData.CompanyId) {
                allFromAnotherCompany = false;
            }
        });
        $scope.formBrief.$setValidity("providerWithSameCompany", allFromAnotherCompany);
    }

    function loadPanels() {
        apiServices.PanelService.GetUserPanels().then(function (result) {
            $scope.panelOrWlLoading = false;
            setPanel(result.data);
        });

    };

    function loadWatchlist() {
        apiServices.WatchlistService.GetUserWatchlists().then(function (result) {
            $scope.panelOrWlLoading = false;
            setPanel(result.data);
        });
    };

    function setPanel(panel) {
        $scope.panels = panel;
        
        if ($scope.brief.PanelId) {
            $scope.selectedPanel = $.grep(panel, function (p) { return p.Id == $scope.brief.PanelId; })[0];
        };
    }

    function loadDraftBrief(id) {
        apiServices.BriefsService.GetClientBrief(id).then(
            function (result) {

                //clear time component of brief.Expiry
                result.data.Expiry = (new XDate(result.data.Expiry)).clearTime().toISOString();

                $scope.brief = result.data;

                if (!$scope.brief.Milestones || $scope.brief.Milestones.length == 0) {
                    $scope.brief.Milestones = [];
                    $scope.addMilestone();
                }

                $scope.postingTypeChanged();

                result.data.InitialProviders.forEach(function (p) {
                    $scope.onSelectedProvider(p);
                });


            });
    };

    function loadExpiredBrief(id) {
        apiServices.BriefsService.GetClientBrief(id).then(
            function (result) {
                $scope.brief = result.data;
                $scope.brief.RepostedBriefId = result.data.Id;
                $scope.brief.Id = null;//we should be creating new brief
                //clear dates fields because they should be all new
                $scope.brief.Expiry = null;
                $scope.brief.StartDate = null;
                $scope.brief.EndDate = null;

                if (!$scope.brief.Milestones || $scope.brief.Milestones.length == 0) {
                    $scope.brief.Milestones = [];
                    $scope.addMilestone();
                }

                $scope.postingTypeChanged();

                result.data.InitialProviders.forEach(function (p) {
                    $scope.onSelectedProvider(p);
                });
            });
    };

    // Load active providers
    apiServices.PersonService.ActiveProviders(10).then(function (result) {
        $scope.activeProviders = result.data;
    });
    //Returns true when brief is valid complete.


    //TODO: FOR TESTING - REMOVE BEFORE GO-LIVE
    $scope.TESTFILL = function () {
        $scope.brief.Name = 'Test Brief - ' + new Date().toLocaleString();
        $scope.brief.Description = 'A brief (Old French from Latin "brevis", short) is a written legal document used in various legal adversarial systems that is presented to a court arguing why one party to a particular case should prevail.';
        $scope.brief.Category = 'Banking and Finance';
        $scope.brief.Skills.push('Bank Advisory Work');
        $scope.brief.Skills.push('Cash CLOs');
        //$scope.brief.Expiry = (new XDate(2015, 4, 23)).clearTime().toISOString();//F####CK!!! why, why the f!@# nothing I try makes this stupid date work???
        $scope.brief.Billing = 'Fixed';
        $scope.brief.Budget = 6500;
        $scope.brief.IsBudgetVisible = true;
        $scope.brief.StartDate = (new XDate(2015, 5, 1)).clearTime().toISOString();
        $scope.brief.EndDate = (new XDate(2015, 9, 5)).clearTime().toISOString();
        $scope.brief.IsStatusRequired = false;
        $scope.brief.IsDispute = true;
        $scope.brief.IsMilestoneRequired = true;
        $scope.brief.Milestones.unshift({ Name: 'Milestone Two', Date: (new XDate(2015, 7, 20)).clearTime().toISOString(), Amount: 2500 });
    $scope.brief.Milestones.unshift({ Name: 'First Milestone', Date: (new XDate(2015, 6, 1)).clearTime().toISOString(), Amount: 4000 });
    };
};