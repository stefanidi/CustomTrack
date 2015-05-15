'use strict';

function WorkroomPaymentsController($scope, $filter, ngTableParams, editableOptions, apiServices, confirmService, signalRService) {

    $scope.isLoading = false;

    // subscribe on changes
    signalRService.bbHub.on('workroomPaymentChanged', function (workroomId) {
        if ($scope.id.toLowerCase() == workroomId.toLowerCase()) {
            refreshData();
        }
    });

    $scope.data = {};
    $scope.setClientAccountsPayableEmailModel = { WorkroomId: $scope.id };
    $scope.activeInvoiceDisputeNumber = null;

    refreshData(null, function (data) {
        $scope.invoiceClientTableParams = getNgTableParams('Invoices');
        $scope.invoiceProviderTableParams = getNgTableParams('Invoices');
        $scope.disputesTableParams = getNgTableParams('Disputes');
        $scope.paymentsTableParams = getNgTableParams('Payments');
    });


    function getNgTableParams(data) {
        return new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                name: 'asc'     // initial sorting
            }
        }, {
            counts: [],
            total: $scope.data[data].length, // length of data
            getData: function ($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ?
                                    $filter('orderBy')($scope.data[data], params.orderBy()) :
                                    $scope.data[data];
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    }

    function refreshTableParams() {
        $scope.invoiceClientTableParams.reload();
        $scope.invoiceProviderTableParams.reload();
        $scope.disputesTableParams.reload();
        $scope.paymentsTableParams.reload();
    }
    
    function refreshData(d, onSuccess) {
        if (d == null) {

            // prevent multiple loading while previos loading not completed
            if ($scope.isLoading) {
                return;
            }

            $scope.isLoading = true;
            apiServices.WorkroomService.GetPaymentModel($scope.id).then(function (result) {
                $scope.isLoading = false;
                $scope.data = result.data;
                if ($scope.setClientAccountsPayableEmailModel.Email == null) {
                    $scope.setClientAccountsPayableEmailModel.Email = result.data.ClientAccountsPayableEmail;
                }
                if (onSuccess) {
                    onSuccess($scope.data);
                } else {
                    refreshTableParams();
                }
            });
        } else {
            $scope.data = d;
            if (onSuccess) {
                onSuccess($scope.data);
            } else {
                refreshTableParams();
            }
        }
    }

    $scope.addInvoiceDisputeCommentModel = {};

    $scope.addInvoiceDisputeComment = function (invoice, form) {
        $scope.addInvoiceDisputeCommentModel.WorkroomId = $scope.id;
        $scope.addInvoiceDisputeCommentModel.InvoiceNumber = invoice.Number;
        invoice.isAddingDisputeCommentNow = true;
        apiServices.WorkroomService.AddWorkroomPaymentInvoiceDisputeComment($scope.addInvoiceDisputeCommentModel).then(function (result) {
            refreshData(result.data);
            invoice.popupDispute = false;
            if (form) {
                form.reset();
            }
            invoice.isAddingDisputeCommentNow = false;
            $scope.activeInvoiceDisputeNumber = invoice.Number;
            $scope.addInvoiceDisputeCommentModel = {};
        });
    };

    // add invouce part:
    // 

    function initAddInvoiceModel() {
        $scope.addInvoiceModel = {
            WorkroomId: $scope.id,
            Title: '',
            ProviderRef: '',
            ClientRef: '',
            TotalAmount: null,
            Invoice: {}
        };
    };

    initAddInvoiceModel();


    $scope.addInvoice = function (createInvoice) {
        // validate that invoice uploaded
        if ($scope.addInvoiceModel.Invoice.Attachment == null) {
            $scope.addInvoiceModel.invoiceRequired = true;
            return;
        }
        $scope.isCreateInvoiceDisabled = true;
        apiServices.WorkroomService.AddWorkroomPaymentInvoice($scope.addInvoiceModel).then(function (result) {
            initAddInvoiceModel();
            createInvoice.reset();
            refreshData(result.data);
            $scope.isCreateInvoiceDisabled = false;
        });
    };
    // end add invoice part

    // change invoice status part:
    $scope.setStatus = function (invoice, status, $event) {
        var confirmInfo = {
            needConfirm: false,
            title: '',
            message: '',
            okTitle: 'OK'
        };

        if (status == 'Paid') {
            confirmInfo.needConfirm = true;
            confirmInfo.title = 'Confirm Payment?';
            confirmInfo.message = 'Click OK to confirm Payment.';
        }

        if (status == 'PendingPayment') {

            confirmInfo.needConfirm = true;
            confirmInfo.okTitle = 'Pay';

            if ($scope.data.ClientAccountsPayableEmail) {
                confirmInfo.title = 'Confirm Payment?';
                confirmInfo.message = "Mark this invoice for payment?";
            } else {
                confirmInfo.title = 'Confirm Payment?';
                confirmInfo.message = "You have not entered 'accounts payable' email; Continue?";
            }
        }

        invoice.isChangingStatusNow = true;
        var setNewStatus = function () {
            apiServices.WorkroomService.ChangeWorkroomPaymentInvoiceState({ WorkroomId: $scope.id, InvoiceNumber: invoice.Number, State: status }).then(function (result) {
                refreshData(result.data);
                invoice.isChangingStatusNow = false;
            });
        };

        if (confirmInfo.needConfirm) {
            confirmService.open(confirmInfo.title, confirmInfo.message, setNewStatus, function() {
                invoice.isChangingStatusNow = false;
            }, confirmInfo.okTitle);
        } else {
            setNewStatus();
        }
    };


    // load terms to have billing info:
    function loadWorkroomTerms() {

        apiServices.WorkroomService.GetWorkroomTerms($scope.id).then(function (result) {
            $scope.termsModel = result.data;
        });
    };
    loadWorkroomTerms();

    $scope.toggleActiveInvoiceDisputeNumber = function (invoice) {
        if (invoice.Number == $scope.activeInvoiceDisputeNumber) {
            $scope.activeInvoiceDisputeNumber = null;
        } else {
            $scope.activeInvoiceDisputeNumber = invoice.Number;
        }
    };

    // Set Client Accounts Payable Email Part:
    $scope.setClientAccountsPayableEmail = function () {
        $scope.isSetClientAccountsPayableEmail = true;
        apiServices.WorkroomService.SetClientAccountsPayableEmail($scope.setClientAccountsPayableEmailModel).then(function (result) {
            refreshData(result.data);
            $scope.isSetClientAccountsPayableEmail = false;
        });
        
    };
};