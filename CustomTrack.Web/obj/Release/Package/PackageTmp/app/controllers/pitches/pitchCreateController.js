function PitchCreateController($scope, $routeParams, $location, signalRService, apiServices, stateService, popupService, $filter, rsTable) {

    $scope.myTeamOnly = true;
    $scope.$watch('myTeamOnly', function (newValue, oldValue) {
        loadTeam();
    });

    //Set default Form Values
    $scope.alternateMilestones = false;

    // user must set conflicts checkbox before press next
    $scope.conflictsCheck = false;
    $scope.triedPitchConflictsCheck = false;

    $scope.formData = {};

    $scope.datepickers = {
        timingdt: false,
        timingdt2: false,
        milestonedt: false
    }
    $scope.today = function () {
        $scope.formData.timingdt = new Date();
        $scope.formData.timingdt2 = new Date();
        $scope.formData.milestonedt = new Date();
    };

    $scope.showWeeks = true;
    $scope.toggleWeeks = function () {
        $scope.showWeeks = false;
    };

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.addMilestone = function () {
        $scope.proposal.AlternativeMilestones.push({ Date: null, Name: "", Amount: null });
    };

    $scope.deleteMilestone = function (m) {
        $scope.proposal.AlternativeMilestones.remove(m);

        if ($scope.proposal.AlternativeMilestones.length == 0) {
            $scope.addMilestone();
        }
    };

    $scope.setBrief = function (brief) {
        $scope.brief = brief;

        // clone brief milestones to proposal
        $scope.proposal.AlternativeMilestones = angular.copy(brief.Milestones);
        $scope.proposal.Billing = brief.Billing;
        $scope.proposal.StartDate = brief.StartDate;
        $scope.proposal.EndDate = brief.EndDate;

        if ($scope.proposal.AlternativeMilestones == null || $scope.proposal.AlternativeMilestones.length == 0) {
            $scope.addMilestone();
        }
        if (!brief.IsBudgetVisible) {
            $scope.proposal.IsAlternativeBilling = true;
        }

        loadClientBriefStats();
    };

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

    $scope.formats = ['dd/MM/yyyy'];
    $scope.format = $scope.formats[0];

    $scope.tableParams = rsTable($scope, function () { return $scope.proposal.Team; }, { Name: 'asc' }, true, true, true);

    $scope.proposal = { Team: [], Attachments: [], AlternativePriceAttachment: {}, IsAlternativePeriod: false, IsAlternativeBilling: false };
    $scope.team = [];

    //$location.search().id contains either 'BriefProviderPreference/id' or 'brief/id'
    var entityId = $location.search().id;
    
    if (entityId.toLowerCase().contains('briefproviderpreference')) { //Invited Brief
        var briefProviderPreference = stateService.get(entityId.toLowerCase());
        if (briefProviderPreference == null) {
            briefProviderPreference = apiServices.BriefsService.GetBriefProviderPreference(entityId).then(function (result) {
                if (handleExpiredBrief(result.data.Brief)) {
                    $scope.setBrief(result.data.Brief);
                }
            });
        } else {
            $scope.setBrief(briefProviderPreference.Brief);
        }
        $scope.briefProviderPreferenceId = entityId;
        loadTeam();
    }
    else if (entityId.toLowerCase().contains('brief')) { //Market Brief
        //HACK: For Market briefs, this will be a brief ID and not briefProviderPreferenceId
        //We should really not use the same HTML or controller to view market briefs.
        //If this is from a market brief, we need to load it from the server
        loadTeam();
        loadBrief(entityId);
    } else if (entityId.toLowerCase().contains('proposal')) {
        //editing existing proposal
        loadProposal(entityId, function () { loadTeam(); });
    }

    var cleanEmptyMilestones = function (milestones) {
        if (milestones == null || milestones.length == 0) {
            return [];
        }

        var result = [];
        for (var i = 0; i < milestones.length; i++) {
            var item = milestones[i];
            if (item.Name != null && item.Amount != null) {
                result.push(item);
            }
        }
        return result;
    }

    function validatePitch() {
        $scope.pitchDisabled = true;
        var brief = $scope.brief;
        $scope.proposal.BriefId = brief.Id;

        //Fill out proposal fields
        $scope.proposal.BriefName = brief.Name;
        if ($scope.proposal.IsAlternativeBilling == false) {
            $scope.proposal.ProposedBudget = brief.Budget;
        } else {
            if ($scope.proposal.Billing == "Estimate") {
                if ($scope.proposal.ProposedBudget == null) {
                    bootbox.alert("You need to fill estimate pricing");
                    $scope.pitchDisabled = false;
                    return false;
                }
            } else if ($scope.proposal.Billing == "Alternative") {

                // check that alternative pricing model uploaded
                if ($scope.proposal.AlternativePriceAttachment.Attachment == null) {
                    bootbox.alert("You need to upload attachment with alternative pricing model, when it is selected");
                    $scope.pitchDisabled = false;
                    return false;
                }
            } else {
                if ($scope.proposal.ProposedBudget == null) {
                    bootbox.alert("You need to fill fixed pricing");
                    $scope.pitchDisabled = false;
                    return false;
                }
            }

            // process alternative timing
            if ($scope.proposal.IsAlternativePeriod == false) {
                $scope.proposal.StartDate = $scope.brief.StartDate;
                $scope.proposal.EndDate = $scope.brief.EndDate;
            } else {
                if ($scope.proposal.StartDate == null || $scope.proposal.EndDate == null) {
                    bootbox.alert("Alternative Timing should be filled");
                    $scope.pitchDisabled = false;
                    return false;
                } else if ($scope.proposal.StartDate > $scope.proposal.EndDate) {
                    bootbox.alert("Alternative Timing End Date must be greater than Start Date");
                    $scope.pitchDisabled = false;
                    return false;
                }
            }
        }

        // check conflicts checkbox
        if ($scope.conflictsCheck == false) {
            bootbox.alert("Please indicate you have performed a confilcts check");
            $scope.triedPitchConflictsCheck = true;
            $scope.pitchDisabled = false;
            return false;
        } else {
            $scope.triedPitchConflictsCheck = false;
        }

        if ($scope.alternateMilestones) {
            $scope.proposal.AlternativeMilestones = cleanEmptyMilestones($scope.proposal.AlternativeMilestones);
        } else {

            $scope.proposal.AlternativeMilestones = null;
        }

        $scope.proposal.PreferenceId = $scope.briefProviderPreferenceId;
        return true;
    };

    $scope.saveDraft = function() {
        if (validatePitch()) {
            apiServices.BriefsService.SaveDraftProposal($scope.proposal).then(
            function (result) {
                $location.url('/Pitch/Provider/InvitedBriefs');
                if (!$scope.$$phase) $scope.$apply();
            });
        }
    };

    $scope.next = function () {
        if (validatePitch()) {
            apiServices.BriefsService.SaveDraftProposal($scope.proposal).then(
            function (result) {
                //$scope.briefs.Open.briefs = b;
                //$scope.$apply();
                //popupService.info('Pitch posted successfully.');
                $location.url('/Pitch/Preview?id=' + result.data);
                if (!$scope.$$phase) $scope.$apply();
            });
        }
    };

    $scope.addPerson = function (person) {
        $scope.team.sort(teamSelectSort);

        if (!$scope.isPersonSelected(person)) {
            $scope.proposal.Team.push(person);
        }
    };

    $scope.removePerson = function (person) {
        $scope.team.sort(teamSelectSort);

        if ($scope.isPersonSelected(person)) {

            person = $linq($scope.proposal.Team).first(function (p) { return p.PersonId == person.PersonId; });

            $scope.proposal.Team.remove(person);
        }
    };
    
    $scope.isPersonSelected = function (person) {
        return $linq($scope.proposal.Team).any(function (p) { return p.PersonId == person.PersonId; });
    };

    $scope.canRemovePersonFromTeam = function (person) {
        var isPersonSelected = $scope.isPersonSelected(person);
        return isPersonSelected && person.PersonId != userData.Id;
    };

    $scope.canPost = function () {
        return $scope.brief
                && !$scope.pitchDisabled
                && $scope.proposal.Description && $scope.proposal.Description.length > 0;
    };

    $scope.save = function () {
        apiServices.BriefsService.SaveProposal($scope.proposal).then(
            function (result) {
                popupService.info('Pitch updated successfully.');
                $location.url('/Pitch/Provider/InvitedBriefs');
                if (!$scope.$$phase) $scope.$apply();
            });
    }

    function handleExpiredBrief(brief) {
        if (brief == false || brief.IsValidForPitching) return true;

        popupService.info('The brief is no longer available to pitch for.', function () { 
            $location.url('/Pitch/Provider/InvitedBriefs');
        });
    }

    function loadBrief(briefId) {
        apiServices.BriefsService.GetProviderBrief(briefId).then(
            function (result) {
                if (handleExpiredBrief(result.data)) {
                    //$scope.brief is really a BriefProviderPreference structured object
                    $scope.setBrief(result.data);
                }
            });
    }

    function loadProposal(proposalId, callback) {
        apiServices.BriefsService.GetMyProposal(proposalId).then(function (result) {
            if (handleExpiredBrief(result.data.Brief)) {
                $scope.brief = result.data.Brief;
                $scope.proposal = result.data;

                if ($scope.proposal.AlternativeMilestones && $scope.proposal.AlternativeMilestones.length > 0) {
                    $scope.alternateMilestones = true;
                } else {
                    $scope.alternateMilestones = false;
                }

                loadClientBriefStats();

                if (callback) {
                    callback();
                }
            }
        });
    }

    function loadTeam() {
        var onSuccess = function(result) {
            var t = result.data.TeamMembers;
            $scope.team = t;
            $scope.team.sort(teamSelectSort);

            //Add Myself as default
            var myself = $linq($scope.team).firstOrDefault(null, function(p) { return p.PersonId === userData.Id; });
            if (myself) {
                $scope.addPerson(myself);
            }

        };

        if ($scope.myTeamOnly) {
            apiServices.PersonService.GetPersonChooseTeam().then(onSuccess);
        } else {
            apiServices.PersonService.GetCompanyChooseTeam().then(onSuccess);
        }

    }

    function teamSelectSort(x, y) {
        if (y.selected === undefined) y.selected = false;
        if (x.selected === undefined) x.selected = false;

        if (x.selected === y.selected) {
            //sort alphabetically if both are selected or not
            return (x.Name < y.Name) ? -1 : (x.Name > y.Name) ? 1 : 0;
        }
        return x.selected ? -1 : 1;
    };

    function loadClientBriefStats() {
        apiServices.BriefsService.GetClientBriefStats($scope.brief.PostedBy.Id).then(function(result) {
            $scope.clientBriefStats = result.data;
        });
    }

    $scope.$watch("alternateMilestones", function () {
        if ($scope.alternateMilestones) {
            if ($scope.proposal.AlternativeMilestones == null || $scope.proposal.AlternativeMilestones.length == 0) {

                if ($scope.brief.Milestones && $scope.brief.Milestones.length > 0) {
                    $scope.proposal.AlternativeMilestones = angular.copy($scope.brief.Milestones);
                } else {
                    $scope.addMilestone();
                }
            }
        } else {
            $scope.proposal.AlternativeMilestones = [];
        }
    });

    $scope.cancel = function () {
        window.history.back();
    };
}