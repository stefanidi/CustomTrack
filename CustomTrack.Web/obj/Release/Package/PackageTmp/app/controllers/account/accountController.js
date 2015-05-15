'use strict';

function MyAccountController($scope, $location, signalRService, apiServices, countries, popupService, validationPopupService) {

    $scope.account = {
        

    };

    $scope.alerts = {
        MessageReceived: false,
        PanelAddedRemoved: false,
        WorkroomMessages: false,
        WorkroomAddedRemoved: false,
        WorkroomActivitySummary: false,
        WorkroomStatusUpdated: false,
        BriefWonLost: false,
        BriefUpdated: false,
        BriefClosed: false,
        ProposalReceived: false,
        ProposalUpdated: false
    };

    $scope.privacy = {
        DisplayProfileToAnonymousUsers: false,
        DisplayBriefHistory: false,
        DisplayExperience: false,
        DisplayClients: false,
        InboundEmail: false,
    };

    $scope.newPassword = {
        CurrentPassword: "",
        NewPassword: "",
        ConfirmPassword:""
    };

    $scope.isActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path.indexOf(r) == 0; });
        }
        return path.indexOf(route) == 0;
    }

    $scope.isExactActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path == r; });
        }
        return path == route;
    }

    $scope.selectedLocation = {
        Country: null,
        State: null,
        City: null
    };

    $scope.Countries = countries;

    $scope.IsSaving = false;

    $scope.SaveProfile = function() {

        $scope.IsSaving = true;

        $scope.account.Location = $scope.selectedLocation.Country?$scope.selectedLocation.Country.Name:null;
        $scope.account.State = $scope.selectedLocation.State?$scope.selectedLocation.State.Name:null;
        $scope.account.City = $scope.selectedLocation.City;

        $scope.account.AllowedAlerts = $linq(Object.keys($scope.alerts)).where(function (k) { return $scope.alerts[k]; }).toArray();
        $scope.account.PrivacySettings = $linq(Object.keys($scope.privacy)).where(function (k) { return $scope.privacy[k]; }).toArray();

        apiServices.PersonService.SaveProfile($scope.account).then(function (result) {
            $scope.IsSaving = false;
        });
    }

    $scope.SetNewPassword = function() {
        $scope.IsSaving = true;

        apiServices.PersonService.SetNewPassword($scope.newPassword, function (result) {
            $scope.IsSaving = false;
            validationPopupService.show("Oops! Something went wrong when changing your password.",result);
        }).then(function(result) {
            $scope.IsSaving = false;
            popupService.info('Your password has been changed successfully.', function () {
                $location.url('/Account');
            });
        });
    }

    apiServices.PersonService.GetOwnProfile().then(function(result) {
        $scope.account = result.data;
        $scope.isProvider = result.data.PersonRef.IsProvider;

        $scope.selectedLocation.Country = $linq($scope.Countries).firstOrDefault(null, function (e) { return e.Name == result.data.Location; });
        $scope.selectedLocation.State = $linq($scope.selectedLocation.Country.States).firstOrDefault(null, function (e) { return e.Name == result.data.State; });
        $scope.selectedLocation.City = $linq($scope.selectedLocation.State ? $scope.selectedLocation.State.Cities : $scope.selectedLocation.Country.Cities).firstOrDefault("Other", function (e) { return e == result.data.City; });


        $linq(result.data.AllowedAlerts).foreach(function(x) {
            $scope.alerts[x] = true;
        });

        $linq(result.data.PrivacySettings).foreach(function (x) {
            $scope.privacy[x] = true;
        });


        $scope.$watch("selectedLocation.Country", function (oldVal, newVal) {
            if (oldVal != newVal) {
                $scope.selectedLocation.State = null;
                $scope.selectedLocation.City = null;
            }
        });

        $scope.$watch("selectedLocation.State", function (oldVal, newVal) {
            if (oldVal != newVal) {
                $scope.selectedLocation.City = null;
            }
        });
    });
}