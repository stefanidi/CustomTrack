'use strict';

function WorkroomTermsController($scope, apiServices, ngTableParams) {

    loadWorkroomTerms();

    $scope.tableParams = new ngTableParams({}, {counts: []}); //Remove the ugly page length selector

    $scope.download = function () {
        var doc = new jsPDF();

        doc.fromHTML($('#workroomTermsPdf')[0], 15, 15, {
            
        }, function () {
            doc.save("terms.pdf");
        });
    };

    function loadWorkroomTerms() {

        apiServices.WorkroomService.GetWorkroomTerms($scope.id).then(function (result) {
            $scope.termsModel = result.data;
        });
    };

};