function SupportController($scope, $location, $anchorScroll, $modal, $routeParams, $rootScope) {

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

    $scope.isFAQactive = function () {
        if ($scope.isExactActive('/Support')) return true;
        if ($scope.isActive('/Support/FAQ')) return true;
        return false;
    }

    $anchorScroll.yOffset = 50;

    $rootScope.$on('$routeChangeSuccess', function (newRoute, oldRoute) {
        $location.hash($routeParams.scrollTo);
        $anchorScroll();
    });

    $scope.gotoAnchor = function (x) {
        if ($location.hash() !== x) {
            // set the $location.hash to `newHash` and
            // $anchorScroll will automatically scroll to it
            $location.hash(x);
        } else {
            // call $anchorScroll() explicitly,
            // since $location.hash hasn't changed
            $anchorScroll();
        }
    };

    $scope.openModal = function (modalname) {
        $modal.open({
            templateUrl: '/Partials/Modals/' + modalname,
            controller: FAQModalController,
            //resolve: { feedback: function () { return $scope.feedback; } },
            size: 'md'
        });
    }

}

function FAQModalController($scope, $modalInstance) {
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
}

function ContactUsController($scope, $location, apiServices)
{
    $scope.isActive = function (route) {
        var path = $location.path();
        if (Array.isArray(route)) {
            return route.some(function (r) { return path.indexOf(r) == 0; });
        }
        return path.indexOf(route) == 0;
    }

    $scope.currentuser = userData;

    $scope.submitbutton = "Submit";
    $scope.status = 'ready';

    $scope.submit = function () {
        $scope.status = 'submitting'
        $scope.submitbutton = "Submitting..."

        // TODO: Fix this shit.
        //$scope.ticket.Requester = userData.Email;
        //$scope.ticket.Via = { Channel: "Contact Us In-App" }

        $scope.ticket.comment.body += (" - Added by " + userData.Name + " (" + userData.Email + ") from App Supoort")

        apiServices.SupportService.CreateTicket($scope.ticket).then(
                function (b) {
                    $scope.status = 'done';
                });
    };
}