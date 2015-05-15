'use strict';
/* Services */

angular.module('bbApp.services', [])

    ////Cause JS Exceptions to fail hard
    //.factory('$exceptionHandler', function () {
    //    return function (exception, cause) {
    //        exception.message += ' (caused by "' + cause + '")';
    //        throw exception;
    //    };
    //})

    .factory('signalRService', [function () {

        var onError = function () {
            angular.element('#loading').hide();
            angular.element('#error').show();
        }

        $.connection.hub.url = "/SignalR";
        $.connection.hub.logging = true;

        //Must have a subscription in order to use SignalR
        var needThis = function (message) { console.log(message); };
        $.connection.bBHub.on('debugLog', needThis);

        //Start The connection  
        var connected = $.connection.hub.start().fail(onError);

        var guids = new FixedQueue(50);

        //Object that all Controllers can get with functions to call.
        return {
            connection: $.connection,

            hub: function (hubCall, onDone) {
                connected.done(function () { hubCall($.connection.hub).done(onDone); });
            },

            bbHub: $.connection.bBHub,

            onMessageAdded: function (callback) {
                $.connection.bBHub.on('messageAdded', callback);
            },

            guids : {
                push:function(guid) {
                    guids.push(guid);
                },
                exists:function(guid) {
                    return $linq(guids).any(function(g) { return g === guid; });
                }
            }
        };
    }])

    .factory('apiServices', ['$http', 'signalRService',
            function ($http, signalRService) {

                var loading = function () {
                    angular.element('#error').hide();//Ensure we hide error on re-loads
                    angular.element('#loading').show();
                }
                var finish = function (data, status, headers, config, callback) {
                    angular.element('#loading').hide();
                    if (callback) {
                        callback(data.result);
                    }
                }
                var onError = function (data, status, headers, config, callback) {
                    angular.element('#loading').hide();

                    if (callback) {
                        callback(data.result||data);
                    } else {
                        angular.element('#error').show();
                    }
                    trackJs.track(JSON.stringify({ status: status, url: config.url, method: config.method, data: data }));
                }

                var callService = function (controller, action, data, isPost, id, onSuccessCallback, onErrorCallback) {

                    var guid = uuid.v4();
                    signalRService.guids.push(guid);

                    if (id == null) {
                        // this is hack for asp.net webapi routing, it's not work without optional parameter
                        id = 0;
                    }
                    var url = '/api/' + controller + '/' + action + '/' + id;
                    if (typeof (isPost) !== 'undefined' && isPost) {
                        loading();
                        return $http.post(url, data, { headers: { 'bb-request-guid': guid } }).
                        success(function (result, status, headers, config) {
                            finish(result, status, headers, config, onSuccessCallback);
                        }).
                        error(function (result, status, headers, config) {
                            onError(result, status, headers, config, onErrorCallback);
                        });
                    } else {
                        loading();
                        return $http.get(url, { params: data, headers: { 'bb-request-guid': guid } }).
                        success(function (result, status, headers, config) {
                            finish(result, status, headers, config, onSuccessCallback);
                        }).
                        error(function (result, status, headers, config) {
                            onError(result, status, headers, config, onErrorCallback);
                        });
                    }

                };

                //Object that all Controllers can get with functions to call.
                return {

                    UploadService: {
                        SaveProfileImage: function (model) {
                            return callService('upload', 'SaveProfileImage', model, true);
                        }
                    },
                    UserMessageService: {
                        GetMessagesSummary: function () {
                            return callService('usermessage', 'GetMessagesSummary');
                        },
                        GetMessage: function (id) {
                            return callService('usermessage', 'GetMessage', null, false, id);
                        },
                        MarkAsRead: function (id) {
                            return callService('usermessage', 'MarkAsRead', null, false, id);
                        },
                        QuickMessage: function (message) {
                            return callService('usermessage', 'QuickMessage', message, true);
                        },
                        DeleteMessages: function (messageIds) {
                            return callService('usermessage', 'DeleteMessages', messageIds, true);
                        },
                        GetIndoxPageWidgetStatistic: function () {
                            return callService('usermessage', 'GetIndoxPageWidgetStatistic');
                        },
                        GetInboxMessages: function (model) {
                            return callService('usermessage', 'GetInboxMessages', model, true);
                        },
                        MarkMessagesAsRead: function (messageIds) {
                            return callService('usermessage', 'MarkMessagesAsRead', messageIds, true);
                        },
                        GetSentMessages: function (model) {
                            return callService('usermessage', 'GetSentMessages', model, true);
                        },
                        DeleteMessagesFromTrash: function (messageIds) {
                            return callService('usermessage', 'DeleteMessagesFromTrash', messageIds, true);
                        },
                        GetTrashMessages: function (model) {
                            return callService('usermessage', 'GetTrashMessages', model, true);
                        },
                        SendMessageToCompany: function (model) {
                            return callService('usermessage', 'SendMessageToCompany', model, true);
                        },
                        InviteUserToBriefBox: function (model) {
                            return callService('usermessage', 'InviteUserToBriefBox', model, true);
                        },
                    },

                    BriefsService: {

                        // region Client Section
                        GetMyPostedBriefs: function (model) {
                            return callService('briefs', 'GetMyPostedBriefs', model, true);
                        },
                        GetClientBrief: function (id, onErrorCallback) {
                            return callService('briefs', 'GetClientBrief', null, false, id, onErrorCallback);
                        },
                        GetProviderBrief: function (id, onErrorCallback) {
                            return callService('briefs', 'GetProviderBrief', null, false, id, onErrorCallback);
                        },
                        SaveBrief: function (brief) {
                            return callService('briefs', 'SaveBrief', brief, true);
                        },
                        SaveOpenBrief: function (brief) {
                            return callService('briefs', 'SaveOpenBrief', brief, true);
                        },
                        PostBrief: function (id) {
                            return callService('briefs', 'PostBrief', null, true, id);
                        },
                        GetMyProposal: function (id, onErrorCallback) {
                            return callService('briefs', 'GetMyProposal', null, false, id, onErrorCallback);
                        },
                        GetProposalsForBrief: function (id) {
                            return callService('briefs', 'GetProposalsForBrief', null, false, id);
                        },
                        SetProposalStatus: function (proposal) {
                            return callService('briefs', 'SetProposalStatus', proposal, true);
                        },
                        RejectProposal: function (proposal, reason, briefName) {
                            return callService('briefs', 'RejectProposal', { proposal: proposal, reason: reason, briefName: briefName }, true);
                        },
                        CancelBrief: function (brief) {
                            return callService('briefs', 'CancelBrief', brief, true);
                        },
                        GetBriefProposalsStats: function (id) {
                            return callService('briefs', 'GetBriefProposalsStats', null, false, id);
                        },

                        // region Provider Section
                        GetMarketBriefs: function (model) {
                            return callService('briefs', 'GetMarketBriefs', model, true);
                        },
                        GetProviderBriefs: function () {
                            return callService('briefs', 'GetProviderBriefs', null, false);
                        },
                        GetDraftProviderBriefs: function () {
                            return callService('briefs', 'GetDraftProviderBriefs', null, false);
                        },
                        GetInvitedBriefsStats: function () {
                            return callService('briefs', 'GetInvitedBriefsStats', null, false);
                        },
                        SetProviderBriefViewStatus: function (preference) {
                            return callService('briefs', 'SetProviderBriefViewStatus', preference, true);
                        },
                        DeclineBrief: function (preference, reason) {
                            return callService('briefs', 'DeclineBrief', { preference: preference, reason: reason }, true);
                        },
                        SaveDraftProposal: function (proposal) {
                            return callService('briefs', 'SaveDraftProposal', proposal, true);
                        },
                        PitchProposal: function (proposal) {
                            return callService('briefs', 'PitchProposal', proposal, true);
                        },
                        SaveProposal: function (proposal) {
                            return callService('briefs', 'SaveProposal', proposal, true);
                        },
                        AcceptProposal: function (proposal) {
                            return callService('briefs', 'AcceptProposal', proposal, true);
                        },
                        InviteProviderToBrief: function (briefId, providerId) {
                            return callService('briefs', 'InviteProviderToBrief', { briefId: briefId, providerId: providerId }, true);
                        },
                        GetProviderBriefStats: function (providerId) {
                            return callService('briefs', 'GetProviderBriefStats', null, false, providerId);
                        },
                        GetClientBriefStats: function (clientId) {
                            return callService('briefs', 'GetClientBriefStats', null, false, clientId);
                        },
                        SetProposalRating: function (model) {
                            return callService('briefs', 'SetProposalRating', model, true);
                        },
                        GetBriefProviderPreference: function (id, onErrorCallback) {
                            return callService('briefs', 'GetBriefProviderPreference', null, false, id, null, onErrorCallback);
                        },
                        GetMarketBriefsCategories: function (id, onErrorCallback) {
                            return callService('briefs', 'GetMarketBriefsCategories');
                        },
                        CreateExternalWorkroom: function (model) {
                            return callService('briefs', 'CreateExternalWorkroom', model, true);
                        },
                    },

                    WorkroomService: {
                        GetMyWorkrooms: function (model) {
                            return callService('workroom', 'GetMyWorkrooms', model, true);
                        },
                        GetWorkroom: function (id) {
                            return callService('workroom', 'GetWorkroom', null, false, id);
                        },
                        SaveWorkroom: function (workroom) {
                            return callService('workroom', 'SaveWorkroom', workroom, true);
                        },
                        RemoveWorkroomDispute: function(id){
                            return callService('workroom', 'RemoveWorkroomDispute', null, false, id);
                        },
                        GetWorkroomDispute: function (id) {
                            return callService('workroom', 'GetWorkroomDispute', null, false, id);
                        },
                        SaveWorkroomDispute: function (dispute) {
                            return callService('workroom', 'SaveWorkroomDispute', dispute, true);
                        },
                        GetWorkroomProviderDebrief: function (id) {
                            return callService('workroom', 'GetWorkroomProviderDebrief', null, false, id);
                        },
                        SaveWorkroomProviderDebrief: function (providerDebrief) {
                            return callService('workroom', 'SaveWorkroomProviderDebrief', providerDebrief, true);
                        },
                        GetWorkroomClientDebrief: function (id) {
                            return callService('workroom', 'GetWorkroomClientDebrief', null, false, id);
                        },
                        SaveWorkroomClientDebrief: function (clientDebrief) {
                            return callService('workroom', 'SaveWorkroomClientDebrief', clientDebrief, true);
                        },
                        CreateManualWorkroom: function (workroom) {
                            return callService('workroom', 'CreateManualWorkroom', workroom, true);
                        },
                        GetWorkRoomMessages: function (model) {
                            return callService('workroom', 'GetWorkRoomMessages', model, true);
                        },
                        AddMessage: function (message) {
                            return callService('workroom', 'AddMessage', message, true);
                        },
                        GetWorkroomAttachments: function (workroomId) {
                            return callService('workroom', 'GetWorkroomAttachments', null, false, workroomId);
                        },
                        RemoveWorkroomAttachments: function (id, workroomId, attachment) {
                            return callService('workroom', 'RemoveWorkroomAttachments', { Id: id, WorkroomId: workroomId, Attachment: attachment }, true);
                        },
                        GetWorkroomTimes: function (workroomId) {
                            return callService('workroom', 'GetWorkroomTimes', null, false, workroomId);
                        },
                        AddWorkroomTime: function (model) {
                            return callService('workroom', 'AddWorkroomTime', model, true);
                        },
                        RemoveWorkroomTime: function (workroomTimeId) {
                            return callService('workroom', 'RemoveWorkroomTime', null, false, workroomTimeId);
                        },
                        GetWorkroomTerms: function (workroomId) {
                            return callService('workroom', 'GetWorkroomTerms', null, false, workroomId);
                        },
                        GetWorkroomStatuses: function (workroomId) {
                            return callService('workroom', 'GetWorkroomStatuses', null, false, workroomId);
                        },
                        GetStatusDetails: function (workroomStatusId) {
                            return callService('workroom', 'GetStatusDetails', null, false, workroomStatusId);
                        },
                        AddStatusComment: function (model) {
                            return callService('workroom', 'AddStatusComment', model, true);
                        },
                        AddStatus: function (model) {
                            return callService('workroom', 'AddStatus', model, true);
                        },
                        GetWorkroomProposals: function (workroomId) {
                            return callService('workroom', 'GetWorkroomProposals', null, false, workroomId);
                        },
                        GetWorkroomOverview: function (workroomId) {
                            return callService('workroom', 'GetWorkroomOverview', null, false, workroomId);
                        },
                        GetWithMostRecentActivity: function () {
                            return callService('workroom', 'GetWithMostRecentActivity', null, false);
                        },
                        SetCompletionStatus: function (model) {
                            return callService('workroom', 'SetCompletionStatus', model, true);
                        },

                        AddWorkroomCalendarEvents: function (models) {
                            return callService('workroom', 'AddWorkroomCalendarEvents', models, true);
                        },
                        RemoveWorkroomCalendarEvent: function (model) {
                            return callService('workroom', 'RemoveWorkroomCalendarEvent', model, true);
                        },
                        GetWorkroomCalendarEvents: function (workroomId) {
                            return callService('workroom', 'GetWorkroomCalendarEvents', null, false, workroomId);
                        },
                        GetPaymentModel: function (workroomId) {
                            return callService('workroom', 'GetPaymentModel', null, false, workroomId);
                        },
                        AddWorkroomPaymentInvoice: function (model) {
                            return callService('workroom', 'AddWorkroomPaymentInvoice', model, true);
                        },
                        AddWorkroomPaymentInvoiceDisputeComment: function (model) {
                            return callService('workroom', 'AddWorkroomPaymentInvoiceDisputeComment', model, true);
                        },
                        ChangeWorkroomPaymentInvoiceState: function (model) {
                            return callService('workroom', 'ChangeWorkroomPaymentInvoiceState', model, true);
                        },
                        SetClientAccountsPayableEmail: function (model) {
                            return callService('workroom', 'SetClientAccountsPayableEmail', model, true);
                        }
                    },
                    WatchlistService: {
                        GetUserWatchlists: function () {
                            return callService('watchlist', 'GetUserWatchlists');
                        },
                        GetWatchlist: function (watchlistName) {
                            return callService('watchlist', 'GetWatchlist', { name: watchlistName }, true);
                        },
                        SaveWatchlist: function (watchlist) {
                            return callService('watchlist', 'SaveWatchlist', watchlist, true);
                        },
                        AddToWatchlist: function (watchlistId, personId) {
                            if (angular.isUndefined(personId)) throw 'PersonId must be defined';
                            return callService('watchlist', 'AddToWatchlist', { watchlistId: watchlistId, personId: personId }, true);
                        },
                        RemoveFromWatchlist: function (watchlistId, personId) {
                            return callService('watchlist', 'RemoveFromWatchlist', { watchlistId: watchlistId, personId: personId }, true);
                        },
                        GetAllWatchlistPersons: function () {
                            return callService('watchlist', 'GetAllWatchlistPersons');
                        },
                        DeleteWatchlist: function (id) {
                            return callService('watchlist', 'DeleteWatchlist', null, false, id);
                        },
                        ValidateName: function (name) {
                            if (!name) {
                                name = "";
                            }
                            return callService('watchlist', 'ValidateName', { name: name }, true, null, null, function () { });
                        },
                        Rename: function (id, name) {
                            if (!name) {
                                name = "";
                            }
                            return callService('watchlist', 'Rename', { id: id, name: name }, true, null, null, function () { });
                        }
                    },
                    PanelService: {
                        GetUserPanels: function () {
                            return callService('panel', 'GetUserPanels');
                        },
                        GetPanel: function (name) {
                            return callService('panel', 'GetPanel', { name: name }, true);
                        },
                        SavePanel: function (panel) {
                            return callService('panel', 'SavePanel', panel, true);
                        },
                        AddToPanel: function (panelId, personId) {
                            if (angular.isUndefined(personId)) throw 'PersonId must be defined';
                            return callService('panel', 'AddToPanel', { panelId: panelId, personId: personId }, true);
                        },
                        DeletePanel: function (id) {
                            return callService('panel', 'DeletePanel', null, true, id);
                        },
                        GetProviderInPanelsModel: function (id) {
                            return callService('panel', 'GetProviderInPanelsModel', null, false, id);
                        },
                        ValidateName: function (name) {
                            if (!name) {
                                name = "";
                            }
                            return callService('panel', 'ValidateName', { name: name }, true, null, null, function () { });
                        },
                        Rename: function (id, name) {
                            if (!name) {
                                name = "";
                            }
                            return callService('panel', 'Rename', { id: id, name: name }, true, null, null, function () { });
                        }
                    },

                    PersonService: {

                        GetAllPeople: function () {
                            return callService('person', 'GetAllPeople');
                        },
                        GetAllProviders: function (page) {
                            return callService('person', 'GetAllProviders', { page: page });
                        },
                        SearchAllProviders: function (name) {
                            return callService('person', 'SearchAllProviders', { name: name }, true);
                        },
                        SearchAllUsers: function (name) {
                            return callService('person', 'SearchAllUsers', { name: name }, true);
                        },
                        GetMyTeam: function () {
                            return callService('person', 'GetMyTeam');
                        },
                        GetMyTeamAsRefs: function () {
                            return callService('person', 'GetMyTeamAsRefs');
                        },
                        GetAllAuthUsers: function () {
                            return callService('person', 'GetAllAuthUsers');
                        },
                        GetOwnProfile: function () {
                            return callService('person', 'GetOwnProfile');
                        },
                        Get: function (personId) {
                            return callService('person', 'Get', null, false, personId);
                        },
                        SaveProfile: function (profile) {
                            return callService('person', 'SaveProfile', profile, true);
                        },
                        RemovePersonFromTeam: function (personId) {
                            return callService('person', 'RemovePersonFromTeam', null, true, personId);
                        },
                        AddPersonToTeam: function (personId) {
                            return callService('person', 'AddPersonToTeam', null, true, personId);
                        },
                        GetPersonTeam: function (personId) {
                            return callService('person', 'GetPersonTeam', null, false, personId);
                        },
                        GetCompanyChooseTeam: function () {
                            return callService('person', 'GetCompanyChooseTeam', null, false);
                        },
                        GetPersonChooseTeam: function () {
                            return callService('person', 'GetPersonChooseTeam', null, false);
                        },
                        GetMyPersons: function () {
                            return callService('person', 'GetMyPersons');
                        },
                        AddMyPersonNote: function (personId, note) {
                            return callService('person', 'AddMyPersonNote', { PersonId: personId, Note: note }, true);
                        },
                        SetNewPassword: function (model, onErrorCallback) {
                            return callService('person', 'SetNewPassword', model, true, null, null, onErrorCallback);
                        },
                        ActiveProviders: function (count) {
                            return callService('person', 'ActiveProviders', null, false, count);
                        }
                    },

                    CompanyService: {

                        GetOwnCompanyProfile: function () {
                            return callService('company', 'GetOwnCompanyProfile');
                        },
                        GetCompanyProfile: function (companyId) {
                            return callService('company', 'GetCompanyProfile', null, false, companyId);
                        },
                        SaveProfile: function (profile) {
                            return callService('company', 'SaveProfile', profile, true);
                        },
                        GetCompanyTeam: function (companyId) {
                            return callService('company', 'GetCompanyTeam', null, false, companyId);
                        },
                        GetFirmStats: function (companyId) {
                            return callService('company', 'GetFirmStats', null, false, companyId);
                        },
                        GetCompanyStats: function (companyId) {
                            return callService('company', 'GetCompanyStats', null, false, companyId);
                        },
                        GetCompanyUsers: function () {
                            return callService('company', 'GetCompanyUsers', null);
                        },
                        SetUserRate: function (userId, rate) {
                            return callService('company', 'SetUserRate', { userId: userId, rate:rate }, true);
                        },
                        ToggleUserActive: function (userId) {
                            return callService('company', 'ToggleUserActive', null, true, userId);
                        },
                        GetCompanies: function (companyType) {
                            return callService('company', 'GetCompanies', { companyType: companyType }, false);
                        },
                        ActiveClients: function (count) {
                            return callService('company', 'ActiveClients', null, false, count);
                        },
                        SaveUserRoles: function (userId, roles) {
                            return callService('company', 'SaveUserRoles', { userId: userId, roles: roles }, true);
                        }
                    },

                    SearchService: {
                        Search: function (criteria) {
                            return callService('search', 'Search', criteria, true);
                        },
                        GetMarketSummary: function(){
                            return callService('search', 'GetMarketSummary');
                        }
                    },

                    NotificationService: {
                        MarkAllNotificationRead: function() {
                            return callService('notification', 'MarkAllNotificationRead', null, true);
                        },
                        MarkNotificationRead: function (notificationId) {
                            return callService('notification', 'MarkNotificationRead', null, true, notificationId);
                        },

                        GetNotificationsSummary: function () {
                            return callService('notification', 'GetNotificationsSummary', null, false);
                        },

                        GetNotifications: function (model) {
                            return callService('notification', 'GetNotifications', model, true);
                        },
                    },

                    AdminService: {
                        GetUsers: function () {
                            return callService('admin', 'GetUsers', null);
                        },
                        GetCompanies: function () {
                            return callService('admin', 'GetCompanies', null);
                        },
                        ToggleUserActive: function (userId) {
                            return callService('admin', 'ToggleUserActive', null, true, userId);
                        },
                        SetUserRate: function (userId, rate) {
                            return callService('admin', 'SetUserRate', { userId: userId, rate: rate }, true);
                        },
                        GetBriefBoxUsers: function () {
                            return callService('admin', 'GetBriefBoxUsers', null);
                        },
                        GetUserRoles: function (id) {
                            return callService('admin', 'GetUserRoles', null, true, id);
                        },
                        SaveUserRoles: function (userId, roles) {
                            return callService('admin', 'SaveUserRoles', { userId: userId, roles: roles }, true);
                        },
                        GetCompany: function (id) {
                            return callService('admin', 'GetCompany', null, true, id);
                        },
                        SaveCompany: function (company, onErrorCallback) {
                            return callService('admin', 'SaveCompany', company, true, null, null, onErrorCallback);
                        },
                        GetLogs: function (model) {
                            return callService('admin', 'GetLogs', model, true);
                        }
                    },

                    SupportService: {
                        CreateTicket: function (ticket) {
                            return callService('support', 'CreateTicket', ticket, true);
                        }
                    },

                    ReportingService: {
                        GetTeamReport: function () {
                            return callService('reporting', 'GetTeamReport', null);
                        },
                        GetTeamReportByWorkroomsOverTime: function (from, to) {
                            return callService('reporting', 'GetTeamReportByWorkroomsOverTime', { FromDate: from, ToDate: to }, true);
                        },
                        GetInvoiceReport: function (model) {
                            return callService('reporting', 'GetInvoiceReport', model, true);
                        },
                        GetSpendOverview: function (model) {
                            return callService('reporting', 'GetSpendOverview', model, true);
                        },
                        SpendByMonths: function () {
                            return callService('reporting', 'SpendByMonths', null, false);
                        },
                        GetSpendByDay: function (model) {
                            return callService('reporting', 'GetSpendByDay', model, true);
                        },
                        GetSpendByPanels: function (model) {
                            return callService('reporting', 'GetSpendByPanels', model, true);
                        },
                    }
                };
            }
    ])

    //This service should be used where we need to add or remove people from watchlists.
    .factory('watchlistService', ['signalRService', 'apiServices', function (signalRService, apiServices) {

        //The service
        return {
            signalRService: signalRService,

            getWatchlists: function (callback) {
                apiServices.WatchlistService.GetUserWatchlists().then(
                    function (result) { if (callback) callback(result.data); }
                    );
            },

            addToWatchlist: function (watchlistId, personId, callback) {
                apiServices.WatchlistService.AddToWatchlist(watchlistId, personId).then(
                    function (result) { if (callback) callback(result.data); }
                    );
            },

            removeFromWatchlist: function (watchlistId, personId, callback) {
                apiServices.WatchlistService.RemoveFromWatchlist(watchlistId, personId).then(
                    function (result) { if (callback) callback(result.data); }
                    );
            },

            getPanels: function (callback) {
                apiServices.PanelService.GetUserPanels().then(
                    function (result) { if (callback) callback(result.data); }
                    );
            },

            addToPanel: function (watchlistId, personId, callback) {
                apiServices.PanelService.AddToPanel(watchlistId, personId).then(
                    function (result) { if (callback) callback(result.data); }
                    );
            }
        };
    }])

    //Single Text Input Service
    .factory('inputService', ['$modal', function ($modal) {

        function NameInputModalController($scope, $modalInstance, title, multiline, defaultValue, validator, validatorService) {

            $scope.title = title;
            $scope.multiline = multiline;
            $scope.input = defaultValue ? { name: defaultValue } : {};
            $scope.validator = validator;
            $scope.validationMessage = "";
            $scope.ok = function () {

                if (validator) {
                    $scope.validationMessage = "";

                    validatorService.validate(function () { return validator($scope.input.name); }).then(
                        function (data) { //valid
                            $modalInstance.close($scope.input.name);
                        },
                        function (data) { //invalid
                            if (data && data.data && data.data.ExceptionMessage) {
                                $scope.validationMessage = data.data.ExceptionMessage;
                            }
                        }
                    );
                } else {
                    $modalInstance.close($scope.input.name);
                }
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };

        //The service
        return {
            open: function (title, okCallback, cancelCallback, multiline, defaultValue, validator) {
                var modalInstance = $modal.open({
                    templateUrl: '/Partials/Modals/TextInputModal.html',
                    controller: NameInputModalController,
                    resolve: {
                        title: function () { return title; },
                        multiline: function () { return multiline; },
                        validator: function () { return validator; },
                        defaultValue: function () { return defaultValue; }
                    }
                });

                modalInstance.result.then(
                    okCallback,
                    cancelCallback
                );
            },

            error: function (error, callback) {
                var modalInstance = $modal.open({
                    templateUrl: '/Partials/Modals/ErrorModal.html',
                    controller: NameInputModalController,
                    resolve: {
                        title: function () { return error; }
                    }
                });

                modalInstance.result.then(
                    function (a) { callback(); },
                    function (a) { callback(); }
                );
            }
        };
    }])

    .factory("workroomPersonHelpers", function () {
        return {
            findWorkroomPersonById: function (workroomTeam, personId) {
                return workroomTeam.first(function (person) { return person.PersonId === personId; });
            }
        };
    })

    //Confirm Service
    .factory('confirmService', ['$modal', function ($modal) {

        function ConfirmModalController($scope, $modalInstance, title, content, okTitle) {

            $scope.title = title;
            $scope.content = content;
            $scope.okTitle = okTitle;

            $scope.ok = function () {
                $modalInstance.close();
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };

        //The service
        return {
            open: function (title, content, okCallback, cancelCallback, okTitle) {
                var modalInstance = $modal.open({
                    templateUrl: '/Partials/Modals/ConfirmModal.html',
                    controller: ConfirmModalController,
                    resolve: {
                        title: function () { return title; },
                        content: function () { return content; },
                        okTitle: function() {
                            return okTitle == null ? "OK" : okTitle;
                        }
                    }
                });

                modalInstance.result.then(
                    okCallback,
                    cancelCallback
                );
            },

            error: function (error, callback) {
                var modalInstance = $modal.open({
                    templateUrl: '/Partials/Modals/ErrorModal.html',
                    controller: ConfirmModalController,
                    resolve: {
                        title: function () { return "Error occured ..."; },
                        content: function () { return error; }
                    }
                });

                modalInstance.result.then(
                    function (a) { callback(); },
                    function (a) { callback(); }
                );
            }
        };
    }])

    //Popup Service
    .factory('popupService', ['$modal', function ($modal) {

        function ErrorModalController($scope, $modalInstance, title) {
            $scope.title = title;
            $scope.ok = function () {
                $modalInstance.dismiss('cancel');
            };
        };

        function QuickMessageModalController($scope, $modalInstance, signalRService, apiServices, message, userAutoCompleteService) {
            $scope.message = message;
            $scope.message.Attachments = [];

            $scope.cantSend = false;
            $scope.canSelectPerson = message.ToPersonId == null;

            $scope.searchUser = function (term) {
                return userAutoCompleteService.searchUser(term);
            };

            $scope.searchRecepient = "";

            $scope.onSelected = function (item, model, label) {
                $scope.message.ToPersonId = item.Id;
            };

            $scope.canSend = function() {
                return $scope.cantSend != true && $scope.message.ToPersonId != null && ($scope.isUploadingAttachment != true);
            };

            $scope.send = function () {
                $scope.cantSend = true;
                
                apiServices.UserMessageService.QuickMessage(message).then(
                    function () {
                        $scope.confirm = "Message Sent";
                        $modalInstance.dismiss('sent');
                    });
            };
        };

        function MessageToCompanyModalController($scope, $modalInstance, apiServices, message) {
            $scope.message = message;
            $scope.cantSend = false;
            
            $scope.canSend = function () {
                return $scope.cantSend != true;
            };

            $scope.send = function () {
                $scope.cantSend = true;

                apiServices.UserMessageService.SendMessageToCompany(message).then(
                    function () {
                        $scope.confirm = "Message Sent";
                        $modalInstance.dismiss('sent');
                    });
            };
        };

        //The service
        return {
            info: function (title, okCallback) {
                var modalInstance = $modal.open({
                    templateUrl: '/Partials/Modals/InfoModal.html',
                    controller: ErrorModalController,
                    resolve: {
                        title: function () { return title; }
                    }
                });
                modalInstance.result.then(
                    okCallback,
                    okCallback
                );
            },
            error: function (title, okCallback) {
                var modalInstance = $modal.open({
                    templateUrl: '/Partials/Modals/ErrorModal.html',
                    controller: ErrorModalController,
                    resolve: {
                        title: function () { return title; }
                    }
                });
                modalInstance.result.then(
                    okCallback,
                    okCallback
                );
            },

            quickMessage: function (toPersonId, toPersonName, subject, relatedMessageId) {
                return $modal.open({
                    templateUrl: '/Partials/Modals/QuickMessageModal.html',
                    controller: QuickMessageModalController,
                    resolve: { message: function () { return { ToPersonId: toPersonId, ToPersonName: toPersonName, Subject: subject, RelatedMessageId: relatedMessageId }; } }
                });
            },

            messageToCompany: function (toCompanyId, toCompanyName) {
                return $modal.open({
                    templateUrl: '/Partials/Modals/MessageToCompanyModal.html',
                    controller: MessageToCompanyModalController,
                    resolve: { message: function () { return { ToCompanyId: toCompanyId, ToCompanyName: toCompanyName }; } }
                });
            },

            newMessage: function () {
                return $modal.open({
                    templateUrl: '/Partials/Modals/QuickMessageModal.html',
                    controller: QuickMessageModalController,
                    resolve: { message: function () { return {  }; } }
                });
            },
        };
    }])

    //Add Provider Service
    .factory('addProviderService', ['$modal','$rootScope', function ($modal,$rootScope) {

        function AddProviderController($scope, $modalInstance, $q, signalRService, apiServices, watchlistService, providerAutoCompleteService, userAutoCompleteService, panel, isWatchlist) {

            $scope.selectedItem = {};
            $scope.mySearch = null;
            $scope.list = panel.Name;
            $scope.success = false;

            $scope.ok = function () {

                if ($scope.success) {
                    $modalInstance.close($scope.selectedItem);
                }
                else {
                    if (isWatchlist) {
                        watchlistService.addToWatchlist(panel.Id, $scope.selectedItem.Id, function (p) {
                            $scope.success = true;
                            $scope.$apply();
                        });
                    }
                    else {
                        watchlistService.addToPanel(panel.Id, $scope.selectedItem.Id, function (p) {
                            $scope.success = true;
                        });
                    }
                }
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.onSelected = function (item, model, label) {
                $scope.selectedItem = item;
                $scope.mySearch = null;
            }

            $scope.searchProvider = function (term) {

                if (isWatchlist) {
                    return userAutoCompleteService.searchUser(term);
                } else {
                    return providerAutoCompleteService.searchProvider(term);
                }

            };
        };

        return {
            open: function (panel, okCallback, isWatchlist) {

                if (isWatchlist!==true && $rootScope.currentUser.checkRole('CanEditPanels') === false) {
                    return;
                }

                var modalInstance = $modal.open({
                    templateUrl: isWatchlist ? '/Partials/Modals/AddUserModal.html' : '/Partials/Modals/AddProviderModal.html',
                    controller: AddProviderController,
                    resolve: {
                        panel: function () { return panel; },
                        isWatchlist: function () { return isWatchlist; }
                    }
                });

                modalInstance.result.then(
                    okCallback,
                    function () { }
                );
            }
        }
    }])

    //Add Provider Service
    .factory('inviteProviderToBriefService', ['$modal', function ($modal) {

        function AddProviderController($scope, $modalInstance, $q, signalRService, apiServices, providerAutoCompleteService, briefId) {

            $scope.selectedItem = {};
            $scope.list = "brief";
            $scope.mySearch = null;
            $scope.success = false;
            $scope.validationError = null;

            $scope.ok = function () {

                if ($scope.success) {
                    $modalInstance.close($scope.selectedItem);
                }
                else {
                    apiServices.BriefsService.InviteProviderToBrief(briefId, $scope.selectedItem.Id).then(function (p) {
                        $scope.success = true;
                        $scope.validationError = p.statusText != "OK" ? p.statusText : null;
                    });
                }
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.onSelected = function (item, model, label) {
                $scope.selectedItem = item;
                $scope.mySearch = null;
            }

            $scope.searchProvider = function (term) {
                return providerAutoCompleteService.searchProvider(term);
            };
        };

        return {
            open: function (briefId, okCallback) {
                var modalInstance = $modal.open({
                    templateUrl: '/Partials/Modals/AddProviderModal.html',
                    controller: AddProviderController,
                    resolve: {
                        briefId: function () { return briefId; }
                    }
                });

                modalInstance.result.then(
                    okCallback,
                    function () { }
                );
            }
        }
    }])

    //Service that allows to pass data from one controller to another.
    .factory('stateService', [function () {

        var state = [];

        return {
            set: function (name, obj) {
                state[name] = obj;
            },

            get: function (name) {
                var obj = state[name];
                delete state[name];
                return obj;
            },
        };
    }])

    //Dynamic ng-table with default values
    .factory('rsTable', ['ngTableParams', '$filter', function (ngTableParams, $filter) {

        //getData: function to return data for the ng-table
        //sorting: [Optional] object to specify initial sorting
        //objectEquality: [Optional] When true the ng-table is reloaded when getData object equality changes, otherwise on reference change. Set this to true for arrays
        //hidePagination: [Optional] True to hide pagination
        var rsTable = function ($scope, getData, sorting, objectEquality, hidePagination) {

            var tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 25,          // count per page
                sorting: sorting ? sorting : { name: 'asc' }     // initial sorting
            }, {
                counts: hidePagination ? [] : [10, 25, 50, 100], // hide page counts control
                total: 10,
                getData: function ($defer, params) {
                    //NOTE: ng-table has an oddity. I've inserted a fin into Ln 406 of ng-table.js *** if (!settings.$scope) { return; } ***
                    // use build-in angular filter
                    var filteredData = getData();
                    var orderedData = params.sorting() ?
                                        $filter('orderBy')(filteredData, params.orderBy()) :
                                        filteredData;
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });

            $scope.$watch(getData, function () {

                if ($scope.tableParams) {
                    $scope.tableParams.reload();
                    $scope.tableParams.total(getData().length);
                }
                
            }, objectEquality);

            return tableParams;
        };

        return rsTable;
    }])

    //Avatar Upload Service
    .factory('avatarUpload', ['$upload', '$modal', 'apiServices', function ($upload, $modal, apiServices) {

        function cropAvatarController($scope, $modalInstance, title) {
            $scope.title = title;
            $scope.ok = function () {
                $modalInstance.dismiss('cancel');
            };
        };

        var upload = function ($files, userImageType, onSuccess) {

            var modalInstance = $modal.open({
                templateUrl: '/Partials/Modals/CropAvatar.html',
                windowClass: 'b-cropAvatarPopup',
                controller: function ($scope) {

                    $scope.isUploading = true;

                    var file = $files[0];
                    $upload.upload({
                        url: 'api/Upload/UploadImage/' + userImageType,
                        method: 'POST',
                        file: file,
                    }).progress(function (evt) {
                        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function (data, status, headers, config) {

                        $scope.ProfileImage = data.UserImage;
                        $scope.CropOptions = data.CropOptions;
                        $scope.UserImageType = data.UserImageType;

                        if (userImageType == '1') {
                            $scope.modalTitle = 'Please size your Profile Photo';
                        } else {
                            $scope.modalTitle = 'Please size your Company Logo';
                        }


                        $scope.apply = function () {
                            apiServices.UploadService.SaveProfileImage(data).then(function (result) {
                                if (onSuccess) {
                                    // return UserImageModel
                                    onSuccess(result.data);
                                }
                            });

                            modalInstance.dismiss('cancel');
                        };

                        $scope.isUploading = false;
                    });

                    $scope.close = function () {
                        modalInstance.dismiss('cancel');
                    };
                },
            });

        };
        return {
            upload: upload
        };
    }])

    //attachment Upload Service
    .factory('attachmentUpload', ['$upload', function ($upload) {
        var upload = function ($files, onSuccess, onProgress, url, data) {
            if (url == undefined) {
                url = 'api/Upload/Attachment/0';
            }
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $upload.upload({
                    url: url,
                    method: 'POST',
                    file: file,
                    data: data
                }).progress(function (evt) {
                    var p = parseInt(100.0 * evt.loaded / evt.total);
                    if (onProgress) {
                        onProgress(p,file);
                    }
                }).success(function (data, status, headers, config) {
                    if (onSuccess) {
                        onSuccess(data,file);
                    }
                });
            }
        };
        return {
            upload: upload
        };
    }])

    .factory('providerAutoCompleteService', ['apiServices', function (apiServices) {

        //The service
        return {
            searchProvider: function (term) {
                return apiServices.PersonService.SearchAllProviders(term).then(
                    function (response) {
                        return response.data.map(function (item) {
                            return item;
                        });
                    }
                );
            }
        };
    }])

    .factory('userAutoCompleteService', ['apiServices', function (apiServices) {

        //The service
        return {
            searchUser: function (term) {
                return apiServices.PersonService.SearchAllUsers(term).then(
                    function (response) {
                        return response.data.map(function (item) {
                            return item;
                        });
                    }
                );
            }
        };
    }])

    //lookup Provider Service
    .factory('lookupProviderService', ['$modal', function ($modal) {

        function LookupProviderController($scope, $modalInstance, $q, signalRService, apiServices, providerAutoCompleteService, userAutoCompleteService, targetList, allowClients) {

            $scope.selectedItem = {};
            $scope.mySearch = null;
            $scope.list = targetList;

            $scope.ok = function () {
                $modalInstance.close($scope.selectedItem);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.onSelected = function (item, model, label) {
                $scope.selectedItem = item;
                $scope.mySearch = null;
            }

            $scope.searchProvider = function (term) {
                if (allowClients) {
                    return userAutoCompleteService.searchUser(term);
                } else {
                    return providerAutoCompleteService.searchProvider(term);
                }
            };
        };

        return {
            open: function (targetList, okCallback, allowClients) {
                var modalInstance = $modal.open({
                    templateUrl: allowClients ? '/Partials/Modals/AddUserModal.html' : '/Partials/Modals/AddProviderModal.html',
                    controller: LookupProviderController,
                    resolve: {
                        targetList: function () { return targetList; },
                        allowClients: function () { return allowClients; }
                    }
                });

                modalInstance.result.then(
                    okCallback,
                    function () { }
                );
            }
        }
    }])

    .factory('validatorService', function ($q) {
        var validate = function (callback) {
            var deferred = $q.defer();

            //callback here is wrapper around $http.get or $http.post
            callback().then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };

        return {
            validate: validate
        };
    })

    .factory('validationPopupService', ['popupService', function (popupService) {

        return {
            show: function (title, result) {
                var message = title+"\n";

                if (result.ExceptionType === "BriefBox.Business.Validators.Core.ValidationException") {
                    message += "\n" + result.ExceptionMessage;
                } else {
                    if (result.ExceptionType === "System.AggregateException") {
                        if (result.InnerExceptions) {
                            for (var i = 0, len = result.InnerExceptions.length; i < len; i++) {
                                var exception = result.InnerExceptions[0];

                                if (exception.ExceptionType === "BriefBox.Business.Validators.Core.ValidationException") {
                                    message += "\n" + exception.ExceptionMessage;
                                }
                            }
                        }
                        else if (result.InnerException) {
                            var exception = result.InnerException;

                            if (exception.ExceptionType === "BriefBox.Business.Validators.Core.ValidationException") {
                                message += "\n" + exception.ExceptionMessage;
                            }
                        }
                    }
                }
                popupService.error(message, function () { });
            }
        }
    }])
;