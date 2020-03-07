myApp.controller('nbfcController', ['busyNotificationService', '$timeout', '$scope', '$uibModal', '$filter', '$location', '$window', '$rootScope', '$state', 'appConstants', 'localconfig', 'serverconfig', 'config', 'modalService', '$stateParams', 'lmsService',
    function (busyNotificationService, $timeout, $scope, $uibModal, $filter, $location, $window, $rootScope, $state, appConstants, localconfig, serverconfig, config, modalService, $stateParams, lmsService) {
        $scope.allowPersonalProfileUpdate = false;
        var appEnvironment = '';
        var data = {};
		$scope.nbfc = true;
        $scope.stateAction = "nbfc";
        function initialize() {
            console.log("inside initialize");
            if ($rootScope.globals == undefined) {
                $state.go("login");
            }
            $rootScope.bodylayout = '';
            $scope.appConstants = appConstants;
            if (APP_ENVIRONMENT === config.ENVIRONMENT_LOCAL) {
                appEnvironment = localconfig;
            } else if (APP_ENVIRONMENT === config.ENVIRONMENT_SERVER) {
                appEnvironment = serverconfig;
            }
            $scope.updateUserPassword = "";
            $scope.userPassword = "";
            $scope.addNbfc = {};
            $scope.mfDetails = [];
            $scope.nbfcDetailsList = [];
            $scope.allowUpdateBasicInfo = false;
            $scope.allowNbfc = true;
            $scope.fetchNbfcDetails();
            $scope.getMfNames();
        }
        $scope.showCreateNewNbfcPopup = function (id,mfName) {
            $scope.updatemutualFundID = id;
            $scope.updatemutualFundName = mfName;
           
            $("#addNbfc input").removeClass('inputErrorValidation');
            $("#addNbfc").modal({
                backdrop: 'static',
                keyboard: false
            });
            document.getElementById('nbfcNameId').innerHTML = "";
             document.getElementById('nbfcBankNameId').innerHTML = "";
             document.getElementById('nbfcBankIfscId').innerHTML = "";
            document.getElementById('nbfcBankAccountNoId').innerHTML = "";
            document.getElementById('nbfcBankAccountNameId').innerHTML = "";
           
            $scope.mfDetails = [];
            data['id'] = id;
            data['mfName'] = mfName;
            var url = appEnvironment.MUTUAL_FUND_URL;
           lmsService.callApi(data, url, "viewMutualFunds", function (response) { 
            console.log("selectize1111"+JSON.stringify(response.data.mutualFundList));
          
                if (response.status == "success") {
                    for (var k = 0; k < response.data.mutualFundList.length; k++) {
                        $scope.mfDetails.push(response.data.mutualFundList[k]['mfName']);
                    }
                    console.log("$scope.selectize222"+JSON.stringify(response.data.mutualFundList));
                   // $scope.selectExistingUser();
                }
                $scope.handleResponseError(response);
            });
        }

        $scope.showUpdatenbfcPopup = function (value) {
            $scope.allowNbfcEdit= false;
            if ($scope.nbfcDetailsList.length > 0) {
                console.log("$scope.nbfcDetailsList: " + JSON.stringify($scope.nbfcDetailsList));
                for (var i = 0; i < $scope.nbfcDetailsList.length; i++) {
                    console.log("$scope.nbfcDetailsList id val: " + $scope.nbfcDetailsList[i].id)
                    if (value == $scope.nbfcDetailsList[i].id) {
                        console.log("equal");
                        $scope.editNbfc =angular.copy( $scope.nbfcDetailsList[i]);
                      
                        console.log("$scope.editNbfc :" +JSON.stringify($scope.editNbfc));
                    }
                }
            }
            // $scope.selectedUserRoles = [];
            // console.log("existingMfData11 :" +JSON.stringify($scope.existingMfData));
            // for (var i = 0; i < $scope.existingMfData.length; i++) {
            //     $scope.selectedUserRoles.push($scope.existingMfData[i]['mfId']);
            // }
            console.log("$scope.selectedUserRoles: " + $scope.selectedUserRoles);
          //  $scope.selectRolesInUser();
            $scope.validateNbfc();
            document.getElementById('nbfcBankNameEdit').innerHTML = "";
            document.getElementById('nbfcBankAccountNoIdEdit').innerHTML = "";
            document.getElementById('nbfcBankIFSCEdit').innerHTML = "";
           document.getElementById('nbfcBankAccountNameIdEdit').innerHTML = "";
          
            $("#editNbfc").modal("show");
        }

        $scope.destroySelectize = function () {
            if ($('#select-mf-value').selectize()[0] != undefined) {
                $('#select-mf-value').selectize()[0].selectize.destroy();
                $scope.mfDetails = [];
                for (var i = 0; i < $scope.existingMfData.length; i++) {
                    $("#select-mf-value option[value='" + $scope.existingMfData[i]['id'] + "']").prop('selected', false);
                }
            }
        }
        $scope.selectExistingUser = function () {
            $('#select-mf-value').selectize()[0].selectize.destroy();
            for (var i = 0; i < $scope.existingMfData.length; i++) {
                console.log("existingMfData"+JSON.stringify($scope.existingMfData));
                if ($scope.mfDetails.indexOf($scope.existingMfData[i]['id']) != -1) {
                    console.log("mfDetails"+JSON.stringify($scope.mfDetails));

                    $("#select-mf-value option[value='" + $scope.existingMfData[i]['id'] + "']").prop('selected', 'selected');
                }
            }
            $('#select-mf-value').selectize({});
        }
        $scope.selectUserCount = 0;
        $scope.selectOnMutualFund = function () {
            $scope.selectUserCount++;
            console.log("$scope.existingMfData.length"+JSON.stringify($scope.existingMfData.length));
            if ($scope.selectUserCount == $scope.existingMfData.length) {
                $timeout(function () {
                    $('#select-mf-value').selectize();
                });
                $scope.selectUserCount = 0;
            }
        }
        $rootScope.$on("nbfcAction", function() {
            $scope.validateNbfc();
        });
        $scope.validateNbfc = function() {
            if(!checkEmptyField($scope.addNbfc.nbfcName) && !checkEmptyField($scope.addNbfc.nbfcBankName)  && !checkEmptyField($scope.addNbfc.minimumBalance)&& !checkEmptyField($scope.addNbfc.nbfcBankIfsc) && !checkEmptyField($scope.addNbfc.nbfcAccountNo) && !checkEmptyField($scope.addNbfc.nbfcAccountName)  && !($scope.addNbfc.nbfcAccountNo.length < 9)) {
				$scope.allowNbfc = false;
			} else {
				$scope.allowNbfc = true;
            }
            
        }
        $scope.validateNbfcEdit = function() {
            if(!checkEmptyField($scope.editNbfc.nbfcAccountNo) && !($scope.editNbfc.nbfcAccountNo.length < 9)) {
				$scope.allowNbfcEdit = false;
			} else {
				$scope.allowNbfcEdit = true;
            }
            
        }
   

        $scope.validateNbfcName = function () {
            if (checkEmptyField($scope.addNbfc.nbfcName)) {
                document.getElementById('nbfcNameId').innerHTML = "Please enter NBFC Name.";
                $scope.validationErr = true;
            } else if (!characterValid($scope.addNbfc.nbfcName)) {
                document.getElementById('nbfcNameId').innerHTML = "Invalid Value for NBFC Name.";
                $scope.validationErr = true;
            } else {
                document.getElementById('nbfcNameId').innerHTML = "";
            }
            
        }
        $scope.validateNbfcBankNameEdit = function () {
            if (checkEmptyField($scope.editNbfc.nbfcBankName)) {
                document.getElementById('nbfcBankNameEdit').innerHTML = "Please enter NBFC Name.";
                $scope.validationErr = true;
            } else if (!characterValid($scope.editNbfc.nbfcBankName)) {
                document.getElementById('nbfcBankNameEdit').innerHTML = "Invalid Value for NBFC Name.";
                $scope.validationErr = true;
            } else {
                document.getElementById('nbfcBankNameEdit').innerHTML = "";
            }
            
        }

        $scope.validateNbfcBankName = function () {
            if (checkEmptyField($scope.addNbfc.nbfcBankName)) {
                document.getElementById('nbfcBankNameId').innerHTML = "Please enter NBFC Bank Name.";
                $scope.validationErr = true;
            } else if (!bankNameValid($scope.addNbfc.nbfcBankName)) {
                document.getElementById('nbfcBankNameId').innerHTML = "Invalid Value for NBFC Bank Name.";
                $scope.validationErr = true;
            } else {
                document.getElementById('nbfcBankNameId').innerHTML = "";
            }
        }

        $scope.validateNbfcBankIfsc = function () {
            if (checkEmptyField($scope.addNbfc.nbfcBankIfsc)) {
                document.getElementById('nbfcBankIfscId').innerHTML = "Please enter IFSC no.";
                $scope.validationErr = true;
            } else if (!ifscValid($scope.addNbfc.nbfcBankIfsc)) {
                console.log("aaaa");
                document.getElementById('nbfcBankIfscId').innerHTML = "Invalid Value for IFSC no.";
                $scope.validationErr = true;
            }else if (nameValid($scope.addNbfc.nbfcBankIfsc)) {
                console.log("aaaa");
                document.getElementById('nbfcBankIfscId').innerHTML = "Invalid Value for IFSC no";
                $scope.validationErr = true;
            } else {
                document.getElementById('nbfcBankIfscId').innerHTML = "";
            }
        }
        
        $scope.validateNbfcBankIfscEdit = function () {
            if (checkEmptyField($scope.editNbfc.nbfcBankIfsc)) {
                document.getElementById('nbfcBankIFSCEdit').innerHTML = "Please enter NBFC Bank IFSC.";
                $scope.validationErr = true;
            } else if (!ifscValid($scope.editNbfc.nbfcBankIfsc)) {
                console.log("aaaa");
                document.getElementById('nbfcBankIFSCEdit').innerHTML = "Invalid Value for NBFC Bank IFSC.";
                $scope.validationErr = true;
            }  else if (nameValid($scope.editNbfc.nbfcBankIfsc)) {
                console.log("aaaa");
                document.getElementById('nbfcBankIFSCEdit').innerHTML = "Invalid Value for NBFC Bank IFSC.";
                $scope.validationErr = true;
            } else {
                document.getElementById('nbfcBankIFSCEdit').innerHTML = "";
            }
        }

        $scope.validateNbfcAccountNoEdit = function () {
            if (checkEmptyField($scope.editNbfc.nbfcAccountNo)) {
                document.getElementById('nbfcBankAccountNoIdEdit').innerHTML = "Please enter NBFC AccountNo.";
                $scope.validationErr = true;
            } else if (!accountNumber($scope.editNbfc.nbfcAccountNo)) {
                document.getElementById('nbfcBankAccountNoIdEdit').innerHTML = "Invalid Value for NBFC Account Number.";
                $scope.validationErr = true;
            }
            else if (($scope.editNbfc.nbfcAccountNo.length < 9)) {
                document.getElementById('nbfcBankAccountNoIdEdit').innerHTML = "Account number length varies from 9 digits to 18 digit.";
                $scope.validationErr = true;
            } else {
                document.getElementById('nbfcBankAccountNoIdEdit').innerHTML = "";
            }
        }

        $scope.validateNbfcAccountNo = function () {
            if (checkEmptyField($scope.addNbfc.nbfcAccountNo)) {
                document.getElementById('nbfcBankAccountNoId').innerHTML = "Please enter NBFC AccountNo.";
                $scope.validationErr = true;
            } else if (!accountNumber($scope.addNbfc.nbfcAccountNo)) {
                document.getElementById('nbfcBankAccountNoId').innerHTML = "Invalid Value for NBFC Account Number.";
                $scope.validationErr = true;
            }
            else if (($scope.addNbfc.nbfcAccountNo.length < 9)) {
                document.getElementById('nbfcBankAccountNoId').innerHTML = "Account number length varies from 9 digits to 18 digit.";
                $scope.validationErr = true;
            } else {
                document.getElementById('nbfcBankAccountNoId').innerHTML = "";
            }
        }

        $scope.validateNbfcAccountName = function () {
            if (checkEmptyField($scope.addNbfc.nbfcAccountName)) {
                document.getElementById('nbfcBankAccountNameId').innerHTML = "Please enter NBFC Account Name.";
                $scope.validationErr = true;
            } else if (!nameInput($scope.addNbfc.nbfcAccountName)) {
                document.getElementById('nbfcBankAccountNameId').innerHTML = "Invalid Value for NBFC  Account Name.";
                $scope.validationErr = true;
            } else {
                document.getElementById('nbfcBankAccountNameId').innerHTML = "";
            }
        }
        $scope.validateNbfcAccountNameEdit = function () {
            if (checkEmptyField($scope.editNbfc.nbfcAccountName)) {
                document.getElementById('nbfcBankAccountNameIdEdit').innerHTML = "Please enter NBFC Account Name.";
                $scope.validationErr = true;
            } else if (!nameInput($scope.editNbfc.nbfcAccountName)) {
                document.getElementById('nbfcBankAccountNameIdEdit').innerHTML = "Invalid Value for NBFC Account Name.";
                $scope.validationErr = true;
            } else {
                document.getElementById('nbfcBankAccountNameIdEdit').innerHTML = "";
            }
        }
        $scope.validateNbfcMinimumBalance = function () {
            if (checkEmptyField($scope.addNbfc.minimumBalance)) {
                document.getElementById('nbfcMinimumBalance').innerHTML = "Please enter Minimum Balance";
                $scope.validationErr = true;
            } else {
                document.getElementById('nbfcMinimumBalance').innerHTML = "";
            }
        }
        $scope.validateNbfcMinimumBalanceEdit = function () {
            if (checkEmptyField($scope.editNbfc.minimumBalance)) {
                document.getElementById('nbfcMinimumBalanceEdit').innerHTML = "Please enter Minimum Balance";
                $scope.validationErr = true;
            } else {
                document.getElementById('nbfcMinimumBalanceEdit').innerHTML = "";
            }
        }

        $scope.getMfNames = function() {
            $scope.existingMfData = [];
            var url = appEnvironment.MUTUAL_FUND_URL;
            lmsService.callApi(data, url, "getMutualFunds", function (response) {
                if (response.status == "success") {
                    $scope.existingMfData = response.data.mfMaster;
                    console.log("$scope.existingMfData"+JSON.stringify($scope.existingMfData));
                    console.log("$scope.existingMfData11"+JSON.stringify(response.data.mfMaster));
                }
                $scope.handleResponseError(response);
            });
        }
        $scope.fetchNbfcDetails = function () {
            var url = appEnvironment.NBFC_URL;
            lmsService.callApi(data, url, "viewNbfcDetails", function (response) {
                if (response.status == "success") {
                    $scope.nbfcDetailsList = response.data.nbfcDetailsList;
                }
                $scope.handleResponseError(response);
                var windowHeight = $(window).height() - 200;
                $scope.maxRows = Math.ceil(windowHeight / 50);
                $scope.changePage('1');
                $scope.maxRows = 10;
		
            });
        }
         $(window).resize(function () {
            $scope.getTableWidth();
        });

        $scope.getTableWidth = function () {
            $(".responsiveTableDiv").css('width', ($('.container').width() - ($(".fixedColumns").width() + 60)) + "px");
        }
        	 $scope.showNextPage = function() {
            $scope.currentPage = parseInt($scope.currentPage) + 1;
            $scope.changePage($scope.currentPage);
        }
        $scope.showPreviousPage = function () {
            $scope.currentPage = parseInt($scope.currentPage) - 1;
            $scope.changePage($scope.currentPage);
        }
        $scope.changePage = function (newPageNo) {
            $scope.dot = 0;
            $scope.nbfcDetailsList.length / $scope.maxRows > 0 ? $scope.totalPages = new Array(Math.ceil($scope.nbfcDetailsList.length / $scope.maxRows)) : $scope.totalPages = 0;
            $scope.currentPage = newPageNo;
            $scope.currentStartRow = (newPageNo - 1) * $scope.maxRows;
           if ($scope.nbfcDetailsList.length - ($scope.currentStartRow) > $scope.maxRows) {
                $scope.currentEndRow = $scope.maxRows;
            } else {
                $scope.currentEndRow = ($scope.nbfcDetailsList.length - $scope.currentStartRow);
            }
        }
        $scope.getPagination = function () {
            $scope.templateHTML = "";
            var dotDone = false;
            var dotPreviousDot = false;
            if ($scope.totalPages != undefined) {
                for (var i = 1; i <= $scope.totalPages.length; i++) {
                    $scope.classUse = ''
                    parseInt($scope.currentPage) == i ? $scope.classUse = 'disable-click activePage customTablePagination' : $scope.classUse = 'pointer customTablePagination';
                    if ($scope.totalPages.length >= 5 && parseInt($scope.currentPage) > 4 && parseInt($scope.currentPage) - i > 1 && i != 1) {
                        if (!dotPreviousDot) {
                            dotPreviousDot = true;
                            $scope.templateHTML += "<a class='customTablePagination'>...</a>";
                        }
                    } else if (($scope.totalPages.length >= 5 && parseInt($scope.currentPage) > 4 && parseInt($scope.currentPage) - i == -1) || ($scope.totalPages.length >= 5 && parseInt($scope.currentPage) > 4 && parseInt($scope.currentPage) - i == 1)) {
                        $scope.templateHTML += "<a class='" + $scope.classUse + "' ng-click='changePage(" + i + ")'>" + (i) + "</a>";
                    } else if (($scope.totalPages.length <= 5) || ($scope.totalPages.length >= 5 && parseInt($scope.currentPage) <= 5 && i <= 5) || (i == $scope.totalPages.length) || ($scope.totalPages.length >= 5 && parseInt($scope.currentPage) > 5 && (i < 5 || i == parseInt($scope.currentPage)))) {
                        $scope.templateHTML += "<a class='" + $scope.classUse + "' ng-click='changePage(" + i + ")'>" + (i) + "</a>";
                    } else if (($scope.totalPages.length >= 5 && !dotDone && parseInt($scope.currentPage) < 5 && i > 5 && i != $scope.totalPages.length) || ($scope.totalPages.length >= 5 && parseInt($scope.currentPage) > 5 && i > 5 && i != $scope.totalPages.length && !dotDone) || ($scope.totalPages.length >= 5 && parseInt($scope.currentPage) == 5 && i > 6 && !dotDone)) {
                        dotDone = true;
                        $scope.templateHTML += "<a class='customTablePagination'>...</a>";
                    }
                }
            }
            return $scope.templateHTML;
        }

        $scope.handleResponseError = function (response) {
            if (response.status == "failed") {
                var modalOptions = {
                    actionButtonText: 'Ok',
                    headerText: 'Error',
                    bodyText: response.message
                };
                modalService.showModal({}, modalOptions).then(function (result) { });
                if (response.statusCode == -6006 || response.statusCode == -6007 || response.statusCode == -6008 || response.statusCode == -6010 || response.statusCode == -6011) {
                    $state.go("login");
                }
            } else if (response.status == "") {
                var modalOptions = {
                    actionButtonText: 'Ok',
                    headerText: 'Error',
                    bodyText: "Unable to connect to server"
                };
                modalService.showModal({}, modalOptions).then(function (result) { });
            }
        }

        $scope.saveNbfc = function() {
          var action;
                action = "addNbfc";
                data["addNbfcDetails"] = $scope.addNbfc;
                var url = appEnvironment.NBFC_URL;
            lmsService.callApi(data, url, action, function (response) {
                if (response.status == "success") {
                    $("#addNbfc").modal('hide');
                    var modalOptions = {
                        actionButtonText: 'Ok',
                        headerText: 'Information',
                        bodyText: response.message
                    };
                    modalService.showModal({}, modalOptions).then(function (result) { });
                    $scope.fetchNbfcDetails();
                    $scope.resetData();
                }
                $scope.handleResponseError(response);
            });
        }
        $scope.saveEditNbfc = function() {
            
            var action;
            action = "editNbfc";
            data["editNbfcDetails"] = $scope.editNbfc;
            
            // if ($scope.addNbfc.nbfcAccountNo.length < 9) {
            //     var modalOptions = {
            //         actionButtonText: 'Ok',
            //         headerText: 'Error',
            //         bodyText: "Account number length varies from 9 digits to 18 digit."
            //     };
            //     modalService.showModal({}, modalOptions).then(function (result) { });
            //     return;
            // }
            var url = appEnvironment.NBFC_URL;
            lmsService.callApi(data, url, action, function (response) {
                if (response.status == "success") {
                    $("#editNbfc").modal('hide');
                    var modalOptions = {
                        actionButtonText: 'Ok',
                        headerText: 'Information',
                        bodyText: response.message
                    };
                    modalService.showModal({}, modalOptions).then(function (result) { });
                    $scope.fetchNbfcDetails();
                    $scope.resetData();
                }
                $scope.handleResponseError(response);
            });
        }

        $scope.editNbfc = function () {
            data["editNbfcDetails"] = $scope.getNbfcData;
            var url = appEnvironment.NBFC_URL;
            lmsService.callApi(data, url, "editNbfc", function (response) {
                if (response.status == "success") {
                    $("#addNbfc").modal('hide');
                    var modalOptions = {
                        actionButtonText: 'Ok',
                        headerText: 'Information',
                        bodyText: response.message
                    };
                    modalService.showModal({}, modalOptions).then(function (result) { });
                    $scope.fetchNbfcDetails();
                }
                $scope.handleResponseError(response);
            });
        }
        $scope.deleteNbfc = function(id, nbfcName) {
            var modalOptions = {
                isCloseEnabled: true,
                actionButtonText: 'Yes',
                closeButtonText: 'No',
                headerText: 'Warning',
                bodyText: "Are you sure you want to delete the NBFC: " + nbfcName + "?"
            };
            modalService.showModal({}, modalOptions).then(function (result) { 
                var nbfcData = {};
                nbfcData["nbfcId"] = id;
                data["deleteNbfcDetails"] = nbfcData;
                var url = appEnvironment.NBFC_URL;
                lmsService.callApi(data, url, "deleteNbfc", function (response) {
                    if (response.status == "success") {
                        $("#addNbfc").modal('hide');
                        var modalOptions = {
                            actionButtonText: 'Ok',
                            headerText: 'Information',
                            bodyText: response.message
                        };
                        modalService.showModal({}, modalOptions).then(function (result) { });
                        $scope.fetchNbfcDetails();
                    }
                    $scope.handleResponseError(response);
                });
            });
        }
        $scope.resetData = function() {
            $scope.addNbfc = {};
        }
        $('#editNbfc').on('hidden.bs.modal', function () {
           // $('#select-user-roles').selectize()[0].selectize.destroy();
           
            // for (var i = 0; i < $scope.selectedUserRoles.length; i++) {
            //     $("#select-user-roles option[value='" + $scope.selectedUserRoles[i] + "']").prop('selected', false);
            // }
           
            $scope.allowUpdateBasicInfo = false;
        })

        $scope.checkRoleUserMappingCount = 0;
        $scope.checkRoleUserMapping = function (rollName) {
            if ($scope.selectedUserRoles != undefined) {
                $scope.checkRoleUserMappingCount++;
                if ($scope.selectedUserRoles.indexOf(rollName) != -1) {
                    $("#select-user-roles option[value='" + rollName + "']").prop('selected', 'selected');
                    $timeout(function () {
                        $('#select-user-roles').selectize({});
                    });
                } else {
                    $("#select-user-roles option[value='" + rollName + "']").prop('selected', false);
                }
               
                if ($scope.checkRoleUserMappingCount == $scope.existingMfData.length) { }
            }
        }
        // $scope.selectRolesInUser = function () {
        //     for (var i = 0; i < $scope.existingMfData.length; i++) {
        //         if ($scope.selectedUserRoles.indexOf($scope.existingMfData[i]['mfName']) != -1) {
        //             $("#select-user-roles option[value='" + $scope.existingMfData[i]['mfId'] + "']").prop('selected', 'selected');
        //         }
        //     }
        //     $('#select-user-roles').selectize({

        //     });
        // }
  
     

        initialize();
    }
])