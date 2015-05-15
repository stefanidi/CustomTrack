'use strict';

var bbApp = angular.module('bbApp', [
    'ngRoute',
    'bbApp.filters',
    'bbApp.services',
    'bbApp.directives',
    'bbApp.constants',
    'ui.bootstrap',
    'angularMoment',
    'xeditable',
    'ngTable',
    'highcharts-ng',
    'toggle-switch',
    'angularFileUpload',
    'ngSanitize',
    'ui.bootstrap-slider',
    'angular.filter',
    'jsonFormatter',
    'ui.calendar',
    'dnTimepicker',
    'angularValidator',
    'angulartics',
    'angulartics.google.analytics'
],
    function ($routeProvider, $locationProvider, userRoles) {

        $routeProvider.

            //Panel
            when('/Panel/MyPanels', {
                templateUrl: '/Partials/Panels/MyPanels.html',
                controller: MyPanelsController,
                reloadOnSearch: false,
                caseInsensitiveMatch: true
            }).
            when('/Panel/AddPanel/', {
                templateUrl: '/Partials/Panels/AddPanel.html',
                controller: EditPanelController,
                caseInsensitiveMatch: true
            }).
            when('/Panel/EditPanel/:panel', {
                templateUrl: '/Partials/Panels/EditPanel.html',
                controller: EditPanelController,
                caseInsensitiveMatch: true
            }).
            when('/Panel/MyWatchlist', {
                templateUrl: '/Partials/Watchlist/MyWatchlist.html',
                controller: MyWatchlistsController,
                reloadOnSearch: false,
                caseInsensitiveMatch: true
            }).
            when('/Panel/AddWatchlist', {
                templateUrl: '/Partials/Watchlist/EditWatchlist.html',
                controller: EditWatchlistController,
                caseInsensitiveMatch: true
            }).
            when('/Panel/EditWatchlist/:watchlist', {
                templateUrl: '/Partials/Watchlist/EditWatchlist.html',
                controller: EditWatchlistController,
                caseInsensitiveMatch: true
            }).
            when('/Panel', {
                templateUrl: '/Partials/MyPanels.html',
                controller: MyPanelsController,
                caseInsensitiveMatch: true
            }).
            when('/Notifications', {
                templateUrl: '/Partials/UserMessages/Notifications.html',
                controller: NotificationController,
                caseInsensitiveMatch: true
            }).
            when('/Inbox', {
                templateUrl: '/Partials/UserMessages/Inbox.html',
                controller: InboxController,
                caseInsensitiveMatch: true
            }).
            when('/Inbox/Sent', {
                templateUrl: '/Partials/UserMessages/Sent.html',
                controller: SentUserMessagesController,
                caseInsensitiveMatch: true
            }).
            when('/Inbox/Trash', {
                templateUrl: '/Partials/UserMessages/Trash.html',
                controller: TrashUserMessagesController,
                caseInsensitiveMatch: true
            }).
            when('/Inbox/Trash/View', {
                templateUrl: '/Partials/UserMessages/ViewMessage.html',
                controller: ViewMessageController,
                caseInsensitiveMatch: true
            }).
            when('/Inbox/Sent/View', {
                templateUrl: '/Partials/UserMessages/ViewMessage.html',
                controller: ViewMessageController,
                caseInsensitiveMatch: true
            }).
            when('/Inbox/View', {
                templateUrl: '/Partials/UserMessages/ViewMessage.html',
                controller: ViewMessageController,
                caseInsensitiveMatch: true
            }).

            //Engage
            when('/Engage/BrowseMarket', {
                templateUrl: '/Partials/Engage/BrowseMarket.html',
                controller: EngageController,
                caseInsensitiveMatch: true
            }).
            when('/Engage/Search', {
                templateUrl: '/Partials/Engage/Search.html',
                controller: SearchController,
                caseInsensitiveMatch: true
            }).
            when('/Engage/CreateBrief', {
                templateUrl: '/Partials/Engage/CreateBrief.html',
                controller: CreateBriefController,
                caseInsensitiveMatch: true
            }).
            when('/Engage/PreviewBrief', {
                templateUrl: '/Partials/Engage/PreviewBrief.html',
                controller: PreviewBriefController,
                caseInsensitiveMatch: true
            }).
            when('/Engage/ViewBrief', {
                templateUrl: '/Partials/Engage/ViewBrief.html',
                controller: ViewBriefController,
                caseInsensitiveMatch: true
            }).
            when('/Engage/EditBrief', {
                templateUrl: '/Partials/Engage/EditBrief.html',
                controller: EditBriefController,
                caseInsensitiveMatch: true
            }).
            when('/Engage/BriefDetails', {
                templateUrl: '/Partials/Engage/BriefDetails.html',
                controller: BriefDetailsController,
                caseInsensitiveMatch: true
            }).

            //Provider
            when('/Pitch/Proposal', {
                templateUrl: $linq(window.userData.Roles).any(function (r) { return r === userRoles.CanPitch; }) ? '/Partials/Provider/Pitch.html' : '/Partials/Provider/PitchDenied.html',
                controller: PitchCreateController,
                caseInsensitiveMatch: true
            }).
            when('/Pitch/Preview', {
                templateUrl: '/Partials/Provider/PitchPreview.html',
                controller: PitchPreviewController,
                caseInsensitiveMatch: true
            }).
            when('/Pitch/Edit', {
                templateUrl: '/Partials/Provider/PitchEdit.html',
                controller: PitchCreateController,
                caseInsensitiveMatch: true
            }).
            when('/Pitch/Provider/InvitedBriefs', {
                templateUrl: '/Partials/Provider/InvitedBriefs.html',
                controller: ProviderBriefsController,
                caseInsensitiveMatch: true
            }).
            when('/Pitch/Provider/MarketBriefs', {
                templateUrl: '/Partials/MarketBriefs.html',
                controller: ProviderMarketBriefsController,
                caseInsensitiveMatch: true
            }).

            //Manage
            when('/Manage/MyBriefs', {
                templateUrl: '/Partials/MyBriefs.html',
                controller: MyBriefsController,
                caseInsensitiveMatch: true
            }).
            when('/Manage/MyTeam', {
                templateUrl: '/Partials/MyTeam.html',
                controller: MyTeamController,
                caseInsensitiveMatch: true
            }).
            when('/Manage/Providers', {
                templateUrl: '/Partials/Providers.html',
                controller: MyProvidersController,
                caseInsensitiveMatch: true
            }).
            when('/Manage/Clients', {
                templateUrl: '/Partials/Providers.html',
                controller: MyProvidersController,
                caseInsensitiveMatch: true
            }).
            when('/Dashboard', {
                templateUrl: function () { return window.userData.IsProvider ? '/Partials/Provider/Dashboard.html' : '/Partials/Dashboard.html' },
                controller: DashboardController,
                caseInsensitiveMatch: true
            }).

            // Reports
            when('/Reports', {
                templateUrl: '/Partials/Reports/clientdashboard.html',
                controller: ReportsController,
                caseInsensitiveMatch: true
            }).
            when('/Reports/Spend', {
                templateUrl: '/Partials/Reports/Client/SpendOverview.html',
                controller: SpendOverviewController,
                caseInsensitiveMatch: true
            }).
            when('/Reports/Fees', {
                templateUrl: '/Partials/Reports/Provider/FeesOverview.html',
                controller: SpendOverviewController,
                caseInsensitiveMatch: true
            }).
            when('/Reports/Spend/ByProvider', {
                templateUrl: '/Partials/Reports/Client/SpendByProvider.html',
                controller: SpendByProviderReportController,
                caseInsensitiveMatch: true
            }).
            when('/Reports/Fees/ByPanel', {
                templateUrl: '/Partials/Reports/Provider/FeesByPanel.html',
                controller: SpendByPanelController,
                caseInsensitiveMatch: true
            }).
            when('/Reports/Spend/ByPanel', {
                templateUrl: '/Partials/Reports/Client/SpendByPanel.html',
                controller: SpendByPanelController,
                caseInsensitiveMatch: true
            }).
            when('/Reports/Spend/ByBrief', {
                templateUrl: '/Partials/Reports/Client/SpendByBrief.html',
                controller: SpendByBriefController,
                caseInsensitiveMatch: true
            }).
            when('/Reports/Invoices', {
                templateUrl: '/Partials/Reports/Client/invoices.html',
                controller: InvoiceReportController,
                caseInsensitiveMatch: true
            }).
            when('/Reports/Team', {
                templateUrl: '/Partials/Reports/Client/team.html',
                controller: TeamReportsController,
                caseInsensitiveMatch: true
            }).
            when('/Reports/Placeholder', {
                templateUrl: '/Partials/Reports/ComingSoon.html',
                controller: ReportsController,
                caseInsensitiveMatch: true
            }).

             //Workroom
            when('/Workrooms', {
                templateUrl: '/Partials/Workroom/MyWorkrooms.html',
                controller: MyWorkroomsListController,
                caseInsensitiveMatch: true
            }).
            when('/Workroom', {
                templateUrl: '/Partials/Workroom/MyWorkrooms.html',
                controller: MyWorkroomsListController,
                caseInsensitiveMatch: true
            }).
            when('/Workroom/:id', {
                templateUrl: '/Partials/Workroom/Workroom.html',
                controller: MyWorkroomController,
                reloadOnSearch: false,
                caseInsensitiveMatch: true
            }).

            // Recruitment
            when('/Opportunities', {
                templateUrl: '/Partials/Opportunities/dashboard.html',
                controller: RecruitController,
                caseInsensitiveMatch: true
            }).
            when('/Opportunities/MyOpportunities', {
                templateUrl: '/Partials/Opportunities/Employer/MyOpportunities.html',
                controller: RecruitController,
                caseInsensitiveMatch: true
            }).
            when('/Opportunities/Create', {
                templateUrl: '/Partials/Opportunities/Employer/CreateOpportunity.html',
                controller: RecruitSearchController,
                caseInsensitiveMatch: true
            }).
            when('/Opportunities/Search', {
                templateUrl: '/Partials/Opportunities/Candidate/SearchOpportunities.html',
                controller: RecruitSearchController,
                caseInsensitiveMatch: true
            }).
            when('/Opportunities/Details', {
                templateUrl: '/Partials/Opportunities/Employer/OpportunityDetails.html',
                controller: RecruitController,
                caseInsensitiveMatch: true
            }).
            when('/Opportunities/Shortlist', {
                templateUrl: '/Partials/Opportunities/Shortlist/MyShortlist.html',
                controller: RecruitController,
                caseInsensitiveMatch: true
            }).
            when('/Opportunities/AddShortlist', {
                templateUrl: '/Partials/Opportunities/Shortlist/EditShortlist.html',
                controller: RecruitController,
                caseInsensitiveMatch: true
            }).
            when('/Opportunities/SearchCandidates', {
                templateUrl: '/Partials/Opportunities/SearchCandidates.html',
                controller: RecruitSearchController,
                caseInsensitiveMatch: true
            }).
            when('/Opportunities/EditShortlist/:shortlist', {
                templateUrl: '/Partials/Opportunities/Shortlist/EditShortlist.html',
                controller: RecruitController,
                caseInsensitiveMatch: true
            }).
            when('/Opportunities/MyResume', {
                templateUrl: '/Partials/Opportunities/Resume/MyResume.html',
                controller: UserProfileController,
                caseInsensitiveMatch: true
            }).
            when('/Opportunities/Apply', {
                templateUrl: '/Partials/Opportunities/Candidate/Apply.html',
                controller: RecruitController,
                caseInsensitiveMatch: true
            }).
            when('/Opportunities/Apply/Preview', {
                templateUrl: '/Partials/Opportunities/Candidate/ApplyPreview.html',
                controller: RecruitController,
                caseInsensitiveMatch: true
            }).
            when('/Opportunities/BrowseMarket', {
                templateUrl: '/Partials/Opportunities/BrowseMarket.html',
                controller: EngageController,
                caseInsensitiveMatch: true
            }).
            when('/Opportunities/Placeholder', {
                templateUrl: '/Partials/Opportunities/ComingSoon.html',
                controller: RecruitController,
                caseInsensitiveMatch: true
            }).

            // CPD
            when('/CPD', {
                templateUrl: '/Partials/CPD/dashboard.html',
                controller: CPDController,
                caseInsensitiveMatch: true
            }).
            when('/CPD/Search', {
                templateUrl: '/Partials/CPD/Search.html',
                controller: CPDSearchController,
                caseInsensitiveMatch: true
            }).
            when('/CPD/Settings', {
                templateUrl: '/Partials/CPD/Settings/Settings.html',
                controller: CPDSettingsController,
                caseInsensitiveMatch: true
            }).
            when('/CPD/Tracker', {
                templateUrl: '/Partials/CPD/Tracker.html',
                controller: CPDTrackerController,
                caseInsensitiveMatch: true
            }).
            when('/CPD/Placeholder', {
                templateUrl: '/Partials/CPD/ComingSoon.html',
                controller: RecruitController,
                caseInsensitiveMatch: true
            }).

            //company admin
            when('/Company/Admin/Team', {
                templateUrl: '/Partials/Admin/Company/Team.html',
                controller: AdminCompanyTeamController,
                caseInsensitiveMatch: true
            }).
            when('/Company/Admin/Profile', {
                templateUrl: '/Partials/Admin/Company/Profile.html',
                controller: AdminCompanyProfileController,
                caseInsensitiveMatch: true
            }).

            // Admin Panel
            when('/Admin', {
                templateUrl: '/Partials/Admin/Global/AdminDashboard.html',
                controller: ReportsController,
                caseInsensitiveMatch: true
            }).
            when('/Admin/Customers', {
                templateUrl: '/Partials/Admin/Global/Customers.html',
                controller: AdminCustomersController,
                caseInsensitiveMatch: true
            }).
            when('/Admin/Logs', {
                templateUrl: '/Partials/Admin/Global/Logs.html',
                controller: AdminLogsController,
                caseInsensitiveMatch: true
            }).
            when('/Admin/Customers/Add', {
                templateUrl: '/Partials/Admin/Global/Customer.html',
                controller: AdminCustomerAddController,
                caseInsensitiveMatch: true
            }).
            when('/Admin/Customers/Details/:id', {
                templateUrl: '/Partials/Admin/Global/CustomerDetails.html',
                controller: AdminCustomerDetailsController,
                caseInsensitiveMatch: true
            }).
            when('/Admin/Users', {
                templateUrl: '/Partials/Admin/Global/Users.html',
                controller: AdminUsersController,
                caseInsensitiveMatch: true
            }).
            when('/Admin/Team', {
                templateUrl: '/Partials/Admin/Global/Team.html',
                controller: AdminTeamController,
                caseInsensitiveMatch: true
            }).

            // Admin Analytics
            when('/Admin/Analytics', {
                templateUrl: '/Partials/Admin/AnalyticsOverview.html',
                controller: AdminAnalyticsController,
                caseInsensitiveMatch: true
            }).
            when('/Admin/Analytics/ByCategory', {
                templateUrl: '/Partials/Admin/AnalyticsByCategory.html',
                controller: AdminAnalyticsByCategoryController,
                caseInsensitiveMatch: true
            }).
            when('/Admin/Analytics/ByClient', {
                templateUrl: '/Partials/Admin/AnalyticsByClient.html',
                controller: AdminAnalyticsByClientController,
                caseInsensitiveMatch: true
            }).

            // Big Data 
            when('/Admin/BigData', {
                templateUrl: '/Partials/Admin/BigData/Overview.html',
                controller: BigDataController,
                caseInsensitiveMatch: true
            }).
            when('/Admin/BigData/Client', {
                templateUrl: '/Partials/Admin/BigData/Client.html',
                controller: BigDataClientController,
                caseInsensitiveMatch: true
            }).
            when('/Admin/BigData/Provider', {
                templateUrl: '/Partials/Admin/BigData/Provider.html',
                controller: BigDataProviderController,
                caseInsensitiveMatch: true
            }).
            when('/Admin/BigData/Transaction', {
                templateUrl: '/Partials/Admin/BigData/Transaction.html',
                controller: BigDataTransactionController,
                caseInsensitiveMatch: true
            }).
            when('/Admin/BigData/Industry', {
                templateUrl: '/Partials/Admin/BigData/Industry.html',
                controller: BigDataIndustryController,
                caseInsensitiveMatch: true
            }).

            // System Data
            when('/Admin/SystemData', {
                templateUrl: '/Partials/Admin/SystemData/Overview.html',
                controller: SystemDataOverviewController,
                caseInsensitiveMatch: true
            }).
            //when('/Admin/SystemData/Tech', {
            //    templateUrl: '/Partials/Admin/SystemData/Tech.html',
            //    controller: SystemDataTechController
            //}).
            //when('/Admin/SystemData/App', {
            //    templateUrl: '/Partials/Admin/SystemData/App.html',
            //    controller: SystemDataAppController
            //}).
            //when('/Admin/SystemData/SaleSite', {
            //    templateUrl: '/Partials/Admin/SystemData/SaleSite.html',
            //    controller: SystemDataSSController
            //}).
            //when('/Admin/SystemData/Mobile', {
            //    templateUrl: '/Partials/Admin/SystemData/Mobile.html',
            //    controller: SystemDataMobileController
            //}).
            when('/Profile/:id', {
                templateUrl: '/Partials/Profile/Profile.html',
                controller: UserProfileController,
                caseInsensitiveMatch: true
            }).
            when('/Profile', {
                templateUrl: '/Partials/Profile/Profile.html',
                controller: UserProfileController,
                caseInsensitiveMatch: true
            }).
            when('/Firm/:id', {
                templateUrl: '/Partials/Profile/Firm/Profile.html',
                controller: CompanyProfileController,
                caseInsensitiveMatch: true
            }).
            when('/Firm/:id/:tab', {
                templateUrl: '/Partials/Profile/Firm/Profile.html',
                controller: CompanyProfileController,
                caseInsensitiveMatch: true
            }).
            when('/Firm', {
                templateUrl: '/Partials/Profile/Firm/Profile.html',
                controller: CompanyProfileController,
                caseInsensitiveMatch: true
            }).
            when('/Company/:id', {
                templateUrl: '/Partials/Profile/Company/Profile.html',
                controller: CompanyProfileController,
                caseInsensitiveMatch: true
            }).
            when('/Company/:id/:tab', {
                templateUrl: '/Partials/Profile/Company/Profile.html',
                controller: CompanyProfileController,
                caseInsensitiveMatch: true
            }).
            when('/Company', {
                templateUrl: '/Partials/Profile/Company/Profile.html',
                controller: CompanyProfileController,
                caseInsensitiveMatch: true
            }).

            when('/Account', {
                templateUrl: '/Partials/Account/General.html',
                controller: MyAccountController,
                caseInsensitiveMatch: true
            }).
            when('/Account/Billing', {
                templateUrl: '/Partials/Account/Billing.html',
                controller: MyAccountController,
                caseInsensitiveMatch: true
            }).
            when('/Account/Privacy', {
                templateUrl: '/Partials/Account/Privacy.html',
                controller: MyAccountController,
                caseInsensitiveMatch: true
            }).
            when('/Account/Firm', {
                templateUrl: '/Partials/Account/Firm.html',
                controller: MyAccountController,
                caseInsensitiveMatch: true
            }).
            when('/Account/Password', {
                templateUrl: '/Partials/Account/Password.html',
                controller: MyAccountController,
                caseInsensitiveMatch: true
            }).

            when('/Support', {
                templateUrl: '/Partials/Support/FAQ.html',
                controller: SupportController,
                caseInsensitiveMatch: true
            }).
            when('/Support/FAQ', {
                templateUrl: '/Partials/Support/FAQ.html',
                controller: SupportController,
                caseInsensitiveMatch: true
            }).
            when('/Support/HowTo', {
                templateUrl: '/Partials/Support/HowTo.html',
                controller: SupportController,
                caseInsensitiveMatch: true
            }).
            when('/Support/ContactUs', {
                templateUrl: '/Partials/Support/ContactUs.html',
                controller: ContactUsController,
                caseInsensitiveMatch: true
            }).            

            when('/Groups', {
                templateUrl: '/Partials/Groups/MyGroups.html',
                controller: MyGroupsController,
                reloadOnSearch: false,
                caseInsensitiveMatch: true
            }).
            when('/Groups/Search', {
                templateUrl: '/Partials/Groups/SearchGroups.html',
                controller: SearchGroupsController,
                reloadOnSearch: false,
                caseInsensitiveMatch: true
            }).
            when('/Groups/CreateGroup', {
                templateUrl: '/Partials/Groups/CreateGroup.html',
                controller: CreateGroupController,
                reloadOnSearch: false,
                caseInsensitiveMatch: true
            }).
            when('/Group', {
                templateUrl: '/Partials/Groups/Room/Group.html',
                controller: GroupController,
                reloadOnSearch: false,
                caseInsensitiveMatch: true
            }).
            when('/Groups/Placeholder', {
                templateUrl: '/Partials/Groups/ComingSoon.html',
                controller: MyGroupsController,
                caseInsensitiveMatch: true
            }).
            
            otherwise({
                redirectTo: '/Dashboard'
            });

        // configure html5 to get links working on jsfiddle
        //$locationProvider.html5Mode(true);
    })

    .config(['$controllerProvider', function ($controllerProvider) {
        // this option might be handy for migrating old apps, but please don't use it
        // in new ones!
        $controllerProvider.allowGlobals();
    }])

    .config(["$provide", function ($provide) { //Client Side Error Tracking: http://docs.trackjs.com/Examples/Integrating_with_Angular
        $provide.decorator("$exceptionHandler", ["$delegate", "$window", function ($delegate, $window) {
            return function (exception, cause) {
                if ($window.trackJs) {
                    $window.trackJs.track(exception);
                }
                // (Optional) Pass the error through to the delegate formats it for the console
                $delegate(exception, cause);
            };
        }])
    }])

    .run(function ($rootScope, amMoment) {
        //store current user created by Razor in Index.cshtml in $rootScope of angular, this allows binding to currentUser
        $rootScope.currentUser = window.userData;

        //Set Moment Locale
        amMoment.changeLocale('en-au');

        //Make highchart show large numbers like 13,450 instead of "13 450" not sure why it was putting those stupid spaces in there. (This is used in /Reports/Team line graph).
        Highcharts.setOptions({
            lang: {
                decimalPoint: '.',
                thousandsSep: ','
            },
            credits: {
                enabled: false //Hide 'highcharts.com' globally
            },
            colors: ['#00ADBB', '#F38630', '#E7E7E7', '#555555', '#64E572', '#F28284', '#EA3A00', '#1C5379']
        });
    });

