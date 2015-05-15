'use strict';
/* Directives */


angular.module('bbApp.directives', [])
    .directive('personActions', function () {
        return {
            restrict: 'A',
            scope: {
                person: '=person',
                panel: '=panel'
            },
            controller: function ($scope, $element, $attrs, $modal, $rootScope) {
                $element.on('click', function () {

                    //if add to panel function opened and current user do not have edit panels role - do nothing
                    if ($scope.panel && $rootScope.currentUser.checkRole('CanEditPanels') == false) {
                        return;
                    }

                    var modalInstance = $modal.open({
                        templateUrl: '/Partials/Modals/AddToWatchlistModal.html',
                        controller: AddToWatchlistModalController,
                        resolve: {
                            person: function () { return $scope.person; },
                            panel: function () { return $scope.panel; }
                        }
                    });
                });
            },
        };
    })

    .directive('datepickerPopup', function (dateFilter, datepickerPopupConfig) {
        return {
            restrict: 'A',
            priority: 1,
            require: 'ngModel',
            link: function (scope, element, attr, ngModel) {
                var dateFormat = attr.datepickerPopup || datepickerPopupConfig.datepickerPopup;
                ngModel.$formatters.push(function (value) {
                    return dateFilter(value, dateFormat);
                });
            }
        }
    })
    .directive("datepickerUtcDate", function () {

        var linkFunction = function (scope, element, attrs, ngModelCtrl) {

            ngModelCtrl.$parsers.push(function (datepickerValue) {
                return moment(datepickerValue).format("YYYY-MM-DD");
            });
        };

        return {
            restrict: "A",
            require: "ngModel",
            link: linkFunction
        };
    })
    .directive('workroomPerson', function () {
        return {
            restrict: 'A',
            templateUrl: "/Partials/Directives/WorkroomPerson.html",
            scope: {
                getWorkroomPromise: '=',
                personId: '='
            },
            controller: function ($scope, $element, $attrs, workroomPersonHelpers) {
                $scope.getWorkroomPromise.then(function(result) {
                    $scope.person = workroomPersonHelpers.findWorkroomPersonById(result.WorkroomTeam, $scope.personId);
                });
            },
        };
    })

    .directive('viewProviderBrief', function () {
        return {
            restrict: 'A',
            scope: {
                brief: '=brief'
            },
            controller: function ($scope, $element, $attrs, $modal, apiServices) {
                $element.on('click', function () {

                    var briefId = $scope.brief;
                    var modalInstance = $modal.open({
                        templateUrl: '/Partials/Provider/ViewBrief.html',
                        controller: function ($scope, $modalInstance, apiServices) {

                            $scope.brief = {};

                            $scope.back = function () {
                                $modalInstance.close();
                            };

                            apiServices.BriefsService.GetProviderBrief(briefId).then(
                                    function (b) {
                                        $scope.brief = b.data;
                                    });
                        },
                        size: 'lg',
                        windowClass: 'viewBriefPopup' //To align the ViewBrief.html in the popup.
                    });
                });
            },
        };
    })

    .directive('viewBrief', function () {
        return {
            restrict: 'A',
            scope: {
                brief: '=brief'
            },
            controller: function ($scope, $element, $attrs, $modal, apiServices) {
                $element.on('click', function () {

                    var briefId = $scope.brief;
                    var modalInstance = $modal.open({
                        templateUrl: '/Partials/Engage/ViewBrief.html',
                        controller: function ($scope, $modalInstance, apiServices) {

                            $scope.brief = {};

                            $scope.back = function () {
                                $modalInstance.close();
                            };

                            apiServices.BriefsService.GetClientBrief(briefId).then(
                                    function (b) {
                                        $scope.brief = b.data;
                                    });
                        },
                        size: 'lg',
                        windowClass: 'viewBriefPopup' //To align the ViewBrief.html in the popup.
                    });
                });
            },
        };
    })

    .directive('viewPitch', function () {
        return {
            restrict: 'A',
            scope: {
                proposal: '=proposal',
                brief: '=brief'
            },
            controller: function ($scope, $element, $attrs, $modal, apiServices, rsTable) {
                var brief = $scope.brief;
                var proposal = $scope.proposal;
                $element.on('click', function () {
                    var modalInstance = $modal.open({
                        templateUrl: '/Partials/Directives/PitchPreview.html',
                        size: 'lg',
                        windowClass: 'viewPitchPopup', //To align the ViewBrief.html in the popup.
                        controller: function ($scope) {
                            $scope.cancel = function () {
                                modalInstance.dismiss('cancel');
                            };

                            $scope.proposal = proposal;
                            $scope.brief = brief;

                            apiServices.BriefsService.GetClientBriefStats($scope.brief.PostedBy.Id).then(function (result) {
                                $scope.clientBriefStats = result.data;
                            });

                            $scope.teamTableParams = rsTable($scope, function () { return $scope.proposal?$scope.proposal.Team:[]; }, {}, true, true, true);
                        },
                    });
                });
            },
        };
    })

    .directive('cropImage', function () {
        return {
            restrict: 'A',
            //scope: {
            //    ProfileImage: '=profileImage',
            //    CropOptions: '=cropOptions'
            //},
            templateUrl: "/Partials/Directives/CropImage.html",
            controller: function ($scope, $element) {
                var destImg = $($element).find(".cropimage");
                destImg.attr('src', $scope.ProfileImage.NormalUrl);
                destImg.cropbox({
                    width: $scope.CropOptions.Width,
                    height: $scope.CropOptions.Height
                }).on('cropbox', function (event, results, img) {
                    $scope.CropOptions.x = results.cropX;
                    $scope.CropOptions.y = results.cropY;
                    $scope.CropOptions.Width = results.cropW;
                    $scope.CropOptions.Height = results.cropH;
                });
            },
        };
    })

    .directive('attachmentsManagment', function () {
        return {
            restrict: 'A',
            scope: {
                attachmentsContainer: '=',
                isOwn: '=isOwn',
                addOnly: '=addOnly',
                isUploading: '='
            },
            templateUrl: "/Partials/Directives/AttachmentsManagment.html",
            controller: function ($scope, attachmentUpload) {

                $scope.$watch("attachmentsContainer.Attachments", function (newValue, oldValue) {
                    $scope.uploadingAttachments = [];
                });

                $scope.uploadingAttachments = [];

                $scope.hideUploading = function (value) {
                    return value.isNew !== true;
                };

                $scope.canDeleteAttachment = function (attachment) {
                    return $scope.isOwn && (attachment.isNew || !$scope.addOnly);
                }

                // click to upload new file
                $scope.onFileSelect = function ($files) {
                    $scope.isUploading = true;
                    var file = $files[0];

                    var uploadingAttachment = {
                        FileName: file.name,
                        UploadProgress: 0,
                        Attachment: null
                    };
                    $scope.uploadingAttachments.push(uploadingAttachment);

                    attachmentUpload.upload($files, function (data) {
                        uploadingAttachment.Attachment = data[0];
                        uploadingAttachment.Attachment.isNew = true;
                        $scope.attachmentsContainer.Attachments.push(uploadingAttachment.Attachment);
                        $scope.isUploading = false;
                    }, function (p) {
                        uploadingAttachment.UploadProgress = p;
                    });
                };

                $scope.removeAttachment = function (attachment) {
                    if ($scope.canDeleteAttachment(attachment)) {
                        $scope.attachmentsContainer.Attachments.remove(attachment);
                    }
                };

                $scope.removeNewAttachment = function (attachment) {
                    $scope.attachmentsContainer.Attachments.remove(attachment.Attachment);
                    $scope.uploadingAttachments.remove(attachment);
                };

            },
        };
    })

    .directive('singleAttachmentUpload', function () {
        return {
            restrict: 'A',
            scope: {
                attachmentContainer: '=attachmentContainer',
                btnTitle: '@',
                overrideFileName: '@'
            },
            templateUrl: "/Partials/Directives/singleAttachmentUpload.html",
            controller: function ($scope, attachmentUpload) {
                $scope.btnTitle = $scope.btnTitle == null ? "Add attachment" : $scope.btnTitle;
                $scope.isUploading = false;

                // click to upload new file
                $scope.onFileSelect = function ($files) {
                    $scope.isUploading = true;
                    attachmentUpload.upload($files, function (data) {
                        $scope.attachmentContainer.Attachment = data[0];
                        $scope.isUploading = false;
                    });
                };

                $scope.removeAttachment = function () {
                    $scope.attachmentContainer.Attachment = null;
                };
            },
        };
    })

    .directive('singleAttachment', function () {
        return {
            restrict: 'A',
            scope: {
                attachmentContainer: '=attachmentContainer',
                isOwn: '=isOwn'
            },
            templateUrl: "/Partials/Directives/SingleAttachment.html",
            controller: function ($scope, attachmentUpload) {
                $scope.uploadingAttachment = null;

                // click to upload new file
                $scope.onFileSelect = function ($files) {
                    $scope.uploadingAttachment = {
                        FileName: $files[0].name,
                        UploadProgress: 0
                    };
                    attachmentUpload.upload($files, function (data) {
                        $scope.uploadingAttachment = null;
                        $scope.attachmentContainer.Attachment = data[0];
                    }, function (p) {
                        $scope.uploadingAttachment.UploadProgress = p;
                    });
                };

                $scope.removeAttachment = function () {
                    $scope.attachmentContainer.Attachment = null;
                };
            },
        };
    })

    .directive('personAvatar', function () {
        return {
            restrict: 'A',
            scope: {
                person: '=person'
            },
            templateUrl: "/Partials/Person/Avatar.html"
        };
    })

    .directive('companyAvatar', function () {
        return {
            restrict: 'A',
            scope: {
                company: '=company',
                displayName: '=displayName'
            },
            templateUrl: "/Partials/Person/CompanyAvatar.html"
        };
    })

    .directive('companyAvatarShort', function () {
        return {
            restrict: 'A',
            scope: {
                avatar: '=avatar',
                displayName: '=displayName'
            },
            templateUrl: "/Partials/Person/CompanyAvatarShort.html"
        };
    })

    .directive('quickMessage', ['popupService', function () {

        function QuickMessageController($scope, popupService) {
            if ($scope.text == null && $scope.isEmptyText !== true) {
                $scope.text = 'Message';
            }
            $scope.quickMessage = function () {
                popupService.quickMessage($scope.id, $scope.name, $scope.subject, $scope.relatedMessageId);
            };
        };

        return {
            restrict: 'AE',
            scope: {
                id: '=id',
                name: '=name',
                subject: '=subject',
                relatedMessageId: '=relatedMessageId',
                isButton: '=?', /*when true, this will display a button otherwise as a link*/
                text: '=?',
                isProfile: '=?',
                isEmptyText: '=?'
            },
            templateUrl: "/Partials/Directives/QuickMessageTemplate.html",
            controller: QuickMessageController
        };
    }])

    //autoFocus - Causes the element to be focused after loading.
    .directive('autoFocus', function ($timeout) {
        return {
            restrict: 'AC',
            link: function (_scope, _element) {
                $timeout(function () {
                    _element[0].focus();
                }, 10);
            }
        };
    })

    //Dollar Value will let 3,544.00 or 3544 or 3544.00
    .directive('dollarValue', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                var FLOAT_REGEXP = /^(\d{1,3}(\,\d{3})*|(\d+))(\.\d{2})?$/;
                ctrl.$parsers.unshift(function (viewValue) {

                    if (!viewValue) {
                        ctrl.$setValidity('dollar', true);
                        return viewValue;
                    }

                    if (FLOAT_REGEXP.test(viewValue)) {
                        ctrl.$setValidity('dollar', true);
                        return parseFloat(viewValue.replace(',', ''));
                    } else {
                        ctrl.$setValidity('dollar', false);
                        return undefined;
                    }
                });
            }
        }
    })

    //Multiselect
    .directive('multiselectDropdown', [function () {
        return {
            scope: { selectedModel: '=ngModel', multiselectDropdown: '=', multiselectOptions: '=?' },
            link: function (scope, element, attributes) {

                element = $(element[0]); // Get the element as a jQuery element

                // Below setup the dropdown:
                scope.multiselectOptions = scope.multiselectOptions || { maxHeight: 200 };
                element.multiselect(scope.multiselectOptions);

                // Watch for any changes to the length of our select element
                scope.$watch(function () {
                    return element[0].length;
                }, function () {
                    setTimeout(function () {
                        element.multiselect('rebuild');
                    }, 0);

                });

                // Watch for any changes from outside the directive and refresh
                scope.$watch('selectedModel', function (n, v) {
                    setTimeout(function () {
                        element.multiselect('refresh');
                    }, 0);
                });

                // Watch for any changes of the underlying data and clear previous selections
                scope.$watch('multiselectDropdown', function () {
                    //Clear selection from previous data
                    //if (scope.selectedModel && angular.isArray(scope.selectedModel)) {
                    //    scope.selectedModel.length = 0;
                    //}
                });

                // Below maybe some additional setup
            }
        }
    }])

    //Skills Select - Post  A Brief
    .directive('skillsSelect', ['categorySkills', '$timeout', function (categorySkills, $timeout) {
        return {
            scope: { skillsSelect: '=', selectedModel: '=ngModel' },
            link: function ($scope, element, attributes) {

                $scope.$watch('selectedModel', function (value) {
                    var skills = categorySkills[value];
                    $timeout(function() {
                        $scope.skillsSelect = skills ? skills : [];
                    });
                });
            }
        }
    }])

    //TODO:Not Used!!! Remove!!!
    .directive('showMore', ['$transition', function ($transition) {

        return {
            link: function (scope, element, attrs) {

                var initialAnimSkip = true;
                var currentTransition;
                var p = element.find(">p");
                function doTransition(change) {
                    var newTransition = $transition(p, change);
                    if (currentTransition) {
                        currentTransition.cancel();
                    }
                    currentTransition = newTransition;
                    newTransition.then(newTransitionDone, newTransitionDone);
                    return newTransition;

                    function newTransitionDone() {
                        // Make sure it's this transition, otherwise, leave it alone.
                        if (currentTransition === newTransition) {
                            currentTransition = undefined;
                        }
                    }
                }

                function expand() {
                    if (initialAnimSkip) {
                        initialAnimSkip = false;
                        expandDone();
                    } else {
                        p.removeClass('collapse').addClass('collapsing');
                        doTransition({ height: p[0].scrollHeight + 'px' }).then(expandDone);
                    }
                }

                function expandDone() {
                    p.removeClass('collapsing');
                    p.addClass('collapse in');
                    p.css({ height: 'auto' });
                }

                function collapse() {
                    if (initialAnimSkip) {
                        initialAnimSkip = false;
                        collapseDone();
                        p.css({ height: attrs.minHeight });
                    } else {
                        // CSS transitions don't work with height: auto, so we have to manually change the height to a specific value
                        p.css({ height: element[0].scrollHeight + 'px' });
                        //trigger reflow so a browser realizes that height was updated from auto to a specific value
                        var x = p[0].offsetWidth;

                        p.removeClass('collapse in').addClass('collapsing');

                        doTransition({ height: attrs.minHeight }).then(collapseDone);
                    }
                }

                function collapseDone() {
                    p.removeClass('collapsing');
                    p.css({ height: attrs.minHeight });
                }

                function checkOverflow() { //Not Needed
                    if (p[0].offsetHeight < p[0].scrollHeight) {
                        element.find(">a").show();
                    } else {
                        element.find(">a").hide();
                    }
                }

                scope.$watch(attrs.flag, function (shouldExpand) {
                    if (shouldExpand) {
                        expand();
                    } else {
                        collapse();
                    }
                });

                scope.$watch(attrs.content, function () {
                    checkOverflow();
                });
            }
        };
    }])

    //Add a "More"/"Less" link at the bottom 
    .directive('readMore', function () {
        return {
            scope: { maxHeight: '=?', heightMargin: '=?', alwaysExpander: '=?' },
            priority: 99,
            link: function (scope, element, attrs) {
                element.readmore({
                    maxHeight: scope.maxHeight,
                    heightMargin: scope.heightMargin,
                    alwaysExpander: scope.alwaysExpander,
                    expandedHeight: 'auto',
                    moreLink: '<a href="javascript:;">More ▼</a>',
                    lessLink: '<a href="javascript:;">Less ▲</a>',
                });
            }
        };
    })

    //Slider Directive - Used for dynamically loading items in the slider
    .directive('reloadSliderOn', function () {
        return {
            link: function (scope, element, attributes) {

                //The slider width will not load correctly if the items are dynamically populated as this script is 
                //executed on document load in imageslider.js So this directive is replacement for that to load after data for dynamic repeat is populated.

                //This directive will watch the internal gallery items and reload as needed

                scope.$watch(function () { return $(".gallery__item").length; }, resetSlider);

                function resetSlider() {

                    // Fancybox specific
                    $(".gallery__link").fancybox({
                        'titleShow': false,
                        'transitionIn': 'elastic',
                        'transitionOut': 'elastic'
                    });

                    // Set general variables
                    // ====================================================================

                    var itemWidth = $(".gallery__item").first().outerWidth(true);
                    var totalWidth = $(".gallery__item").length * itemWidth; //width of all the items we want to scroll

                    $(".gallery").width(totalWidth + 1);// Set the gallery width to the totalWidth. This allows all items to be on one line. +1 seems to solve edge case scenarios due to scaling
                    $(".gallery").animate({ left: 0 }); //Scroll to start if data changes


                    //Double click protection
                    var scrollQueueNext = 0;
                    var scrollQueuePrev = 0;

                    // When the prev button is clicked
                    // ====================================================================
                    $(".gallery__controls-prev").unbind("click");
                    $(".gallery__controls-prev").click(function () {

                        //logPos();

                        var scrolled = $(".gallery-wrap").offset().left - $(".gallery").offset().left;

                        if ((scrolled - itemWidth) <= 0) {
                            $(".gallery").animate({ left: 0 });
                        }
                        else {
                            //Stop overscroll
                            if ((scrolled - (itemWidth * scrollQueuePrev)) <= 0) return;
                            scrollQueuePrev++;

                            $(".gallery").animate({ left: '+=' + itemWidth }, { complete: function () { scrollQueuePrev--; } });
                        }
                    });

                    // When the next button is clicked
                    // ====================================================================
                    $(".gallery__controls-next").unbind("click");
                    $(".gallery__controls-next").click(function () {

                        var scrolled = $(".gallery-wrap").offset().left - $(".gallery").offset().left; //my scroll position so far
                        var maxScroll = $(".gallery__item").length * itemWidth - $(".gallery-wrap").outerWidth();

                        if ((scrolled + (itemWidth * (scrollQueueNext + 1))) >= maxScroll) return;
                        scrollQueueNext++;

                        $(".gallery").animate({ left: '-=' + itemWidth }, { complete: function () { scrollQueueNext--; } });
                        console.log('scroll');
                    });
                };
            }
        }
    })

    //min-value validator; for now validates only Date values
    .directive('minValue', function () {
        return {
            require: 'ngModel',

            link: function (scope, elem, attr, ngModel) {

                scope.$watch(attr.minValue, function () {
                    if (ngModel.$viewValue) {
                        ngModel.$setViewValue(ngModel.$viewValue);

                        var value = ngModel.$viewValue;
                        var minValue = scope.$eval(attr.minValue);

                        if (!value || !minValue) {
                            ngModel.$setValidity('minValue', true);
                            return;
                        }

                        if (typeof minValue === "string") {
                            minValue = minValue.replace(/"/g, "");
                        }

                        minValue = (new XDate(minValue)).toDate();
                        value = (new XDate(value)).toDate();

                        if (attr.minValueExclusive) {
                            ngModel.$setValidity('minValue', value > minValue);
                        } else {
                            ngModel.$setValidity('minValue', value >= minValue);
                        }
                        
                    }
                });

                if (attr.ngDisabled) {
                    scope.$watch(attr.ngDisabled, function () {
                        if (ngModel.$viewValue) ngModel.$setViewValue(ngModel.$viewValue);
                    });
                }
                //For DOM -> model validation
                ngModel.$parsers.unshift(function (value) {

                    if (elem.attr("disabled") || elem.attr("readonly") || (attr.ngDisabled && scope.$eval(attr.ngDisabled))) {
                        ngModel.$setValidity('minValue', true);
                        return value;
                    }

                    var minValue = scope.$eval(attr.minValue);

                    if (!value || !minValue) {
                        ngModel.$setValidity('minValue', true);
                        return value;
                    }

                    if (typeof minValue === "string") {
                        minValue = minValue.replace(/"/g, "");
                    }

                    minValue = (new XDate(minValue)).toDate();
                    value = (new XDate(value)).toDate();
                    if (attr.minValueExclusive) {
                        ngModel.$setValidity('minValue', value > minValue);
                    } else {
                        ngModel.$setValidity('minValue', value >= minValue);
                    }

                    return value;
                });

                //For model -> DOM validation
                ngModel.$formatters.unshift(function (value) {

                    if (elem.attr("disabled") || elem.attr("readonly") || (attr.ngDisabled && scope.$eval(attr.ngDisabled))) {
                        ngModel.$setValidity('minValue', true);
                        return value;
                    }

                    var minValue = scope.$eval(attr.minValue);

                    if (!value || !minValue) {
                        ngModel.$setValidity('minValue', true);
                        return value;
                    }

                    if (typeof minValue === "string") {
                        minValue = minValue.replace(/"/g, "");
                    }

                    minValue = (new XDate(minValue)).toDate();
                    value = (new XDate(value)).toDate();

                    if (attr.minValueExclusive) {
                        ngModel.$setValidity('minValue', value > minValue);
                    } else {
                        ngModel.$setValidity('minValue', value >= minValue);
                    }
                    return value;
                });
            }
        };
    })

    //max-value validator; for now validates only Date values
    .directive('maxValue', function () {
        return {
            require: 'ngModel',

            link: function (scope, elem, attr, ngModel) {

                scope.$watch(attr.maxValue, function () {
                    if (ngModel.$viewValue) {
                        ngModel.$setViewValue(ngModel.$viewValue);

                        //re-evaluate validation
                        var value = ngModel.$viewValue;
                        var maxValue = scope.$eval(attr.maxValue);

                        if (!value || !maxValue) {
                            ngModel.$setValidity('maxValue', true);
                            return;
                        }

                        if (typeof maxValue === "string") {
                            maxValue = maxValue.replace(/"/g, "");
                        }

                        maxValue = (new XDate(maxValue)).toDate();
                        value = (new XDate(value)).toDate();

                        if (attr.maxValueExclusive) {
                            ngModel.$setValidity('maxValue', value < maxValue);
                        } else {
                            ngModel.$setValidity('maxValue', value <= maxValue);
                        }

                    }
                });

                //For DOM -> model validation
                ngModel.$parsers.unshift(function (value) {

                    var maxValue = scope.$eval(attr.maxValue);

                    if (!value || !maxValue) {
                        ngModel.$setValidity('maxValue', true);
                        return value;
                    }

                    if (typeof maxValue === "string") {
                        maxValue = maxValue.replace(/"/g, "");
                    }

                    maxValue = (new XDate(maxValue)).toDate();
                    value = (new XDate(value)).toDate();

                    if (attr.maxValueExclusive) {
                        ngModel.$setValidity('maxValue', value < maxValue);
                    } else {
                        ngModel.$setValidity('maxValue', value <= maxValue);
                    }
                    return value;
                });

                //For model -> DOM validation
                ngModel.$formatters.unshift(function (value) {

                    var maxValue = scope.$eval(attr.maxValue);

                    if (!value || !maxValue) {
                        ngModel.$setValidity('maxValue', true);
                        return value;
                    }

                    if (typeof maxValue === "string") {
                        maxValue = maxValue.replace(/"/g, "");
                    }

                    maxValue = (new XDate(maxValue)).toDate();
                    value = (new XDate(value)).toDate();

                    if (attr.maxValueExclusive) {
                        ngModel.$setValidity('maxValue', value < maxValue);
                    } else {
                        ngModel.$setValidity('maxValue', value <= maxValue);
                    }
                    return value;
                });
            }
        };
    })

    .directive('timezoneSelector', function () {

        function timezoneSelectorController($scope, $interval) {

            $scope.now = null;

            $scope.zones = [
                { name: "Sydney", momentTz: "Australia/Sydney" },
                { name: "Brisbane", momentTz: "Australia/Brisbane" },
                { name: "Melbourne", momentTz: "Australia/Melbourne" },
                { name: "Canberra", momentTz: "Australia/Canberra" },
                { name: "Adelaide", momentTz: "Australia/Adelaide" },
                { name: "Perth", momentTz: "Australia/Perth" },
                { name: "Darwin", momentTz: "Australia/Darwin" },
                { name: "Hobart", momentTz: "Australia/Hobart" }
            ];

            $scope.zone = $scope.zones[0];

            $scope.selectZone = function (zone) {
                $scope.zone = zone;
            };

            $scope.refresh = function () {
                var now = moment().tz($scope.zone.momentTz).format("h:mm A");
                $scope.now = now;
            };

            $scope.refresh();

            var intervalPromise = $interval($scope.refresh, 1000);

            $scope.$on('$destroy', function () { $interval.cancel(intervalPromise); });
        };

        return {
            restrict: 'E',
            scope: {},
            templateUrl: "/Partials/TimezoneSelector.html",
            controller: timezoneSelectorController
        };
    })

    .directive('auMap', function () {
        return {
            restrict: 'EA',
            scope: { auMap: '=' },
            link: function ($scope, $element, $attrs) {

                if ($scope.auMap) {
                    loadDataIntoMap($scope.auMap);
                }
                else {
                    $scope.$watch('auMap', function () {
                        if ($scope.auMap) {
                            loadDataIntoMap($scope.auMap);
                        }
                    });
                }

                function loadDataIntoMap(data) {
                    var pitchData = {
                        "AU-ACT": data.ACT || 0,
                        "AU-WA": data.WA || 0,
                        "AU-TAS": data.TAS || 0,
                        "AU-VIC": data.VIC || 0,
                        "AU-NT": data.NT || 0,
                        "AU-QLD": data.QLD || 0,
                        "AU-SA": data.SA || 0,
                        "AU-NSW": data.NSW || 0
                    };

                    $element.vectorMap({
                        map: 'au_mill_en',
                        backgroundColor: '#E3F6F8',
                        zoomButtons: false,
                        series: {
                            regions: [{
                                values: pitchData,
                                scale: ['#75D3DA', '#00ADBB'],
                                normalizeFunction: 'polynomial'
                            }]
                        },
                        onRegionLabelShow: function (e, el, code) {
                            el.html(el.html() + ' (' + $attrs["mapEntity"] + ' - ' + pitchData[code] + ')');
                        }
                    });
                }

            },//End Controller
        };
    })

    .directive('stopEvent', function () {
        return {
            //restrict: 'A',
            link: function (scope, element, attr) {
                element.bind(attr.stopEvent, function (e) {
                    e.stopPropagation();
                });
            }
        };
    })

    .directive('keyEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.keyEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })
;



//################## Helper Functions ##################

//Returns true if the string has the substring
String.prototype.contains = function (it) {
    return this.indexOf(it) != -1;
};

//Returns true if array contains the specified element
Array.prototype.contains = function (it) {
    return this.indexOf(it) != -1;
};

//Removes Item from an array
Array.prototype.remove = function (item) {
    var index = this.indexOf(item);
    if (index > -1) {
        this.splice(index, 1);
        this.remove(item);//Make sure we remove all of same item
    }
};

Array.prototype.first = function (filter) {
    var result = $.grep(this, filter);
    if (result.length == 0) {
        // not found
    }/*
    else if (result.length == 1) {
        // access the foo property using result[0].foo
    }*/
    else {
        // multiple items found

        //return first
        return result[0];
    }
}
