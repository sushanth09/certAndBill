myApp.controller('userController', ['busyNotificationService', '$timeout', '$scope', '$uibModal', '$filter', '$location', '$window', '$rootScope', '$state', 'appConstants', 'localconfig', 'serverconfig', 'config', 'modalService', '$http', '$stateParams', 'lmsService', 'commonUtilityService', 
	function (busyNotificationService, $timeout, $scope, $uibModal, $filter, $location, $window, $rootScope, $state, appConstants, localconfig, serverconfig, config, modalService, $http, $stateParams, lmsService, commonUtilityService) {
		$scope.refIdAlpha = appConstants.UPPER_CASE_CHARS.concat(appConstants.LOWER_CASE_CHARS).concat(appConstants.NUMBERS).concat(" ");
		$scope.amountInrPayment = appConstants.UPPER_CASE_CHARS.concat(appConstants.NUMBERS).concat(".");
		
		var data = {};
		$scope.stateAction = "infusionToDoList";
		$scope.changeSubMenutab = function (subMenuType) {
			$scope.stateAction = subMenuType;
			console.log("stateAction: " + $scope.stateAction);
			$scope.pagination[$scope.stateAction] = {
				noOfRecords: 4,
				displayRecords: 0,
				currentPage: 1,
				showing: '',
				tableName: $scope.stateAction+'Tb',
				varName: $scope.stateAction,
				pagearray: [],
				pagination: ""
			}
			
			$scope.pagination[$scope.stateAction] = commonUtilityService.setPagination($scope[$scope.stateAction], $scope.pagination[$scope.stateAction]);
			$scope.pagination[$scope.stateAction] = commonUtilityService.getPagination($scope[$scope.stateAction], $scope.pagination[$scope.stateAction]);
		}

		function initialize() {
			$rootScope.bodylayout = '';
			console.log("User Controller loaded");
			if ($rootScope.globals == undefined) {
				$state.go("login");
			}
			$scope.appConstants = appConstants;
			if (APP_ENVIRONMENT === config.ENVIRONMENT_LOCAL) {
				appEnvironment = localconfig;
			} else if (APP_ENVIRONMENT === config.ENVIRONMENT_SERVER) {
				appEnvironment = serverconfig;
			}
			$scope.fetchNbfcDetails();
			$scope.holidayListDate();
			if ($rootScope.globals.nbfcId != 0) {
				$scope.nbfcNames = ($rootScope.globals.nbfcId).toString();
				$scope.nbfcId = ($rootScope.globals.nbfcId).toString();
				$scope.validateNbfc();
				$scope.nbfcDashboardDetails();
			}
			$scope.isVisible = false;
			$scope.allowFutureInfusion = false;
			$scope.allowFuturePayment = false;
			$scope.isGenerateLetter = false;
			$scope.editMutual = false;
			$scope.isFetchData = false;
			$scope.benef = {};
			$scope.errorUpload = "";
			$scope.infusionErr = "";
			$scope.fundInfusionList=[];
			$scope.mutualHistoryList =[];
		
			$scope.deletedRecord = [];
			$scope.updateBeneList = [];
			$scope.beneficiaryList = [];
			$scope.allowMapping = true;
			$scope.generateLetter = false;
			$scope.generateMfLetter = false;
			$scope.allowPaymentAdd = false;
			$scope.allowStatementUpload = true;
			$scope.allowBeneficiaryUpload = true;
			$scope.dataModified = false;
			$scope.allowInfusionHistory = false;
			$scope.beneIndex = -1;
			$scope.isUpdated = false;
			$scope.allowPreviewPdf = true;
			$scope.isNewAdded = false;
			$scope.isUpload = false;
			$scope.moreDetailsFlag = false;
			$scope.previewLetter = true;
			$scope.submitPayment = true;
			$scope.allowGenerate = true;
			$scope.allInfusionData = false;
		}

		$scope.setNbfcId = function (id) {
			$scope.nbfcId = document.getElementById(id).value;
			console.log("nbfcId: " + $scope.nbfcId);
		}

		$scope.validateNbfc = function () {
			if (!checkEmptyField($scope.nbfcNames)) {
				$scope.allowSearchNBFC = true;
			} else {
				$scope.allowSearchNBFC = false;
			}
		}

		$scope.generatePayLetter = function () {
			$scope.updatedBeneficiary = true;
			$scope.generateLetter = true;
			$scope.saveBeneficiary();
		}
		
		$scope.generatePaymentLetter = function() {
			$scope.actionVal == '';
			
			if ($scope.totalAmount != 0) {
				$scope.showModalPopup("Total Amount is not Zero, Could not generate letters.");
				return;
			}

			var data = {};
			data["pdfData"] = {};
		
			data["pdfData"]["financialYear"] = getCurrentFiscalYear();
			data["pdfData"]["paymentAmount"] = $scope.totalPaymentAmount;
			data["pdfData"]["paymentId"] = $scope.paymentId;
			data["pdfData"]["referenceId"] = $scope.referenceIdPayment;
			console.log("$scope.referenceIdPayment"+JSON.stringify($scope.referenceIdPayment));
            var url = appEnvironment.DOWNLOADS_URL;
            lmsService.callApi(data, url, "generateFiles", function(response) {
				if (response.status == "success") {
					$scope.allowSubmitReports= true;
					$scope.dataModified = false;
					console.log("response::::: " + JSON.stringify(response));
					if (!isEmpty(response)) {
						
					} else {
						$scope.showModalPopup("Reports not generated.");
						return;
					}
					$scope.updatedBeneficiary = false;
					$scope.showModalPopup(response.message);
					
					$scope.nbfcDashboardDetails();
				} $scope.handleResponseError(response);
			});
		}

		$scope.generateMfundLetter = function() {
			$scope.editMutual = false;
			$scope.isGenerateLetter = true;
			$scope.generateMfLetter = true;
			$scope.investMutualFunds();
		}

		$scope.generateMutualLetter = function() {
			var calculatedVal = 0;
			for (var i = 0; i < $scope.mappedMutualFundList.length; i++) {
				calculatedVal = parseInt(calculatedVal) + parseInt($scope.mappedMutualFundList[i].mfInvestAmt);
			}

			if ($scope.isInvestmentAmount)
				$scope.checkInvestmentAmount = $scope.awaitedInfusionAmount;
			else
				$scope.checkInvestmentAmount = $scope.investmentAmount;

			
			if (calculatedVal > parseInt($scope.checkInvestmentAmount)) {
				$scope.showModalPopup("Amount exceeds investment amount.");
				return;
			} else if (calculatedVal < parseInt($scope.checkInvestmentAmount)) {
				$scope.showModalPopup("Amount less than investment amount.");
				return;
			}

			$scope.actionVal == '';
			var data = {};
			data["pdfData"] = {};
			data["pdfData"]["financialYear"] = getCurrentFiscalYear();
			data["pdfData"]["nbfcId"] = $scope.nbfcId;
			data["pdfData"]["referenceId"] = $scope.referenceIdinvestment;
            var url = appEnvironment.DOWNLOADS_URL;
            lmsService.callApi(data, url, "generateMfFiles", function(response) {
				if (response.status == "success") {
					$scope.allowPreviewPdf = false;
					console.log("response::::: " + JSON.stringify(response));
					if (!isEmpty(response)) {
						
					} else {
						$scope.showModalPopup("Reports not generated.");
						return;
					}
					$scope.showModalPopup(response.message);
					
					$scope.nbfcDashboardDetails();
					$scope.isGenerateLetter = false;
				} $scope.handleResponseError(response);
			});
		}

		$scope.downloadLetter = function(paymentId) {
			var data = {};
			data["paymentId"] = paymentId;
			console.log("$scope.paymentId: " + $scope.paymentId);
            var url = appEnvironment.PAYMENT_URL;
            lmsService.callApi(data, url, "downloadLetter", function(response) {
				if (response.status == "success") {
					console.log("response::::: " + JSON.stringify(response));
					if (!isEmpty(response)) {
						$scope.fileName = response.data.documentDetails.docName;
						$scope.arrayBuffer = response.data.documentDetails.fileData;
						$scope.fileExt = response.data.documentDetails.fileExt;
					} else {
						$scope.showModalPopup("Unable to download file.");
						return;
					}

					if (!checkEmptyField($scope.fileExt)) {
						var uint8Array  = new Uint8Array($scope.arrayBuffer);
						var arrayBuffer = uint8Array.buffer;
						var blob = new Blob([arrayBuffer], {type: "application/pdf"});
						var fileURL = URL.createObjectURL(blob);
						var a = document.createElement("a");
						document.body.appendChild(a);
						a.style = "display: none";
						a.href = fileURL;
						a.download = $scope.fileName;
						a.click();
					}

					$scope.showModalPopup("Letter downloaded successfully.");
					
					$scope.nbfcDashboardDetails();
				} $scope.handleResponseError(response);
			});
		}

		$scope.downloadMutualLetter = function (dateVal) {
			var data = {};
			data["mfInvestDate"] = dateVal;
			data["nbfcId"] = $scope.nbfcId;
            var url = appEnvironment.MUTUAL_FUND_URL;
            lmsService.callApi(data, url, "downloadLetter", function(response) {
				if (response.status == "success") {
					console.log("response::::: " + JSON.stringify(response));
					if (!isEmpty(response)) {
						$scope.fileName = response.data.documentDetails.docName;
						$scope.arrayBuffer = response.data.documentDetails.fileData;
						$scope.fileExt = response.data.documentDetails.fileExt;
					} else {
						$scope.showModalPopup("Unable to download file.");
						return;
					}

					if (!checkEmptyField($scope.fileExt)) {
						var uint8Array  = new Uint8Array($scope.arrayBuffer);
						var arrayBuffer = uint8Array.buffer;
						var blob = new Blob([arrayBuffer], {type: "application/pdf"});
						var fileURL = URL.createObjectURL(blob);
						var a = document.createElement("a");
						document.body.appendChild(a);
						a.style = "display: none";
						a.href = fileURL;
						a.download = $scope.fileName;
						a.click();
					}

					$scope.showModalPopup("Letter downloaded successfully.");
					
					$scope.nbfcDashboardDetails();
				} $scope.handleResponseError(response);
			});
		}

		$scope.addBeneficiaryStatement = function () {
			document.getElementById("beneficiaryUpload").value = "";
			if ($scope.totalAmount > 0) {
				$("#addPayBeneficiary").modal("show");
			} else {
				var modalOptions = {
					actionButtonText: 'Ok',
					headerText: 'Information',
					bodyText: 'Cannot add Beneficiary, since amount is zero.'
				};
				modalService.showModal({}, modalOptions).then(function (result) {});
			}
			
		}
		$scope.pagination = {};
		$scope.checkboxModel = {
			checkFutureInfusion: {selected: false},
			
			allowFutureDate : function($event) {
			  $scope.checkFutureInfusion = $event.selected;
			   if($scope.checkFutureInfusion){
				   $scope.futureType = "infusion";
				console.log("$scope.checkFutureInfusion " +JSON.stringify($scope.checkFutureInfusion ));
				$scope.allowFutureInfusion = true;
				$scope.nbfcDashboardDetails();
			 } else {
				$scope.allowFutureInfusion = false;
				console.log("$scope.checkFutureInfusion " +JSON.stringify($scope.checkFutureInfusion ));
				$scope.nbfcDashboardDetails();
				
			 }
			 
			}
		};

		$scope.checkboxModelPayment = {
			checkFuturePayment: {selected: false},
			
			allowFutureDatePayment : function($event) {
			  $scope.checkFuturePayment = $event.selected;
			  $scope.futureType = "payment";
			   if($scope.checkFuturePayment == true){
				console.log("$scope.checkFuturePayment if: " +JSON.stringify($scope.checkFuturePayment ));	
				$scope.allowFuturePayment = true;
				$scope.nbfcDashboardDetails();
			 } else {
				 console.log("$scope.checkFuturePayment else  " +JSON.stringify($scope.checkFuturePayment ));
				 $scope.allowFuturePayment = false;
				$scope.nbfcDashboardDetails();
				
			 }
			 
			}
		};
		// $scope.allowFutureDate = function(name) {
		// 	console.log(name);
		// 	console.log("checkFutureInfusion"+JSON.stringify($scope.checkFutureInfusion));
		// 	// if($scope.checkFutureInfusion == 'true'){
			
		// 	// }
		// 	// $scope.allowFuture = true;
		// //	$scope.nbfcDashboardDetails();
		
		// }

		$scope.nbfcDashboardDetails = function () {
			$rootScope.globals.nbfcId = $scope.nbfcId;
			
			var data = {};
			data["nbfcId"] = $scope.nbfcId;
			
			if ($scope.checkboxModel.checkFutureInfusion.selected) {
				$scope.futureInfusionAllow = true;
				data["futureInfusionAllow"] = "true";
			} else {
				$scope.futureInfusionAllow = false;
				data["futureInfusionAllow"] = "false";
			}

			if ($scope.checkboxModelPayment.checkFuturePayment.selected) {
				$scope.futurePaymentAllow = true;
				data["futurePaymentAllow"] = "true";
			} else {
				$scope.futurePaymentAllow = false;
				data["futurePaymentAllow"] = "false";
			}
			var url = appEnvironment.NBFC_DASHBOARD_URL;
			lmsService.callApi(data, url, "getDashboardData", function (response) {
				if (response.status == "success") {
					$scope.nbfcAccountNo = response.data.nbfcData.nbfcAccountNo;
					$scope.paymentNbfcName = response.data.nbfcData.nbfcName;
					$scope.mutualFundInvestmentList = response.data.mutualFundInvestmentList;
					$scope.mutualFundCount = $scope.mutualFundInvestmentList.length;
					$scope.availableBalance = response.data.nbfcData.availableBalance;
					$scope.minimumBalance = response.data.nbfcData.minimumBalance;
					$scope.nbfcLienBalance = response.data.nbfcData.lienBalance;
					$scope.lienBalance = $scope.nbfcLienBalance;
					$scope.infusionList = response.data.infusionList;
					for (var i = 0; i < $scope.infusionList.length; i++) {
					}
					$scope.infusionCount = $scope.infusionList.length;
					$scope.paymentList = response.data.paymentList;
					for (var i = 0; i < $scope.paymentList.length; i++) {
					}
					$scope.infusionToDoList = response.data.infusionToDoList;
					for (var i = 0; i < $scope.infusionToDoList.length; i++) {
					}
					
					$scope.infusionToDoCount = $scope.infusionToDoList.length;
					$scope.paymentToDoList = response.data.paymentToDoList;
					for (var i = 0; i < $scope.paymentToDoList.length; i++) {
					}
				
					$scope.investmentToDoList = response.data.investmentToDoList;
					for (var i = 0; i < $scope.investmentToDoList.length; i++) {
					}
					$scope.investmentToDoCount = $scope.investmentToDoList.length;

					$scope.pagination[$scope.stateAction] = {
						noOfRecords: 4,
						displayRecords: 0,
						currentPage: 1,
						showing: '',
						tableName: $scope.stateAction+'Tb',
						varName: $scope.stateAction,
                        pagearray: [],
						pagination: ""
					}
					
					$scope.pagination[$scope.stateAction] = commonUtilityService.setPagination($scope[$scope.stateAction], $scope.pagination[$scope.stateAction]);
					$scope.pagination[$scope.stateAction] = commonUtilityService.getPagination($scope[$scope.stateAction], $scope.pagination[$scope.stateAction]);

		
					$scope.paymentToDoCount = $scope.paymentToDoList.length;
					
					
					$scope.uploadStatement = true;
				}
				$scope.isVisible = true;
				console.log("data: " + JSON.stringify(data));
				console.log("mutualFundList: " + JSON.stringify($scope.mutualFundList) + " creditList: " + JSON.stringify($scope.creditList) + " paymentList: " + JSON.stringify($scope.paymentList));
				$scope.handleResponseError(response);
				var windowHeight = $(window).height() - 200;
				$scope.maxRows = Math.ceil(windowHeight / 50);
				$scope.maxRows = 7;
			});
		}

		$scope.holidayListDate = function () {
			var data = {};
			data['holidayCategory'] = 'Bank';
			var url = appEnvironment.HOLIDAY_MASTER_URL;
			lmsService.callApi(data, url, "getHolidayData", function (response) {
				if (response.status == "success") {
					$scope.holidayMasterList = response.data.holidayDataList;

					console.log("holidayDataList" + JSON.stringify($scope.holidayMasterList));
				}
			});
		}

		$scope.cancelFromDashboard = function(id, type, amount) {
			if (type == "Payments" || type == "PaymentsMore") {
				$scope.cancelVal = "Payment";
			} else {
				$scope.cancelVal = "Infusion";
			}
			var modalOptions = {
				isCloseEnabled: true,
				closeButtonText: "No",
				actionButtonText: 'Yes',
				headerText: 'Information',
				bodyText: "Do you want to cancel the " + $scope.cancelVal + "?"
			};
			modalService.showModal({}, modalOptions).then(function (result) { 
				var data = {};
				var url;
				if (type == "Payments" || type == "PaymentsMore") {
					data["paymentDetails"] = {};
					data["paymentDetails"]['paymentId'] = id;
					data["paymentDetails"]['paymentAmount'] = amount;
					url = appEnvironment.PAYMENT_URL;
					action = "cancelPayments";
				} else if (type == "Infusion" || type == "InfusionMore"){
					data["infusionDetails"] = {};
					data["infusionDetails"]['infusionId'] = id;
					data["infusionDetails"]['infusionAmount'] = amount;
					url = appEnvironment.FUND_INFUSION_URL;
					action = "cancelFundInfusion";
				}
				console.log("action: " + action);
				lmsService.callApi(data, url, action, function (response) {
					if (response.status == "success") {
						$scope.showModalPopup(response.message)
						if (type == "InfusionMore") {
							$scope.moreDetails("Infusion");
						} else if (type == "PaymentsMore") {
							$scope.moreDetails("Payments");
						} else {
							$scope.nbfcDashboardDetails();
						}
					} $scope.handleResponseError(response);
				});
			});
		}
		
		$scope.fetchNbfcDetails = function () {
			var url = appEnvironment.NBFC_URL;
			lmsService.callApi(data, url, "viewNbfcDetails", function (response) {
				if (response.status == "success") {
					$scope.nbfcList = response.data.nbfcDetailsList;
				}
				console.log("nbfcList: " + JSON.stringify($scope.nbfcList));
				$scope.handleResponseError(response);
				var windowHeight = $(window).height() - 200;
				$scope.maxRows = Math.ceil(windowHeight / 50);

				$scope.maxRows = 7;
			});
		}

		$scope.addInfusion = function () {
			document.getElementById("infusionAmount").value = "";
			$scope.infusion = {};
			
			
			$scope.someScopeVariable = '0.00'
			$scope.taskPerformed = "Add";
			//$("#infusionDate").datepicker('setDate', new Date());
			$scope.infusion.infusionDate = $filter('date')(new Date(), 'dd-MM-yyyy');
			if (!$scope.$$phase) {
				$scope.$apply();
			}
			$('#addInfusion').modal('show');

			$scope.allowInfusionAdd = false;
			
		}
		

		$scope.editInfusion = function (id) {
			console.log("idVal: " + id);
			$scope.editId = id;
			$scope.taskPerformed = "Edit";
			$('#editInfusion').modal('show');
			$scope.allowEditInfusionAdd = true;
			$scope.infusionFetchData = true;
			$scope.infusionDataModified = false;
			$scope.editinfusion = {};
			for (var i = 0; i < $scope.infusionList.length; i++) {
				if (id == $scope.infusionList[i].id) {
					$scope.editinfusion = angular.copy($scope.infusionList[i]);
					$("#editInfusionDate").datepicker('setDate', $scope.editinfusion.infusionDate);
				}
			}

			 for (var i = 0; i < $scope.fundInfusionList.length; i++) {
		 	if (id == $scope.fundInfusionList[i].id) {
			 		$scope.editinfusion = angular.copy($scope.fundInfusionList[i]);
			 	}
			 }
		}

		$scope.editInvestMutual = function (investDate) {
			console.log("investDate"+JSON.stringify(investDate));
			$('#investMutualFund').show();
			$('#generateLetterMutual').hide();
					$('#previewLetterMutual').hide();
					$('#pullBackMutual').hide();
			$scope.editMutual = true;
			$scope.investMutual = false;
			var data = {};
			data["nbfcId"] = $scope.nbfcId;
			data["investmentDate"] = investDate;
			$scope.investmentDateT = investDate;
			console.log("$scope.investmentDateT"+JSON.stringify($scope.investmentDateT));
			var url = appEnvironment.MUTUAL_FUND_URL;
			lmsService.callApi(data, url, "getInvestmentDetails", function (response) {
				if (response.status == "success") {
					$scope.mappedMutualFundList = response.data.investDetailsList;
					$scope.awaitedInfusionAmount = response.data.awaitedInfusionAmount;
					$scope.investmentAmount = response.data.investmentAmount;
					$('#investMutualEdit').modal('show');
				}
			});
		}

		$scope.generateInvestMutual = function (investDate) {
			$scope.referenceIdinvestment="";
			if (!$scope.allowPreviewPdf) {

			} else {
				$scope.allowPreviewPdf = true;
			}

			if (checkEmptyField($scope.referenceIdinvestment)) {
				$scope.allowgenerateMReports = false;
				$scope.allowPreviewPdf = true;
			} else {
				$scope.allowgenerateMReports = true;
			}

			$scope.investmentDate = investDate;
			$('#investMutualFund').hide();
			$('#referenceIdinvestment').show();
			$('#generateLetterMutual').show();
					$('#previewLetterMutual').show();
					$('#pullBackMutual').show();
			$scope.editMutual = true;
			var data = {};
			data["nbfcId"] = $scope.nbfcId;
			data["investmentDate"] = investDate;
			var url = appEnvironment.MUTUAL_FUND_URL;
			lmsService.callApi(data, url, "getInvestmentDetails", function (response) {
				if (response.status == "success") {
					$scope.mappedMutualFundList = response.data.investDetailsList;
					$scope.awaitedInfusionAmount = response.data.awaitedInfusionAmount;
					$scope.investmentAmount = response.data.investmentAmount;
					$('#investMutualEdit').modal('show');
					
				}
			});
		}


		$scope.sendToCheckerMutual = function (investDate) {
			$("#submitMutualFund").show();
			$scope.investmentDate = investDate;
			$scope.editMutual = true;
			var data = {};
			data["nbfcId"] = $scope.nbfcId;
			data["investmentDate"] = investDate;
			$scope.investmentDateT = investDate;
			var url = appEnvironment.MUTUAL_FUND_URL;
			lmsService.callApi(data, url, "getInvestmentDetails", function (response) {
				if (response.status == "success") {
					$scope.mappedMutualFundList = response.data.investDetailsList;
					$scope.awaitedInfusionAmount = response.data.awaitedInfusionAmount;
					$scope.investmentAmount = response.data.investmentAmount;
					$('#sendtoCheckerMutual').modal('show');
					
				}
			});
		}
		$scope.waitingForApprovalMutual = function (investDate) {
			$("#submitMutualFund").hide();
		
			$scope.editMutual = true;
			var data = {};
			data["nbfcId"] = $scope.nbfcId;
			data["investmentDate"] = investDate;
			$scope.investmentDateT = investDate;
			var url = appEnvironment.MUTUAL_FUND_URL;
			lmsService.callApi(data, url, "getInvestmentDetails", function (response) {
				if (response.status == "success") {
					$scope.mappedMutualFundList = response.data.investDetailsList;
					$scope.awaitedInfusionAmount = response.data.awaitedInfusionAmount;
					$scope.investmentAmount = response.data.investmentAmount;
					$('#sendtoCheckerMutual').modal('show');
					
				}
			});
		}

		$scope.infusionHistory = function () {
			
			$scope.infusionHistoryList = [];
			/* $('#infusionHistory').modal('show');  */
			/* $state.go('infusionHistory');  */
			$scope.infusionMonth = "";
			$scope.infusionYear = "";
			$('#infusionHistory').modal({
				backdrop: 'static',
				keyboard: false
			});
			
			$scope.allowInfusionHistory = true;
			var table = $("#infusionHistoryListTb").DataTable();
			table.destroy();
			var CurrentYear = new Date().getFullYear()
		   	$scope.infusionYear = new Date().getFullYear().toString();
		  	$scope.infusionMonth = appConstants.MONTH[new Date().getMonth()];
			$scope.getFundInfusionHistory();
		}
	
		 $scope.paymentHistory = function () {
			$scope.paymentHistoryList = [];
			$scope.paymentMonth = "";
			$scope.paymentYear = "";
			$('#paymentHistory').modal({
				backdrop: 'static',
				keyboard: false
			});
			
			$scope.allowPaymentHistory = true;
			var CurrentYearP = new Date().getFullYear()
			$scope.paymentYear = new Date().getFullYear().toString();
			console.log("year"+JSON.stringify($scope.paymentYear));
		   $scope.paymentMonth = appConstants.MONTH[new Date().getMonth()];
		   console.log("month"+JSON.stringify($scope.paymentMonth ));

		   $scope.getPaymentHistory();
		} 
		$scope.mutualHistory = function () {
			$scope.mutualHistoryList = [];
			$scope.mutualMonth = "";
			$scope.mutualYear = "";
			$('#mutualHistory').modal({
				backdrop: 'static',
				keyboard: false
			});
			
			$scope.allowMutualHistory= true;
			var CurrentYearP = new Date().getFullYear()
			$scope.mutualYear = new Date().getFullYear().toString();
			console.log("year"+JSON.stringify($scope.mutualYear));
		   $scope.mutualMonth = appConstants.MONTH[new Date().getMonth()];
		   console.log("month"+JSON.stringify($scope.mutualMonth ));
		   $scope.getMutualHistory();
		} 

		$scope.downloadPassbook = function () {
			var data = {};
			data["pdfData"] = {};
			data["pdfData"]["financialYear"] = getCurrentFiscalYear();
			data["pdfData"]["nbfcId"] = $scope.nbfcId;
            var url = appEnvironment.DOWNLOADS_URL;
            lmsService.callApi(data, url, "generatePassbookPdf", function(response) {
				if (response.status == "success") {
					console.log("response::::: " + JSON.stringify(response));
					if (!isEmpty(response)) {
						$scope.passbookFileName = response.data.documentDetails.docName;
						$scope.passbookArrayBuffer = response.data.documentDetails.fileData;
						$scope.passbookFileExt = response.data.documentDetails.fileExt;
					} else {
						$scope.showModalPopup("Unable to download file.");
						return;
					}

					if (!checkEmptyField($scope.passbookFileExt)) {
						var uint8Array  = new Uint8Array($scope.passbookArrayBuffer);
						var arrayBuffer = uint8Array.buffer;
						var blob = new Blob([arrayBuffer], {type: "application/pdf"});
						var fileURL = URL.createObjectURL(blob);
						var a = document.createElement("a");
						document.body.appendChild(a);
						a.style = "display: none";
						a.href = fileURL;
						a.download = $scope.passbookFileName;
						a.click();
					}

					$scope.showModalPopup(response.message);
					$scope.nbfcDashboardDetails();
				} $scope.handleResponseError(response);
			});
		}

		$scope.closeStatement = function() {
			document.getElementById("statementUpload").value = "";
			$("#addStatement").modal("hide");
		}

		$scope.closeInfusion = function () {
			if ($scope.infusionDataModified) {
				var modalOptions = {
					isCloseEnabled: true,
					closeButtonText: "No",
					actionButtonText: 'Yes',
					headerText: 'Alert',
					bodyText: "Entered data will be lost do you want to continue?"
				};
				modalService.showModal({}, modalOptions).then(function (result) { 
					$("#editInfusion").modal('hide');
					$scope.infusion = "";
				});
			} else {
				$("#editInfusion").modal('hide');
				$scope.infusion = "";
			}
		}

		$scope.closeMutual = function () {
			$("#addMutualFunds").modal('hide');
			$scope.mutualFundAdd = "";
		}

		$scope.closePayment = function () {
			$("#addPayments").modal('hide');
			$scope.paymentAdd = "";
		}

		$scope.closeBeneficiary = function () {
			if ($scope.dataModified) {
				var modalOptions = {
					isCloseEnabled: true,
					closeButtonText: "No",
					actionButtonText: 'Yes',
					headerText: 'Alert',
					bodyText: "Entered data will be lost do you want to continue?"
				};
				modalService.showModal({}, modalOptions).then(function (result) { 
					$("#addBeneficiary").modal('hide');
					$scope.isBeneUpload = false;
				});
			} else {
				$("#addBeneficiary").modal('hide');
				$scope.isBeneUpload = false;
			}
		}

		$scope.closePayBeneficiary = function () {
			$("#addPayBeneficiary").modal('hide');
			$scope.updateBeneList = [];
			document.getElementById("beneficiaryUpload").value = "";
		}

		$scope.checkDedupe = function () {
			
			$scope.infusionErr = "";
			if ($scope.taskPerformed == "Add") {
				if (checkEmptyField($scope.infusion.infusionDate)) {
					$scope.infusionErr = "Please enter Infusion Date.";
				} else if (checkEmptyField($scope.infusion.infusionAmount)) {
					$scope.infusionErr = "Please enter Infusion Amount.";
				} else if ($scope.infusion.infusionAmount == 0) {
					$scope.infusionErr = "Infusion Amount cannot be zero.";
				}
			} else {
				if (checkEmptyField($scope.editinfusion.infusionDate)) {
					$scope.infusionErr = "Please enter Infusion Date.";
				} else if (checkEmptyField($scope.editinfusion.infusionAmount)) {
					$scope.infusionErr = "Please enter Infusion Amount.";
				} else if ($scope.editinfusion.infusionAmount == 0) {
					$scope.infusionErr = "Infusion Amount cannot be zero.";
				}
			}
			
			console.log($scope.infusionErr);

			if (!checkEmptyField($scope.infusionErr)) {
				var modalOptions = {
					actionButtonText: 'Ok',
					headerText: 'Information',
					bodyText: $scope.infusionErr
				};
				modalService.showModal({}, modalOptions).then(function (result) { });
				return;
			}

			data["actionPerformed"] = $scope.taskPerformed == "Add" ? "Add" : "Edit";
			data["addFundInfusionDetails"] = {};
			data["addFundInfusionDetails"]["id"] = $scope.editId;
			
			
			data["addFundInfusionDetails"]["nbfcId"] = parseInt($scope.nbfcId);
			data["addFundInfusionDetails"]["infusionDate"] = $scope.taskPerformed == "Add" ? $scope.infusion.infusionDate : $scope.editinfusion.infusionDate;
			data["addFundInfusionDetails"]["notification"] = $scope.taskPerformed == "Add" ? $scope.infusion.customerNotification : $scope.editinfusion.customerNotification;
			data["addFundInfusionDetails"]["infusionAmount"] = $scope.taskPerformed == "Add" ? $scope.infusion.infusionAmount : $scope.editinfusion.infusionAmount;
			var url = appEnvironment.FUND_INFUSION_URL;
			lmsService.callApi(data, url, "checkDedupeAmount", function (response) {
				$scope.submitEnabled = false;
				if (response.status == "success") {
					if ($scope.taskPerformed == "Add") {
						$("#addInfusion").modal("hide");
					} else {
						$("#editInfusion").modal("hide");
					}
					console.log("response is:::: " + JSON.stringify(response));
					var modalOptions = {
						actionButtonText: 'Ok',
						headerText: 'Information',
						bodyText: response.message
					};
					modalService.showModal({}, modalOptions).then(function (result) { });
					$scope.nbfcDashboardDetails();
				
				} else if (response.status == "failed") {
					var modalOptions = {
						isCloseEnabled: true,
						actionButtonText: 'Yes',
						closeButtonText: 'No',
						headerText: 'Information',
						bodyText: (response.message == undefined || response.message == null || response.message == "") ? 'Error in Fields.' : response.message
					};
					modalService.showModal({}, modalOptions).then(function (result) {
						if ($scope.taskPerformed == "Add") {
							$scope.saveInfusion();
						} else {
							$scope.editInfusionDetails();
						}
					});
				}
			});
		}

		$scope.saveInfusion = function () {
			if (checkEmptyField($scope.infusion.infusionDate)) {
				document.getElementById("infusionDate").innerHTML = "Please enter Infusion Date.";
				return;
			} else if (checkEmptyField($scope.infusion.infusionAmount)) {
				document.getElementById("infusionAmount").innerHTML = "Please enter Infusion Amount.";
				return;
			}
			data["addFundInfusionDetails"] = {};
			data["addFundInfusionDetails"]["nbfcId"] = parseInt($scope.nbfcId);
			data["addFundInfusionDetails"]["infusionDate"] = $scope.infusion.infusionDate;
			data["addFundInfusionDetails"]["notification"] = $scope.infusion.customerNotification;
			data["addFundInfusionDetails"]["infusionAmount"] = $scope.infusion.infusionAmount;
			console.log("$scope.infusion" + JSON.stringify($scope.infusion));
			var url = appEnvironment.FUND_INFUSION_URL;
			lmsService.callApi(data, url, "addFundInfusion", function (response) {
				$scope.submitEnabled = false;
				if (response.status == "success") {
					$("#addInfusion").modal("hide");
					console.log("response is:::: " + JSON.stringify(response));
					var modalOptions = {
						actionButtonText: 'Ok',
						headerText: 'Information',
						bodyText: response.message
					};
					modalService.showModal({}, modalOptions).then(function (result) { });
					$scope.infusion = {};
					$scope.nbfcDashboardDetails();
				} $scope.handleResponseError(response);
			});
		}

		$scope.saveMutual = function () {
			console.log("saveMutual: " + JSON.stringify($scope.groups[0]) + " selectedMutual: " + $scope.selectedMutual);
			var data = {};
			data["nbfcId"] = $scope.nbfcId;
			data["mfList"] = $scope.groups[0].mutualFundList;
			var url = appEnvironment.MUTUAL_FUND_URL;
			console.log("data: " + JSON.stringify(data) + " $scope.groups.mutualFundList: " + JSON.stringify($scope.groups.mutualFundList));	
					lmsService.callApi(data, url, "mapMfToNbfc", function (response) {
				console.log("response is:::: " + JSON.stringify(response));
				if (response.status == "success") {
					$("#addMutualFunds").modal("hide");
					var modalOptions = {
						actionButtonText: 'Ok',
						headerText: 'Information',
						bodyText: response.message
					};
					modalService.showModal({}, modalOptions).then(function (result) { });
					$scope.nbfcDashboardDetails();
				}
			});
      }
		$scope.addInvest = function () {
			$scope.investMutual = true;
			$("#lienBalance").hide();
			var data = {};
			data["nbfcId"] = $scope.nbfcId;
			var url = appEnvironment.MUTUAL_FUND_URL;
			lmsService.callApi(data, url, "getMfAmount", function (response) {
				if (response.status == "success") {
					$scope.investmentAmount = response.data.investmentAmount;
					$scope.mfInvestmentDate = $filter('date')(new Date(), 'dd-MM-yyyy');
					$scope.awaitedInfusionAmount = response.data.awaitedInfusionAmount;
					$scope.mappedMutualFundList = response.data.mappedMutualFundList;
					if ($scope.mappedMutualFundList.length > 0) {
						$('#investMutual').modal('show');
					} else {
						$scope.showModalPopup("No Mutual Funds configured for this NBFC, Kindly add.");
					}
				}
				$scope.handleResponseError(response);
			});
		}

		$scope.investMutualFunds = function() {
			var data = {};
			data["nbfcId"] = $scope.nbfcId;
			data["mappedMutualFundList"] = $scope.mappedMutualFundList;
			$("#investL").show();
			$("#lienBalance").show();
			var url = appEnvironment.MUTUAL_FUND_URL;
			lmsService.callApi(data, url, "mutualFundsInvestment", function (response) {
				if (response.status == "success") {
					if (!$scope.generateMfLetter) {
						$scope.showModalPopup(response.message);
					}
					if ($scope.editMutual) {
						$("#investMutualEdit").modal("hide");	
					} else {
						$("#investMutual").modal("hide");
					}
					$scope.nbfcDashboardDetails();
				}

				if ($scope.isGenerateLetter) {
					$scope.generateMutualLetter();
				}

				$scope.editMutual = false;
				$scope.handleResponseError(response);
			});
		}
		$scope.splitAmount =function(){
			var data = {};
			/* if ($scope.investmentAmount == 0) {
				$scope.showModalPopup("Investment Balance cannot be Zero.");
				return;
			} */

			var modalOptions = {
				isCloseEnabled: true,
				closeButtonText: 'No',
				actionButtonText: 'Yes',
				headerText: 'Information',
				bodyText: 'Do you want to split with awaited Infusion ?',
			};
			modalService.showModal({}, modalOptions).then(function (result) {
				data["nbfcId"] = $scope.nbfcId;
				data["investmentFlag"] = "Yes";
				data["investmentAmount"] = $scope.investmentAmount;
				$("#investL").show();
				$("#lienBalance").show();
				var url = appEnvironment.MUTUAL_FUND_URL;
				lmsService.callApi(data, url, "splitBalance", function (response) {
					if (response.status == "success") {
						$scope.mappedMutualFundList = response.data.investmentBalanceList;
						$scope.lienBalance = response.data.lienBalance;
						$scope.investMutual = false;
					}
					
					$scope.isInvestmentAmount = true;
					$scope.handleResponseError(response);
				});
			}, function () {
				if ($scope.investmentAmount == 0) {
					$scope.showModalPopup("Investment Balance cannot be Zero.");
					return;
				}
				$scope.isInvestmentAmount = false;
				data["nbfcId"] = $scope.nbfcId;
				data["investmentFlag"] = "No";
				data["investmentAmount"] = $scope.investmentAmount;
				$("#investL").show();
				$("#lienBalance").show();
				var url = appEnvironment.MUTUAL_FUND_URL;
				lmsService.callApi(data, url, "splitBalance", function (response) {
					if (response.status == "success") {
						$scope.mappedMutualFundList = response.data.investmentBalanceList;
						$scope.lienBalance = response.data.lienBalance;
						$scope.investMutual = false;
					}
					$scope.handleResponseError(response);
				});
			});
		}
		$scope.changePage = function(id, varName) {
			$scope.pagination[varName].currentPage = id;
			$scope.pagination[varName] = commonUtilityService.setPagination($scope[varName], $scope.pagination[varName]);
			$scope.pagination[varName] = commonUtilityService.getPagination($scope[varName], $scope.pagination[varName]);
			console.log("$scope.pagination[varName]"+JSON.stringify($scope.pagination[varName]));
			$scope.$apply();
		}
		$scope.getFundInfusionHistory = function () {
			var data = {};
			data["nbfcId"] = $scope.nbfcId;
			data["yearMonth"] = $scope.infusionMonth + " " + $scope.infusionYear;
			var url = appEnvironment.FUND_INFUSION_URL;
			lmsService.callApi(data, url, "getFundInfusionHistory", function (response) {
				if (response.status == "success") {
					
					$scope.infusionHistoryList = response.data.infusionHistoryList;
					for (var i = 0; i < $scope.infusionHistoryList.length; i++) {
					}
					console.log("$scope.infusionHistoryList: " + JSON.stringify($scope.infusionHistoryList));
					$scope.pagination['infusionHistoryList'] = {
						noOfRecords: 10,
						displayRecords: 0,
						currentPage: 1,
						showing: '',
						tableName: 'infusionHistoryListTb',
						varName: 'infusionHistoryList',
                        pagearray: [],
						pagination: ""
					}
					console.log("fundPagination Before :: "+JSON.stringify($scope.pagination['infusionHistoryList']));
					$scope.pagination['infusionHistoryList'] = commonUtilityService.setPagination($scope.infusionHistoryList, $scope.pagination['infusionHistoryList']);
					$scope.pagination['infusionHistoryList'] = commonUtilityService.getPagination($scope.infusionHistoryList, $scope.pagination['infusionHistoryList']);
					console.log("fundPagination After :: "+JSON.stringify($scope.pagination['fundInfinfusionHistoryListusionList']));
				}
				$scope.handleResponseError(response);
			});
		}

		$scope.getPaymentHistory = function () {
			var data = {};
			data["nbfcId"] = $scope.nbfcId;
			data["yearMonth"] = $scope.paymentMonth + " " + $scope.paymentYear;
			var url = appEnvironment.PAYMENT_URL;
			lmsService.callApi(data, url, "getPaymentHistoryData", function (response) {
				if (response.status == "success") {
					$scope.paymentHistoryList = response.data.paymentHistoryList;
				
				}
				$scope.handleResponseError(response);
			});
		}
		$scope.getMutualHistory = function () {
			var data = {};
			data["nbfcId"] = $scope.nbfcId;
			data["yearMonth"] = $scope.mutualMonth + " " + $scope.mutualYear;
			var url = appEnvironment.MUTUAL_FUND_URL;
			lmsService.callApi(data, url, "getMfHistoryData", function (response) {
				if (response.status == "success") {
					$scope.mutualHistoryList = response.data.mfHistoryList;
					console.log("$scope.mutualHistoryList "+JSON.stringify($scope.mutualHistoryList));
					for (var i = 0; i < $scope.mutualHistoryList.length; i++) {
					}
					$scope.pagination['mutualHistoryList'] = {
						noOfRecords: 10,
						displayRecords: 0,
						currentPage: 1,
						showing: '',
						tableName: 'mutualHistoryListTb',
						varName: 'mutualHistoryList',
                        pagearray: [],
						pagination: ""
					}
					console.log("fundPagination Before :: "+JSON.stringify($scope.pagination['mutualHistoryList']));
					$scope.pagination['mutualHistoryList'] = commonUtilityService.setPagination($scope.mutualHistoryList, $scope.pagination['mutualHistoryList']);
					$scope.pagination['mutualHistoryList'] = commonUtilityService.getPagination($scope.mutualHistoryList, $scope.pagination['mutualHistoryList']);
					console.log("fundPagination After :: "+JSON.stringify($scope.pagination['mutualHistoryList']));
				}
				$scope.handleResponseError(response);
			});
		}

		$scope.showAudit = function (refId, auditVal, date, amount) {
			$scope.dateVal = date;
			$scope.amountVal = amount;
			var data = {};
			var url;
			var action;
			if (auditVal == 'infusion') {
				data["infusionHistory"] = {};
				data["infusionHistory"]["refId"] = refId;
				data["infusionDate"] = $scope.infusionDate;
				console.log("$scope.infusionDate"+JSON.stringify("$scope.infusionDate"));
				url = appEnvironment.FUND_INFUSION_URL;
				action = "getRefHistoryData";
			} else if (auditVal == 'payments') {
				data["paymentHistory"] = {};
				data["paymentHistory"]["refId"] = refId;
				url = appEnvironment.PAYMENT_URL;
				action = "getPaymentRefHistoryData";
			}else if (auditVal == 'mutual') {
				data["mfHistory"] = {};
				data["mfHistory"]["nbfcId"] = $scope.nbfcId;
				data["mfHistory"]["investmentDate"] = date;
				url = appEnvironment.MUTUAL_FUND_URL;
				action = "getMfRefHistoryData";
			}

			lmsService.callApi(data, url, action, function (response) {
				if (response.status == "success") {
				
				
					if (auditVal == 'infusion') {
						
						console.log("$scope.infusionDate"+JSON.stringify(amount));
						$("#infusionRefHistory").modal("show");

						$scope.refHistoryList = response.data.refHistoryList;
				
				}else if (auditVal == 'payments') {
					$("#paymentRefHistory").modal("show");
					$scope.paymentrefHistoryList = response.data.refHistoryList;
					$scope.pagination['paymentrefHistoryList'] = {
						noOfRecords: 5,
						displayRecords: 0,
						currentPage: 1,
						showing: '',
						tableName: 'paymentrefHistoryListTb',
						varName: 'paymentrefHistoryList',
                        pagearray: [],
						pagination: ""
					}
					console.log("fundPagination Before :: "+JSON.stringify($scope.pagination['paymentrefHistoryList']));
					$scope.pagination['paymentrefHistoryList'] = commonUtilityService.setPagination($scope.paymentrefHistoryList, $scope.pagination['paymentrefHistoryList']);
					$scope.pagination['paymentrefHistoryList'] = commonUtilityService.getPagination($scope.paymentrefHistoryList, $scope.pagination['paymentrefHistoryList']);
					console.log("fundPagination After :: "+JSON.stringify($scope.pagination['paymentrefHistoryList']));
				}else if (auditVal == 'mutual') {
					$("#mutualRefHistory").modal("show");
					$scope.mutualRefHistoryList = response.data.refHistoryList;
					console.log("mutualRefHistoryList: " + JSON.stringify($scope.mutualRefHistoryList));
				
				}
					
				}
				
				$scope.handleResponseError(response);
			});
		}


		
		$scope.$watch('beneficiaryList', function(newValue, oldValue) {
			
			if (oldValue!=newValue && oldValue != undefined) {
				$scope.dataModified = true;
				
			}
			if($scope.fetchData) {
				$scope.dataModified = false;
				$scope.fetchData = false;
				
			}

			if ($scope.sendChecker) {
				$scope.isFetchData = false;
				$scope.dataModified = false;
				
			}

			if (!$scope.$$phase) {
				$scope.$apply();
			
			}
		}, true);

		$scope.$watch('editinfusion', function(newValue, oldValue) {
			console.log("inside editinfusion");
			if (oldValue!=newValue && oldValue != undefined) {
				$scope.infusionDataModified = true;
			}
			if($scope.infusionFetchData && !$scope.infusionDataModified) {
				$scope.infusionDataModified = false;
				$scope.infusionFetchData = false;
			}
		}, true);

		$scope.addSaveBeneficiary = function () {
			$("#generateLetter").hide();
			$("#referenceIdPayment").hide();
			$("#previewLetter").hide();
			$("#pullBack").hide();
			$("#updatePayment").show();
			console.log('addSaveBeneficiary');
			data["addPaymentTasks"] = {};
			data["addPaymentTasks"]["nbfcId"] = parseInt($scope.nbfcId);
			data["addPaymentTasks"]["paymentDate"] = $scope.paymentAdd.paymentDate;
			data["addPaymentTasks"]["paymentAmt"] = $scope.paymentAdd.paymentAmount;
			data["addPaymentTasks"]["beneCount"] = $scope.paymentAdd.beneCount;

			var url = appEnvironment.PAYMENT_URL;
			lmsService.callApi(data, url, "addPaymentDetails", function (response) {
				$scope.submitEnabled = false;
				if (response.status == "success") {
					$("#addPayments").modal("hide");
					
					console.log("response is:::: " + JSON.stringify(response));
					$scope.paymentAdd = {};
					$scope.paymentId = response.data.paymentId;
					$scope.nbfcDashboardDetails();
				} else if (response.status == "failed") {
					$("#addBeneficiary").modal("hide");
					var modalOptions = {
						actionButtonText: 'Ok',
						headerText: 'Alert',
						bodyText: (response.message == undefined || response.message == null || response.message == "") ? 'There has been some internal issue.' : response.message
					};
					modalService.showModal({}, modalOptions).then(function (result) { });
				}
			});
			$scope.totalAmount = $scope.paymentAdd.paymentAmount;
			$scope.totalPaymentAmount = $scope.totalAmount;
			$scope.beneDate = $scope.paymentAdd.paymentDate;
			$scope.totalBeneAmount = $scope.totalAmount;
			$scope.beneficiaryList = [];
			if ($scope.beneficiaryList.length == 0) {
				$scope.beneficiaryList.push({
					"isNew": true,
					"id":"N"+$scope.beneficiaryList.length,
					"paymentAmt" : 0.00
				});
			}
			$scope.isNewAdded = true;
     		 $scope.beneIndex = -1;
			$('#addBeneficiary').modal('show');
		}

		$scope.savePayment = function () {
			var data = {};
			data["addPaymentTasks"] = {};
			data["addPaymentTasks"]["nbfcId"] = parseInt($scope.nbfcId);
			data["addPaymentTasks"]["paymentDate"] = $scope.paymentAdd.paymentDate;
			data["addPaymentTasks"]["paymentAmt"] = $scope.paymentAdd.paymentAmount;
			data["addPaymentTasks"]["beneCount"] = $scope.paymentAdd.beneCount;

			var url = appEnvironment.PAYMENT_URL;
			lmsService.callApi(data, url, "addPaymentDetails", function (response) {
				$scope.submitEnabled = false;
				if (response.status == "success") {
					$("#addPayments").modal("hide");
					
					console.log("response is:::: " + JSON.stringify(response));
					var modalOptions = {
						actionButtonText: 'Ok',
						headerText: 'Information',
						bodyText: response.message
					};
					modalService.showModal({}, modalOptions).then(function (result) { });
					$scope.paymentAdd = {};
					console.log("$scope.paymentAdd"+JSON.stringify($scope.paymentAdd));
					$scope.nbfcDashboardDetails();
				} $scope.handleResponseError(response);
			});
			
		}

		$scope.updateBeneficiary = function(index, flag) {
			console.log("updateBeneficiary :: "+index);
			$scope.isDataModified = true;
			if(getListByValue($scope.beneficiaryList, 'id', index)['isNew'])
			{

			} else {
				$scope.updateBeneList.push($scope.beneficiaryList[index]);
			}

			if ($scope.isFetchData && flag) {
				console.log("inside fetchData");
				$scope.fetchData = true;
				$scope.isDataModified = false;
			}
			console.log("dataModified: " + $scope.dataModified);
		}

		$scope.saveBeneficiary = function () {
			console.log("$scope.actionVal: " + $scope.actionVal + " dataModified: " + $scope.dataModified);
			var data = {};
			data["addBeneficiaryDetails"] = {};
			data["nbfcId"] = parseInt($scope.nbfcId);
			data["paymentDate"] = $scope.date;
			data["paymentId"] = $scope.paymentId;
			data["calculationValue"] = $scope.totalAmount;
			data["paymentAmount"] = $scope.totalAmount;
			data["addBeneficiaryDetails"]["newRecords"] = [];
			data["addBeneficiaryDetails"]["updatedRecords"] = [];
			if ($scope.totalAmount == 0) {
				$scope.dataModified = true;
			}
			data["isDataModified"] = $scope.dataModified;
			for (var i = 0; i < $scope.beneficiaryList.length; i++) {
				if ($scope.beneficiaryList[i].isNew && !$scope.isUpload) {
					data["addBeneficiaryDetails"]["newRecords"].push($scope.beneficiaryList[i]);;
					$scope.newIndex = i;
				}
			}

			for (var i = 0; i < $scope.beneficiaryList.length; i++) {
				if (!$scope.beneficiaryList[i].isNew && !$scope.isUpload) {
					data["addBeneficiaryDetails"]["updatedRecords"].push($scope.beneficiaryList[i]);
					$scope.newIndex = i;
				}
			}

			
			// if ($scope.isBeneUpload) {
			// 	for (var i = 0; i < $scope.beneficiaryList.length; i++) {
			// 		if ($scope.beneficiaryList[i].isNew && $scope.beneficiaryList[i].isUpload) {
			// 			data["addBeneficiaryDetails"]["newRecords"] = $scope.beneficiaryList;
			// 			$scope.newIndex = i;
			// 		}
			// 	}
			// }

			console.log("$scope.isUpdated: " + $scope.isUpdated + " $scope.isNewAdded: " + $scope.isNewAdded);
			if ($scope.isUpdated && !$scope.isNewAdded) {
				console.log("inside if");
				data["addBeneficiaryDetails"]["updatedRecords"] = $scope.updateBeneList;
				console.log(" $scope.updateBeneList:"+ $scope.updateBeneList);
			}
			data["addBeneficiaryDetails"]["deletedRecords"] = [];
			data["addBeneficiaryDetails"]["deletedRecords"] = $scope.deletedRecord;

			$scope.validateBene = $scope.validateBeneficiaryDetails();
			console.log("$scope.validateBene:"+ JSON.stringify($scope.validateBene));
			if ($scope.validateBene.status == "success") {
				var url = appEnvironment.PAYMENT_URL;
				lmsService.callApi(data, url, "addUpdateBeneficiaryDetails", function (response) {
					$scope.submitEnabled = false;
					if (response.status == "success") {
						if($scope.totalAmount == 0){
							$scope.allowGenerateReports= true;
						}
						
						//$("#addBeneficiary").modal("hide");
						$scope.isBeneUpload = false;
						$scope.allowGenerate = true;
						$scope.updateBeneList = [];
						console.log("response is:::: " + JSON.stringify(response));
						if (!$scope.generateLetter) {
							//$("#addBeneficiary").modal("hide");
							var modalOptions = {
								actionButtonText: 'Ok',
								headerText: 'Information',
								bodyText: response.message
							};
							modalService.showModal({}, modalOptions).then(function (result) {
								$("#addBeneficiary").modal("hide");
							 });
						}
						$scope.paymentAdd = {};
						if ($scope.actionVal == 'paymentDetails') {
							$scope.nbfcDashboardDetails();
						} else if ($scope.actionVal == 'paymentMoreDetails'){
							$scope.moreDetails('Payments');
						} else {
							$scope.nbfcDashboardDetails();
						}
						
						if ($scope.updatedBeneficiary) {
							$scope.generatePaymentLetter();
						}
					} $scope.handleResponseError(response);
				});
			} else {
				console.log("$scope.validateBene.message: " + $scope.validateBene.message);
				document.getElementById("errorMsg").innerHTML = $scope.validateBene.message;
			}
		}

		$scope.resetData = function () {
			document.getElementById("infusionAmount").value = "";
			document.getElementById("paymentAmount").value = "";
			if (!checkEmptyField($scope.infusion.infusionAmount)) {
				$scope.infusion.infusionAmount = "";
			}
			$scope.infusion.customerNotification = "";
			$scope.infusion.infusionDate = $filter('date')(new Date(), 'dd-MM-yyyy');
			$scope.paymentAdd.paymentDate = $filter('date')(new Date(), 'dd-MM-yyyy');
			$scope.allowInfusionAdd = false;
			$scope.allowPaymentAdd = false;
		}

		$scope.resetStatementData = function() {
			$scope.allowStatementUpload = true;
			document.getElementById("statementUpload").value = "";
		}

		$scope.resetBeneficiary = function () {
			$scope.infusion = "";
			$scope.paymentAdd = "";
			document.getElementById("beneficiaryUpload").value = "";
			$scope.allowBeneficiaryUpload = true;
		}

		$scope.resetValues = function (id) {
			document.getElementById(id).value = "";
		}

		$scope.validateInfusion = function () {
			if (!checkEmptyField($scope.infusion.infusionDate) && !checkEmptyField($scope.infusion.infusionAmount) && !checkEmptyField($scope.infusion.customerNotification)) {
				$scope.allowInfusionAdd = true;
			} else {
				$scope.allowInfusionAdd = false;
			}
		}

		$scope.convertToDecimal = function() {
			if (!checkEmptyField($scope.infusion.infusionAmount)) {
				$scope.infusion.infusionAmount = parseFloat($scope.infusion.infusionAmount).toFixed(2);
			}
		}

		$scope.validateInfusionHistory = function () {
			if (!checkEmptyField($scope.infusionMonth) && !checkEmptyField($scope.infusionYear)) {
				$scope.allowInfusionHistory = true;
			} else {
				$scope.allowInfusionHistory = false;
			}
		}

		$scope.validatePaymentHistory = function() {
			if (!checkEmptyField($scope.paymentMonth) && !checkEmptyField($scope.paymentYear)) {
				$scope.allowPaymentHistory = true;
			} else {
				$scope.allowPaymentHistory = false;
			}
		}
		$scope.validateMutualHistory = function() {
			if (!checkEmptyField($scope.mutualMonth) && !checkEmptyField($scope.mutualYear)) {
				$scope.allowMutualHistory = true;
			} else {
				$scope.allowMutualHistory = false;
			}
		}

		$scope.statementUpload = function (id) {
			console.log("documentUploadController.statementUpload()");
			if (!document.getElementById(id)) {
				$scope.error = "Please Select File";
				return;
			}
			var fileInput = document.getElementById(id);
			if (fileInput.files[0].size > 2097152) {
				console.log("size if more than 2 mb");
				return;
			}
			var fileName = fileInput.files[0].name;
			console.log("filename::: " + fileName);
			var idx = fileName.lastIndexOf(".");
			var fileExt = fileName.substring(idx + 1, fileName.length);
			console.log("fileExt:: " + fileExt);
			if (fileExt.toLowerCase() != "csv") {
				$scope.error = "Only CSV Files are Allowed";
			}
			var data = {};
			var dataObj = {};
			data["fileName"] = fileName;
			data["nbfcId"] = $scope.nbfcId;
			data["statementDate"] = $filter('date')(new Date(), 'dd-MM-yyyy');
			dataObj["data"] = data;
			dataObj["action"] = "uploadStatement";
			var url = appEnvironment.STATEMENT_URL;
			lmsService.callFileApi(fileInput.files[0], dataObj, url, function (response) {
				if (response.status == "success") {
					$("#addStatement").modal("hide");
					var modalOptions = {
						actionButtonText: 'Ok',
						headerText: 'Information',
						bodyText: response.message
					};
					modalService.showModal({}, modalOptions).then(function (result) {
						if (response.status == "success") {
							$("#addStatement").modal("hide");
							$scope.getStatementData(false);
						}
					})
				} else if (response.status == "failed") {
					$("#addStatement").modal("hide");
					var modalOptions = {
						actionButtonText: 'Ok',
						headerText: 'Alert',
						bodyText: (response.message == undefined || response.message == null || response.message == "") ? 'There has been some internal issue.' : response.message
					};
					modalService.showModal({}, modalOptions).then(function (result) { });
				}
			});
		};

		$scope.paymentBeneficiaryUpload = function (id) {
			console.log("userController.beneficiaryUpload()");
			if (!document.getElementById(id)) {
				$scope.error = "Please Select File";
				return;
			}
			var fileInput = document.getElementById(id);
			if (fileInput.files[0].size > 2097152) {
				console.log("size if more than 2 mb");
				return;
			}
			var fileName = fileInput.files[0].name;
			var idx = fileName.lastIndexOf(".");
			var fileExt = fileName.substring(idx + 1, fileName.length);
			
			if (fileExt.toLowerCase() != "csv") {
				$scope.error = "Only CSV Files are Allowed";
			}
			var data = {};
			var dataObj = {};
			data["fileName"] = fileName;
			data["paymentId"] = $scope.paymentId;
			data["statementDate"] = $filter('date')(new Date(), 'dd-MM-yyyy');
			dataObj["data"] = data;
			dataObj["action"] = "uploadBeneficiary";
			var url = appEnvironment.PAYMENT_URL;
			lmsService.callFileApi(fileInput.files[0], dataObj, url, function (response) {
				if (response.status == "success") {
					$("#addPayBeneficiary").modal("hide");
					document.getElementById("beneficiaryUpload").value = "";
					$scope.isBeneUpload = true;
					$scope.isNewAdded = false;
					$scope.newBeneficiaryList = response.data.beneficiaryDataList;
					$.each($scope.newBeneficiaryList, function(key, value) {
						if($scope.beneficiaryList[$scope.beneficiaryList.length-1]['beneficiaryName'] == undefined || $scope.beneficiaryList[$scope.beneficiaryList.length-1]['beneficiaryName'] == '' ) {
							$scope.beneficiaryList.splice($scope.beneficiaryList.length-1, 1);
						}
						
						$scope.beneficiaryList.push(value);
						
						
						newIndex = "N"+$scope.beneficiaryList.length;
						value['id'] = newIndex;
						$scope.calcVal = $scope.calculatePaymentAmount(newIndex, false);
						console.log("$scope.calcVal: " + $scope.calcVal);
						
					});
					if ($scope.calcVal) {
						return;
					} else {
						var modalOptions = {
							actionButtonText: 'Ok',
							headerText: 'Information',
							bodyText: response.message
						};
						modalService.showModal({}, modalOptions).then(function (result) {});
						document.getElementById("beneficiaryUpload").value = "";
					}
				} else if (response.status == "failed") {
					$("#addPayBeneficiary").modal("hide");
					var modalOptions = {
						actionButtonText: 'Ok',
						headerText: 'Alert',
						bodyText: (response.message == undefined || response.message == null || response.message == "") ? 'There has been some internal issue.' : response.message
					};
					modalService.showModal({}, modalOptions).then(function (result) { });
				}
			});
		};

		$scope.scanCopyUpload = function (id) {
			console.log("userController.scanCopyUpload()");
			if (!document.getElementById(id)) {
				$scope.errorUpload = "Please Select File";
				return;
			}
			var fileInput = document.getElementById(id);
			if (fileInput.files[0].size > 2097152) {
				console.log("size if more than 2 mb");
				return;
			}
			var fileName = fileInput.files[0].name;
			console.log("filename::: " + fileName);
			var idx = fileName.lastIndexOf(".");
			var fileExt = fileName.substring(idx + 1, fileName.length);
			console.log("fileExt:: " + fileExt);
			if (fileExt.toLowerCase() != "pdf" && fileExt.toLowerCase() != "png" && fileExt.toLowerCase() != "jpg") {
				$scope.errorUpload = "Only PDF, JPG and PNG files are Allowed.";
			}

			if ($scope.errorUpload) {
				$scope.showModalPopup($scope.errorUpload);
				return;
			}

			var data = {};
			var dataObj = {};
			data["fileName"] = fileName;
			data["paymentId"] = $scope.paymentId;
			dataObj["data"] = data;
			dataObj["action"] = "uploadScannedCopy";
			var url = appEnvironment.PAYMENT_URL;
			lmsService.callFileApi(fileInput.files[0], dataObj, url, function (response) {
				if (response.status == "success") {
					$("#uploadScanFile").modal("hide");
					document.getElementById("uploadScanData").value = "";
					var modalOptions = {
						actionButtonText: 'Ok',
						headerText: 'Information',
						bodyText: response.message
					};
					modalService.showModal({}, modalOptions).then(function (result) {});
					$scope.nbfcDashboardDetails();
				}
			});
		};

		$scope.mfScanCopyUpload = function () {
			console.log("userController.mfScanCopyUpload()");
			if (!document.getElementById('uploadMfScanData')) {
				$scope.errorUpload = "Please Select File";
				return;
			}
			var fileInput = document.getElementById('uploadMfScanData');
			if (fileInput.files[0].size > 2097152) {
				console.log("size if more than 2 mb");
				return;
			}
			var fileName = fileInput.files[0].name;
			console.log("filename::: " + fileName);
			var idx = fileName.lastIndexOf(".");
			var fileExt = fileName.substring(idx + 1, fileName.length);
			console.log("fileExt:: " + fileExt);
			if (fileExt.toLowerCase() != "pdf" && fileExt.toLowerCase() != "png" && fileExt.toLowerCase() != "jpg") {
				$scope.errorUpload = "Only PDF, JPG and PNG files are Allowed.";
			}

			if ($scope.errorUpload) {
				$scope.showModalPopup($scope.errorUpload);
				return;
			}

			var data = {};
			var dataObj = {};
			data["fileName"] = fileName;
			data["mfInvestDate"] = $scope.investDate;
			data["nbfcId"] = $scope.nbfcId;
			dataObj["data"] = data;
			dataObj["action"] = "uploadScannedCopy";
			var url = appEnvironment.MUTUAL_FUND_URL;
			console.log("values: " + JSON.stringify(dataObj));
			lmsService.callFileApi(fileInput.files[0], dataObj, url, function (response) {
				if (response.status == "success") {
					$("#uploadScanFileMutual").modal("hide");
					document.getElementById("uploadMfScanData").value = "";
					var modalOptions = {
						actionButtonText: 'Ok',
						headerText: 'Information',
						bodyText: response.message
					};
					modalService.showModal({}, modalOptions).then(function (result) {});
					$scope.nbfcDashboardDetails();
				}
			});
		};

		$scope.paymentHistoryMore = function () {
			$('#paymentHistoryMore').modal('show');
		}
		
		$scope.getStatementData = function (value) {
			$scope.isMap = false;
			if (value) {
				$scope.isMappedView = true;
			} else {
				$scope.isMappedView = false;
			}
			var data = {};
			data["statementData"] = {};
			data["nbfcId"] = $scope.nbfcId;
			data["statementData"]["statementDate"] = $filter('date')(new Date(), 'dd-MM-yyyy');
			var url = appEnvironment.FUND_INFUSION_URL;
			lmsService.callApi(data, url, "getStatementUploadData", function (response) {
				if (response.status == "success") {
					$("#statementUploadData").modal("show");
					$scope.statementList = response.data.statementList;
					for (var i = 0; i < $scope.statementList.length; i++) {
					}
					// $scope.pagination['statementList'] = {
					// 	noOfRecords: 10,
					// 	displayRecords: 0,
					// 	currentPage: 1,
					// 	showing: '',
					// 	tableName: 'statementListTb',
					// 	varName: 'statementList',
                    //     pagearray: [],
					// 	pagination: ""
					// }
					// console.log("fundPagination Before :: "+JSON.stringify($scope.pagination['statementList']));
					// $scope.pagination['statementList'] = commonUtilityService.setPagination($scope.statementList, $scope.pagination['statementList']);
					// $scope.pagination['statementList'] = commonUtilityService.getPagination($scope.statementList, $scope.pagination['statementList']);
					// console.log("fundPagination After :: "+JSON.stringify($scope.pagination['statementList']));
				
				}
				
				
				$scope.handleResponseError(response);
			});
		}
	
		/* $scope.getRedeemptionsPending = function (investDate) {
			console.log("investDate: " + investDate);
			$("#redeemptionsPending").modal("show");
			var data = {};
			data["nbfcId"] = $scope.nbfcId;
			data["investmentDate"] = investDate;
			var url = appEnvironment.MUTUAL_FUND_URL;
			lmsService.callApi(data, url, "getInvestmentDetails", function (response) {
				if (response.status == "success") {
					console.log("response is:::: " + JSON.stringify(response));
					$scope.investmentListRTb = angular.copy(response.data.investDetailsList);
					console.log("$scope.investmentListRTb  " + JSON.stringify($scope.investmentListRTb));
				} $scope.handleResponseError(response);
			});
		} */
		$scope.getMutualData = function (investDate, type) {
			$scope.mutualInvestmentDate = investDate;
			var action = "";
			console.log("investDate: " + investDate);
			if (type == 'investment') {
				$("#mutualStatementUploadReconData").modal("show");
				action = "getInvestmentDetails";
			} else {
				$("#redeemptionsPending").modal("show");
				action = "getRedemptionsDetails";
			}
			var data = {};
			data["nbfcId"] = $scope.nbfcId;
			data["investmentDate"] = investDate;
			data["type"] = type;
			$scope.mutualType = type;
			var url = appEnvironment.MUTUAL_FUND_URL;
			lmsService.callApi(data, url, action, function (response) {
				if (response.status == "success") {
					console.log("response is:::: " + JSON.stringify(response));
					if (type == 'investment') {
						$scope.investmentListRTb = angular.copy(response.data.investDetailsList);	
					} else {
						$scope.redemptionListRTb = angular.copy(response.data.redeemDetailsList);
					}
				} $scope.handleResponseError(response);
			});
		}
    	$scope.getPaymentBeneData = function (paymentId) {
			console.log("paymentId: " + paymentId);
			$("#paymentStatementUploadReconData").modal("show");
			var data = {};
			data["paymentDetails"] = {};
			data["paymentDetails"]["paymentId"] = paymentId;
			var url = appEnvironment.PAYMENT_URL;
			lmsService.callApi(data, url, "getPaymentBeneData", function (response) {
				if (response.status == "success") {
					console.log("response is:::: " + JSON.stringify(response));
					$scope.paymentBeneListRTb = response.data.beneficiaryDetailsList;
				} $scope.handleResponseError(response);
			});
		}

		$scope.pullBack = function (paymentId) {
			console.log("paymentId: " + paymentId);
			var data = {};
			data["paymentId"] = paymentId;
			var modalOptions = {
				isCloseEnabled: true,
				closeButtonText: 'No',
				actionButtonText: 'Yes',
				headerText: 'Information',
				bodyText: 'Are you sure you want to Pullback the payment ?',
			};
			modalService.showModal({}, modalOptions).then(function (result) {
				var url = appEnvironment.PAYMENT_URL;
				lmsService.callApi(data, url, "pullBackPayment", function (response) {
					if (response.status == "success") {
						$("#addBeneficiary").modal("hide");
						$("#sendToChecker").modal("hide");
						$scope.nbfcDashboardDetails();
						$scope.showModalPopup(response.message);
						$scope.generateLetter = false;
					} $scope.handleResponseError(response);
				});
			});
		}
		$scope.pullBackMutual = function (investDate) {
			console.log("investDate: " + investDate);
			var data = {};
			
			data["nbfcId"] = $scope.nbfcId;
			data["investmentDate"] = investDate;

			var modalOptions = {
				isCloseEnabled: true,
				closeButtonText: 'No',
				actionButtonText: 'Yes',
				headerText: 'Information',
				bodyText: 'Are you sure you want to Pullback the payment ?',
			};
			modalService.showModal({}, modalOptions).then(function (result) {
				var url = appEnvironment.MUTUAL_FUND_URL;
				lmsService.callApi(data, url, "pullBackInvestment", function (response) {
					if (response.status == "success") {
						$("#addBeneficiary").modal("hide");
						$("#sendtoCheckerMutual").modal("hide");
						$scope.nbfcDashboardDetails();
						$scope.showModalPopup(response.message);
					} $scope.handleResponseError(response);
				});
			});
		}

		$scope.reconBeneficiaryAmount = function (id, paymentAmount, paymentId) {
			console.log("beneficiaryId: " + id + "paymentId " + paymentId + " paymentAmount: " + paymentAmount + " nbfcId: " + $scope.nbfcId);
			var data = {};
			$scope.paymentId = paymentId;
			$scope.beneficiaryId = id;
			data["paymentReconDetails"] = {};
			data["paymentReconDetails"]["paymentId"] = paymentId;
			data["paymentReconDetails"]["paymentAmount"] = paymentAmount;
			data["paymentReconDetails"]["nbfcId"] = $scope.nbfcId;
			var url = appEnvironment.PAYMENT_URL;
			lmsService.callApi(data, url, "getPaymentReconData", function (response) {
				if (response.status == "success") {
					$scope.allowMapping = true;
					console.log("response is:::: " + JSON.stringify(response));
					$scope.statementDetailsList = response.data.statementDetailsList;
					if ($scope.statementDetailsList.length == 0) {
						$scope.showModalPopup("No Matching Debits Found.");
					} else {
						$("#reconMapPayment").modal("show");
					}
					//  $scope.pagination['statementDetailsListTb'] = {
					// 	noOfRecords: 5,
					// 	displayRecords: 0,
					// 	currentPage: 1,
					// 	showing: '',
					// 	tableName: 'statementDetailsListTb',
					// 	varName: 'statementDetailsList',
                    //     pagearray: [],
					// 	pagination: ""
					// }
					// console.log("fundPagination Before :: "+JSON.stringify($scope.pagination['statementDetailsListTb']));
					// $scope.pagination['statementDetailsListTb'] = commonUtilityService.setPagination($scope.statementDetailsListTb, $scope.pagination['statementList']);
					// $scope.pagination['statementDetailsListTb'] = commonUtilityService.getPagination($scope.statementDetailsListTb, $scope.pagination['statementList']);
					// console.log("fundPagination After :: "+JSON.stringify($scope.pagination['statementDetailsListTb'])); 
				} $scope.handleResponseError(response);
			});
		}

		
		$scope.reconInvestmentAmount = function (id, investAmount,statementDate) {
			console.log("statementDate " + statementDate + " investAmount: " + investAmount);
			var data = {};
			data["statementData"] = {};
			$scope.mfTransId = id;
			$scope.statementDate = statementDate;
			$scope.investmentAmt = investAmount;
			data["statementData"]["id"] = id;
			data["statementData"]["investAmount"] = investAmount;
			data["statementData"]["statementDate"] = statementDate;
			data["statementData"]["nbfcId"] = $scope.nbfcId;
			data["statementData"]["type"] = $scope.mutualType;
			var url = appEnvironment.MUTUAL_FUND_URL;
			lmsService.callApi(data, url, "getStatementUploadData", function (response) {
				if (response.status == "success") {
					$scope.allowMapping = true;
					console.log("response is:::: " + JSON.stringify(response));
					$scope.statementInvestDetailsList = angular.copy(response.data.statementList);
					$scope.statementType = response.data.type;
					console.log("$scope.statementInvestDetailsList"+JSON.stringify($scope.statementInvestDetailsList));
					if ($scope.statementInvestDetailsList.length == 0) {
						$scope.showModalPopup("No Matching Debits Found.");
					} else {
						$("#reconMapInvestmentStatement").modal("show");
					}
				
				} $scope.handleResponseError(response);
			});
		}
			
		$scope.reconRedeemptionsAmount = function (id, investAmount,statementDate) {
			console.log("statementDate " + statementDate + " investAmount: " + investAmount);
			var data = {};
			data["statementData"] = {};
			$scope.mfTransId = id;
			$scope.statementDate = statementDate;
			$scope.investmentAmt = investAmount;
			data["statementData"]["id"] = id;
			data["statementData"]["investAmount"] = investAmount;
			data["statementData"]["statementDate"] = statementDate;
			data["statementData"]["nbfcId"] = $scope.nbfcId;
			data["statementData"]["type"] = $scope.mutualType;
			var url = appEnvironment.MUTUAL_FUND_URL;
			lmsService.callApi(data, url, "getStatementUploadData", function (response) {
				if (response.status == "success") {
					$scope.allowMapping = true;
					console.log("response is:::: " + JSON.stringify(response));
					$scope.statementInvestDetailsList = angular.copy(response.data.statementList);
					console.log("$scope.statementInvestDetailsList"+JSON.stringify($scope.statementInvestDetailsList));
					if ($scope.statementInvestDetailsList.length == 0) {
						$scope.showModalPopup("No Matching Debits Found.");
					} else {
						$("#reconMapRedeemptionStatement").modal("show");
					}
				
				} $scope.handleResponseError(response);
			});
		}

		$scope.getStatementReconData = function (id, amount, statementDate) {
			$scope.infusionId = id;
			var data = {};
			data["statementData"] = {};
			data["statementData"]["statementDate"] = $filter('date')(statementDate, 'dd-MM-yyyy');
			data["statementData"]["reconAmount"] = removeCommaFromINRValue(amount);
			data["nbfcId"] = $scope.nbfcId;
			$scope.reconAmount = amount;
			var url = appEnvironment.FUND_INFUSION_URL;
			lmsService.callApi(data, url, "getStatementUploadData", function (response) {
				if (response.status == "success") {
					$scope.statementListR = response.data.statementList;
					for (var i = 0; i < $scope.statementListR.length; i++) {
					}
					if ($scope.statementListR.length > 0) {
						$("#statementUploadReconData").modal("show");
					} else{
						var modalOptions = {
							actionButtonText: 'Ok',
							headerText: 'Information',
							bodyText: 'No matching credit found.',
						};
						modalService.showModal({}, modalOptions).then(function (result) { });
					}
					$scope.pagination['statementListR'] = {
						noOfRecords: 2,
						displayRecords: 0,
						currentPage: 1,
						showing: '',
						tableName: 'statementListRTb',
						varName: 'statementListR',
                        pagearray: [],
						pagination: ""
					}
					console.log("fundPagination Before :: "+JSON.stringify($scope.pagination['statementListR']));
					$scope.pagination['statementListR'] = commonUtilityService.setPagination($scope.statementListR, $scope.pagination['statementListR']);
					$scope.pagination['statementListR'] = commonUtilityService.getPagination($scope.statementListR, $scope.pagination['statementListR']);
					console.log("fundPagination After :: "+JSON.stringify($scope.pagination['statementListR']));
				}
				$scope.handleResponseError(response);
			});
		}

		$scope.validateBeneficiaryUpload = function (id) {
			console.log("value: " + document.getElementById(id).value);
			if (checkEmptyField(document.getElementById(id).value)) {
				$scope.allowBeneficiaryUpload = true;
			} else {
				$scope.allowBeneficiaryUpload = false;
			}
			console.log("$scope.allowBeneficiaryUpload: " + $scope.allowBeneficiaryUpload);
			if (!$scope.$$phase) {
				$scope.$apply();
			}
		}

		$scope.validateScanUpload = function (id) {
			console.log("value: " + document.getElementById(id).value);
			if (checkEmptyField(document.getElementById(id).value)) {
				$scope.allowScanUpload = true;
			} else {
				$scope.allowScanUpload = false;
			}
			console.log("$scope.allowScanUpload: " + $scope.allowScanUpload);
			if (!$scope.$$phase) {
				$scope.$apply();
			}
		}

		$scope.validateStatementUpload = function (id) {
			console.log("value: " + document.getElementById(id).value);
			if (checkEmptyField(document.getElementById(id).value)) {
				$scope.allowStatementUpload = true;
			} else {
				$scope.allowStatementUpload = false;
			}
			console.log("$scope.allowStatementUpload: " + $scope.allowStatementUpload);
			if (!$scope.$$phase) {
				$scope.$apply();
			}
		}

		$scope.fetchMutualFundDetails = function () {
			var data = {};
			data["nbfcId"] = $scope.nbfcId;
			var url = appEnvironment.MUTUAL_FUND_URL;
			lmsService.callApi(data, url, "viewMutualFunds", function (response) {
				if (response.status == "success") {
					// $scope.items[0].mutualFundList = response.data.mutualFundList;
					$scope.mutualFundList = response.data.mutualFundList;
					$scope.groups[0].mutualFundList = response.data.mappedMfList;
					console.log("response mutualFundList" + JSON.stringify($scope.mutualFundList) + "$scope.groups[0].mutualFundList: " + JSON.stringify($scope.groups[0].mutualFundList) + "$scope.items[0].mutualFundList: " + JSON.stringify($scope.items[0].mutualFundList));
					var windowHeight = $(window).height() - 200;
					$scope.maxRows = Math.ceil(windowHeight / 50);
					
					$scope.maxRows = 7;
				}
				$scope.handleResponseError(response);
			});
		}

		// $scope.validateMutual = function () {
		// 	if (!checkEmptyField($scope.selectedMutual)) {
		// 		$scope.allowMutualAdd = true;
		// 	} else {
		// 		$scope.allowMutualAdd = false;
		// 	}
		// }

		$scope.validatePayment = function () {
			console.log("paymentAdd :: "+JSON.stringify($scope.paymentAdd));
			if (!checkEmptyField($scope.paymentAdd.paymentDate) && !checkEmptyField($scope.paymentAdd.paymentAmount)) {
				$scope.allowPaymentAdd = true;
			} else {
				$scope.allowPaymentAdd = false;
			}
		}

		$scope.enableMapping = function() {
			$scope.isMap = true;
		}

		$scope.getStatementValue = function (id, amount) {
			console.log("idVal: " + id);
			$scope.statementId = id;
			$scope.redemAmount = amount;
			$scope.allowMapping = false;
		}

		$scope.mapStatement = function () {
			var data = {};
			var url;
			var action;
			data["statementMapDetails"] = {};
			data["statementMapDetails"]["statementId"] = $scope.statementId;
			if ($scope.stateAction == "infusionToDoList") {
				data["statementMapDetails"]["infusionId"] = $scope.infusionId;
				data["statementMapDetails"]["nbfcId"] = $scope.nbfcId;
				data["statementMapDetails"]["infusionAmount"] = removeCommaFromINRValue($scope.reconAmount);
				url = appEnvironment.FUND_INFUSION_URL;
				action = "mapInfusionData";
			} else if ($scope.stateAction == "paymentToDoList") {
				data["statementMapDetails"]["beneId"] = $scope.beneficiaryId;
				data["statementMapDetails"]["paymentId"] = $scope.paymentId;
				data["statementMapDetails"]["nbfcId"] = $scope.nbfcId;
				data["statementMapDetails"]["paymentAmount"] = removeCommaFromINRValue($scope.reconAmount);
				url = appEnvironment.PAYMENT_URL;
				action = "mapPaymentData";
			} else if ($scope.stateAction == "investmentToDoList") {
				data["statementMapDetails"]["id"] = $scope.mfTransId;
				data["statementMapDetails"]["nbfcId"] = $scope.nbfcId;
				data["statementMapDetails"]["investmentDate"] = $scope.statementDate;
				data["statementMapDetails"]["investmentAmount"] = $scope.investmentAmt;
				data["statementMapDetails"]["redemAmount"] = $scope.redemAmount;
				url = appEnvironment.MUTUAL_FUND_URL;
				if ($scope.mutualType == 'investment') {
					action = "mapInvestmentsData";
				} else {
					action = "mapRedemptionsData";
				}
			} 

			lmsService.callApi(data, url, action, function (response) {
				if (response.status == "success") {
					if ($scope.stateAction == 'infusionToDoList') {
						$("#statementUploadReconData").modal("hide");
					} else if ($scope.stateAction == 'paymentToDoList') {
						$("#reconMapPayment").modal("hide");
						$scope.getPaymentBeneData($scope.paymentId);
					} else {
						if ($scope.mutualType == 'investment') {
							$("#reconMapInvestmentStatement").modal("hide");
							$scope.getMutualData(response.data.investmentDate, $scope.mutualType);
						} else {
							$("#reconMapRedeemptionStatement").modal("hide");
							$scope.getMutualData(response.data.investmentDate, $scope.mutualType);
						}
					}
					console.log("response is:::: " + JSON.stringify(response));
					var modalOptions = {
						actionButtonText: 'Ok',
						headerText: 'Information',
						bodyText: response.message
					};
					modalService.showModal({}, modalOptions).then(function (result) { });
					$scope.nbfcDashboardDetails();
				} $scope.handleResponseError(response);
			});
		}

		$scope.mapMiscellaneousStatement = function () {
			var data = {};
			data["statementMapDetails"] = {};
			data["statementMapDetails"]["statementId"] = $scope.statementId;
			data["statementMapDetails"]["nbfcId"] = $scope.nbfcId;
			var url = appEnvironment.STATEMENT_URL;
			var action = "mapMiscellaneousCrDr";

			lmsService.callApi(data, url, action, function (response) {
				if (response.status == "success") {
					$("#statementUploadData").modal("hide");
					console.log("response is:::: " + JSON.stringify(response));
					var modalOptions = {
						actionButtonText: 'Ok',
						headerText: 'Information',
						bodyText: response.message
					};
					modalService.showModal({}, modalOptions).then(function (result) { });
					$scope.nbfcDashboardDetails();
				} $scope.handleResponseError(response);
			});
		}

		$scope.editInfusionDetails = function () {
			console.log("inside editInfusionDetails");
			if (checkEmptyField($scope.editinfusion.infusionDate)) {
				document.getElementById("editInfusionDate").innerHTML = "Please enter Infusion Date.";
				return;
			} else if (checkEmptyField($scope.editinfusion.infusionAmount)) {
				document.getElementById("editInfusionAmount").innerHTML = "Please enter Infusion Amount.";
				return;
			}

			data["editFundInfusionDetails"] = {};
			data["editFundInfusionDetails"]["id"] = $scope.editId;
			data["editFundInfusionDetails"]["nbfcId"] = parseInt($scope.nbfcId);
			data["editFundInfusionDetails"]["infusionDate"] = $scope.editinfusion.infusionDate;
			data["editFundInfusionDetails"]["notification"] = $scope.editinfusion.customerNotification;
			data["editFundInfusionDetails"]["infusionAmount"] = removeCommaFromINRValue($scope.editinfusion.infusionAmount);
			data["isInfusionModified"] = $scope.infusionDataModified;
			var url = appEnvironment.FUND_INFUSION_URL;
			lmsService.callApi(data, url, "editFundInfusion", function (response) {
				$scope.submitEnabled = false;
				if (response.status == "success") {
					$("#editInfusion").modal("hide");
					console.log("response is:::: " + JSON.stringify(response));
					var modalOptions = {
						actionButtonText: 'Ok',
						headerText: 'Information',
						bodyText: response.message
					};
					modalService.showModal({}, modalOptions).then(function (result) { });
					$scope.infusion = {};
					$scope.nbfcDashboardDetails();
					if ($scope.allInfusionData) {
						$scope.moreDetails('Infusion');
					}
				} $scope.handleResponseError(response);
			});
		}

		$scope.closeMoreInfusion = function() {
			$scope.allInfusionData = false;
			$scope.moreDetailsFlag = false;

			document.getElementById("checkInfusion").value = "0";
		}

		$scope.sendToChecker = function() {
			var data = {};
			data["paymentId"] = $scope.paymentId;
			var url = appEnvironment.PAYMENT_URL;
			lmsService.callApi(data, url, "submitToChecker", function (response) {
				console.log('response >>' + JSON.stringify(response));
				if (response.status == "success") {
					$("#generatePdf").modal('hide');
					$("#sendToChecker").modal('hide');
					var modalOptions = {
						isCloseEnabled: false,
						headerText: 'Information',
						bodyText: response.message
					};
					modalService.showModal({}, modalOptions).then(function (result) { });
					$scope.nbfcDashboardDetails();
				} else if (response.status == "failed") {
					var modalOptions = {
						isCloseEnabled: false,
						headerText: 'Information',
						bodyText: (response.message == undefined || response.message == null || response.message == "") ? 'There has been some internal issue.' : response.message
					};
					modalService.showModal({}, modalOptions).then(function (result) { });
				}
			});
		}

		$scope.submitMutualFund = function () {
			var data = {};
			data["investmentDate"] = $scope.investmentDate;
			data["nbfcId"] = $scope.nbfcId;
			var url = appEnvironment.MUTUAL_FUND_URL;
			lmsService.callApi(data, url, "submitToChecker", function (response) {
				console.log('response >>' + JSON.stringify(response));
				if (response.status == "success") {
					$("#sendtoCheckerMutual").modal('hide');
					var modalOptions = {
						isCloseEnabled: false,
						headerText: 'Information',
						bodyText: response.message
					};
					modalService.showModal({}, modalOptions).then(function (result) { });
					$scope.nbfcDashboardDetails();
				} $scope.handleResponseError(response);
			});
		}

		$scope.deleteFromDashboard = function (id, deleteVal, date, amount) {
			var url;
			var action;
			$scope.value = deleteVal;
			if (deleteVal == "InfusionMore") {
				$scope.value = "Infusion";
			} else if (deleteVal == "PaymentsMore"){
				$scope.value = "Payments";
			}else if (deleteVal == "MutualMore"){
				$scope.value = "Mutual";
			}
			var modalOptions = {
				isCloseEnabled: true,
				actionButtonText: 'Yes',
				closeButtonText: 'No',
				headerText: 'Alert',
				bodyText: 'Do you want to delete the ' + $scope.value + ' Dated: ' + date + ' and Amount: ' + amount + ' ?'
			};
			modalService.showModal({}, modalOptions).then(function (result) {
				console.log("deleteData() called");
				if (deleteVal == "Infusion" || deleteVal == "InfusionMore") {
					data["infusionDetails"] = {};
					data["infusionDetails"]["infusionId"] = id;
					data["infusionDetails"]["amount"] = removeCommaFromINRValue(amount);
					url = appEnvironment.FUND_INFUSION_URL;
					action = 'deleteFundInfusion';
				} else if (deleteVal == "Mutual Fund") {
					data["investmentDetails"] = {};
					data["investmentDetails"]["nbfcId"] = $scope.nbfcId;
					data["investmentDetails"]["investmentDate"] = date;
					url = appEnvironment.MUTUAL_FUND_URL;
					action = 'deleteInvestments';
				} else if (deleteVal == "Payments" || deleteVal == "PaymentsMore") {
					data["paymentDetails"] = {};
					data["paymentDetails"]["paymentId"] = id;
					data["paymentDetails"]["paymentAmount"] = removeCommaFromINRValue(amount);
					url = appEnvironment.PAYMENT_URL;
					action = 'deletePayments';
				}

				lmsService.callApi(data, url, action, function (response) {
					console.log('response >>' + JSON.stringify(response));
					if (response.status == "success") {
						var modalOptions = {
							isCloseEnabled: false,
							headerText: 'Information',
							bodyText: response.message
						};
						modalService.showModal({}, modalOptions).then(function (result) { });
						$scope.nbfcDashboardDetails();
						if (deleteVal == "InfusionMore") {
							$scope.moreDetails('Infusion');
						} else if (deleteVal == "PaymentsMore") {
							$scope.moreDetails('Payments');
						}
					} else if (response.status == "failed") {
						var modalOptions = {
							isCloseEnabled: false,
							headerText: 'Information',
							bodyText: (response.message == undefined || response.message == null || response.message == "") ? 'There has been some internal issue.' : response.message
						};
						modalService.showModal({}, modalOptions).then(function (result) { });
					}
				});
			});
		}

		$scope.closeHistory = function() {
			$scope.moreDetailsFlag = false;
		}

		$scope.moreDetails = function (value) {
			$scope.moreDetailsFlag = true;
			var url;
			var action;
			if (value == "Infusion") {
				$scope.allInfusionData = true;
				$('#moreInfusionRequest').modal('show');
				url = appEnvironment.FUND_INFUSION_URL;
				action = "viewFundInfusion"
			} else {
				$scope.allInfusionData = false;
				$('#paymentHistoryMore').modal('show');
				url = appEnvironment.PAYMENT_URL;
				action = "viewPayments";
			}
			var data = {};
			data["nbfcId"] = $scope.nbfcId;
			lmsService.callApi(data, url, action, function (response) {
				console.log("data fetched: " + response);
				if (response.status == "success") {
					if (value == "Infusion") {
						$scope.fundInfusionList = response.data.fundInfusionList;
						for (var i = 0; i < $scope.fundInfusionList.length; i++) {
						}
					} else {
						$scope.paymentDetailsList = response.data.paymentDetailsList;
						for (var i = 0; i < $scope.paymentDetailsList.length; i++) {
						}
					}
					if (value == "Infusion") {
					$scope.pagination['fundInfusionList'] = {
						noOfRecords: 10,
						displayRecords: 0,
						currentPage: 1,
						showing: '',
						tableName: 'fundInfusionListTb',
						varName: 'fundInfusionList',
                        pagearray: [],
						pagination: ""
					}
					console.log("fundPagination Before :: "+JSON.stringify($scope.pagination['fundInfusionList']));
					$scope.pagination['fundInfusionList'] = commonUtilityService.setPagination($scope.fundInfusionList, $scope.pagination['fundInfusionList']);
					$scope.pagination['fundInfusionList'] = commonUtilityService.getPagination($scope.fundInfusionList, $scope.pagination['fundInfusionList']);
					console.log("fundPagination After :: "+JSON.stringify($scope.pagination['fundInfusionList']));
					
				}	
			 
				$scope.handleResponseError(response);
		}
			});
		}

	

		$scope.groups = [{
			mutualFundList: [],
		}];
		$scope.items = [{
			mutualFundList: [],
		}];


		$scope.addMutualFunds = function () {
			$('#addMutualFunds').modal('show');
			$scope.fetchMutualFundDetails();
			//$scope.mutualFundList.push($scope.items);
			console.log("$scope.mutualFundList" + JSON.stringify($scope.mutualFundList));
			console.log("$scope.items" + JSON.stringify($scope.items));
			
		
			
		}

		$scope.moreMutualFunds = function () {
			$('#moreMutualFunds').modal('show');
		}

		$scope.addPayments = function () {
			 $scope.paymentAdd = {};
			document.getElementById("paymentAmount").value = "";
			console.log("$scope.paymentAdd111"+JSON.stringify($scope.paymentAdd));
			$('#addPayments').modal('show');
			$scope.allowPaymentAdd = false;
			$scope.paymentAdd.paymentDate = $filter('date')(new Date(), 'dd-MM-yyyy');
			//$("#paymentDate").datepicker('setDate', new Date());
			$scope.someScopeVariable = '0.00'
			
		}

		$scope.morePayments = function () {
			$('#morePayments').modal('show');
		}

		$scope.paymentHistoryMore = function () {
			$('#paymentHistoryMore').modal('show');
		}

		$scope.infusionEdit = function () {

		}

		$scope.addStatement = function () {
			$scope.allowStatementUpload = true;
			$scope.idValue = 'statementUpload';
			document.getElementById("statementUpload").value = "";
			$('#addStatement').modal('show');
		}

		$scope.addPaymentBeneficiary = function () {
			$('#addPayBeneficiary').modal('show');
			document.getElementById("beneficiaryUpload").value = "";
		}
		
		$scope.validateBeneficiaryDName = function () {
			$scope.errorMsg = {};
			for (var i = 0; i < $scope.beneficiaryList.length; i++) {
            if (checkEmptyField($scope.beneficiaryList[i].beneficiaryName)) {
				flag = true;
				$scope.errorMsg["status"] = "failed";
				$scope.errorMsg["message"] = "Please enter Beneficiary Name.";
			} else if ($scope.beneficiaryList[i].beneficiaryName.length < 9) {
				flag = true;
				$scope.errorMsg["status"] = "failed";
				$scope.errorMsg["message"] = "Account number length varies from 9 digits to 18 digit.";
			} else if (!nameValid($scope.beneficiaryList[i].beneficiaryName)) {
				flag = true;
				$scope.errorMsg["status"] = "failed";
				$scope.errorMsg["message"] = "Invalid value for Beneficiary Name.";
			}
		}
		}
		
		$scope.validateBeneficiaryDetails = function () {
			console.log("validateBeneficiaryDetails: " + JSON.stringify($scope.beneficiaryList));
			var flag = false;
			$scope.errorMsg = {};
			if ($scope.beneficiaryList.length > 0) {
				console.log("inside if");
				for (var i = 0; i < $scope.beneficiaryList.length; i++) {
					if (checkEmptyField($scope.beneficiaryList[i].beneficiaryName)) {
						flag = true;
						$scope.errorMsg["status"] = "failed";
						$scope.errorMsg["message"] = "Please enter Beneficiary Name.";
						break;
					} else if (!nameValid($scope.beneficiaryList[i].beneficiaryName)) {
						flag = true;
						$scope.errorMsg["status"] = "failed";
						$scope.errorMsg["message"] = "Invalid value for Beneficiary Name.";
						break;
					}
					console.log("$scope.errorMsg: " + JSON.stringify($scope.errorMsg));
					if (checkEmptyField($scope.beneficiaryList[i].accountNo)) {
						flag = true;
						$scope.errorMsg["status"] = "failed";
						$scope.errorMsg["message"] = "Please enter Account Number";
						break;
					} else if ($scope.beneficiaryList[i].accountNo.length < 9) {
						flag = true;
						$scope.errorMsg["status"] = "failed";
						$scope.errorMsg["message"] = "Account number length varies from 9 digits to 18 digit.";
						break;
					}else if (!numberValid($scope.beneficiaryList[i].accountNo)) {
						flag = true;
						$scope.errorMsg["status"] = "failed";
						$scope.errorMsg["message"] = "Invalid value for Account Number";
						console.log("$scope.errorMsgval: " + JSON.stringify($scope.errorMsg));
						break;
					}
					console.log("$scope.errorMsg1: " + JSON.stringify($scope.errorMsg));
					if (checkEmptyField($scope.beneficiaryList[i].typeOfAccount)) {
						flag = true;
						$scope.errorMsg["status"] = "failed";
						$scope.errorMsg["message"] = "Please enter Type of Account";
						break;
					} else if (!characterValid($scope.beneficiaryList[i].typeOfAccount)) {
						flag = true;
						$scope.errorMsg["status"] = "failed";
						$scope.errorMsg["message"] = "Invalid value for Type of Account";
						break;
					}
					console.log("$scope.errorMsg2: " + JSON.stringify($scope.errorMsg));
					if (checkEmptyField($scope.beneficiaryList[i].nameOfBank)) {
						flag = true;
						$scope.errorMsg["status"] = "failed";
						$scope.errorMsg["message"] = "Please enter Name of Bank";
						break;
					} else if (!bankNameValid($scope.beneficiaryList[i].nameOfBank)) {
						flag = true;
						$scope.errorMsg["status"] = "failed";
						$scope.errorMsg["message"] = "Invalid value for Name of Bank";
						break;
					}
					console.log("$scope.errorMsg3: " + JSON.stringify($scope.errorMsg));
					if (checkEmptyField($scope.beneficiaryList[i].branchAddress)) {
						flag = true;
						$scope.errorMsg["status"] = "failed";
						$scope.errorMsg["message"] = "Please enter Branch Address";
						break;
					} else if (!addressValid($scope.beneficiaryList[i].branchAddress)) {
						flag = true;
						$scope.errorMsg["status"] = "failed";
						$scope.errorMsg["message"] = "Invalid value for Branch Address";
						break;
					}
					console.log("$scope.errorMsg4: " + JSON.stringify($scope.errorMsg));
					if (checkEmptyField($scope.beneficiaryList[i].ifscCode)) {
						flag = true;
						$scope.errorMsg["status"] = "failed";
						$scope.errorMsg["message"] = "Please enter IFSC code";
						break;
					} else if (!ifscValid($scope.beneficiaryList[i].ifscCode)) {
						flag = true;
						$scope.errorMsg["status"] = "failed";
						$scope.errorMsg["message"] = "Invalid value for IFSC code";
						break;
					}else if (nameValid($scope.beneficiaryList[i].ifscCode)) {
						flag = true;
						$scope.errorMsg["status"] = "failed";
						$scope.errorMsg["message"] = "Invalid value for IFSC code";
						break;
					}
					console.log("$scope.errorMsg5: " + JSON.stringify($scope.errorMsg));
					if (checkEmptyField($scope.beneficiaryList[i].paymentAmt)) {
						flag = true;
						$scope.errorMsg["status"] = "failed";
						$scope.errorMsg["message"] = "Please enter Payment Amount";
						break;
					} else if (!decimalValid($scope.beneficiaryList[i].paymentAmt)) {
						flag = true;
						$scope.errorMsg["status"] = "failed";
						$scope.errorMsg["message"] = "Invalid value for Payment Amount";
						break;
					}
					console.log("$scope.errorMsg6: " + JSON.stringify($scope.errorMsg));
					// if (checkEmptyField($scope.beneficiaryList[i].annexure)) {
					// 	flag = true;
					// 	$scope.errorMsg["status"] = "failed";
					// 	$scope.errorMsg["message"] = "Please enter Annexure";
					// 	break;
					// } else if (alphaNumericValid($scope.beneficiaryList[i].annexure)) {
					// 	flag = true;
					// 	$scope.errorMsg["status"] = "failed";
					// 	$scope.errorMsg["message"] = "Invalid value for Annexure";
					// 	break;
					// }
					// console.log("$scope.errorMsg7: " + JSON.stringify($scope.errorMsg));
				}

				console.log("$scope.errorMsg8: " + JSON.stringify($scope.errorMsg));
				if (flag) {
					return $scope.errorMsg;
				}
			}
			$scope.errorMsg["status"] = "success";
			console.log("validateBeneficiaryDetails: " + JSON.stringify($scope.errorMsg));
			return $scope.errorMsg;
		}
		$scope.validateMessge =function(){
			document.getElementById("errorMsg").innerHTML = "";
			console.log("$scope.errorMsg "+JSON.stringify($scope.errorMsg ))
		}
		$scope.calculatePaymentAmount = function(index, flag) {
			
			$scope.totalAmount = getSum($scope.beneficiaryList, 'paymentAmt');
			$scope.totalAmount = $scope.totalPaymentAmount - $scope.totalAmount;
			if(index != undefined) {
				currIndex = getIndexByValue($scope.beneficiaryList, 'id', index);
				if($scope.totalAmount < 0) {
					$("#"+index).val(0.00)
					$scope.beneficiaryList[currIndex]['paymentAmt'] = 0.00;
					$scope.calculatePaymentAmount(index, false);
					var modalOptions = {
						actionButtonText: 'Ok',
						headerText: 'Information',
						bodyText: 'Amount is exceeding available balance.'
					};
					modalService.showModal({}, modalOptions).then(function (result) {});
					return true;
				}
			}
			
			console.log("calculatePaymentAmount called :: " + JSON.stringify($scope.beneficiaryList));
			if (flag) {
				$scope.updateBeneficiary(index, true);
			} else {
				$scope.updateBeneficiary(index, false);
			}
		}

		$scope.viewPaymentBeneficiaryDetails = function (paymentId) {

			data["paymentId"] = paymentId;
			var url = appEnvironment.PAYMENT_URL;
			lmsService.callApi(data, url, "viewPaymentBeneficiaryDetails", function (response) {
				$scope.allowInfusionAdd = true;
				if (response.status == "success") {
					$scope.beneficiaryList = angular.copy(response.data.paymentBeneficiaryList);
					
					if ($scope.beneficiaryList.length == 0) {
						$scope.beneficiaryList.push({});
						$scope.beneficiaryList[0].isNew = true;
						$scope.beneficiaryList[0].id = "N"+$scope.beneficiaryList.length;
						$scope.beneficiaryList[0].paymentAmt = 0.00;
					} else {
						for (var i = 0; i < $scope.beneficiaryList.length; i++) {
							$scope.totalAmount = parseInt($scope.totalAmount) - parseInt($scope.beneficiaryList[i].paymentAmt);
							$scope.payBeneAmount = $scope.totalAmount;
							console.log("account no: " + $scope.beneficiaryList[i].accountNo);
						}
					}
					$scope.fetchData = true;
					if ($scope.beneficiaryList.length > 0) {
						$scope.isFetchData = true;
					}
					console.log("$scope.dataModified: " + $scope.dataModified);
				} $scope.handleResponseError(response);
			});
		}

		$scope.deletedBeneficiary = function (deletedId) {
			var modalOptions = {
				isCloseEnabled: true,
				actionButtonText: 'Yes',
				closeButtonText: 'No',
				headerText: 'Alert',
				bodyText: 'Do you want to delete the record ?'
			};
			modalService.showModal({}, modalOptions).then(function (result) {
				var spliceIndex = getIndexByValue($scope.beneficiaryList, 'id', deletedId);
				console.log(spliceIndex);
				if(getListByValue($scope.beneficiaryList, 'id', deletedId)[0]['isNew']) {
					
					$scope.beneficiaryList.splice(spliceIndex, 1);
					
				} else {
					$scope.beneficiaryList.splice(spliceIndex, 1);
					$scope.deletedRecord.push(deletedId);
				}
				console.log("beneficiaryList :: "+$scope.beneficiaryList);
				$scope.calculatePaymentAmount(deletedId, false);
				
			});
		}

		$scope.unMapStatement = function (id, statementId, type) {
			var data = {};
			var url;
			var action;
			data["unMapDetails"] = {};
			var message = "";
			if (type == 'infusion' || type == 'infusionMore') {
				data["unMapDetails"]["statementId"] = statementId;
				data["unMapDetails"]["infusionId"] = id;
				data["unMapDetails"]["nbfcId"] = $scope.nbfcId;
				url = appEnvironment.FUND_INFUSION_URL;
				action = "unMapInfusionData";
				message = "Do you want to unmap the Infusion ?";
			} else {
				data["unMapDetails"]["statementId"] = statementId;
				data["unMapDetails"]["paymentId"] = id;
				data["unMapDetails"]["nbfcId"] = $scope.nbfcId;
				url = appEnvironment.PAYMENT_URL;
				action = "unMapPaymentData";
				message = "Do you want to unmap the Beneficiary ?";
			}
			var modalOptions = {
				isCloseEnabled: true,
				actionButtonText: 'Yes',
				closeButtonText: 'No',
				headerText: 'Alert',
				bodyText: message
			};
			modalService.showModal({}, modalOptions).then(function (result) {
				lmsService.callApi(data, url, action, function (response) {
					if (response.status == "success") {
						console.log("response is:::: " + JSON.stringify(response));
						if (type == 'payments') {
							$scope.getPaymentBeneData(id);
						} else if (type == 'infusionMore'){
							$scope.moreDetails('Infusion');
						}
						$scope.nbfcDashboardDetails();
					
						var modalOptions = {
							actionButtonText: 'Ok',
							headerText: 'Information',
							bodyText: response.message
						};
						modalService.showModal({}, modalOptions).then(function (result) { });
					}
				});
			});
		}


		$scope.unMapMfStatement = function(id, statementId, amount, date) {
			console.log("id: " + id + " statementId: " + statementId + " amount: " + amount + " date : " + date);
			var data = {};
			var url;
			var action;
			data["unMapDetails"] = {};
			data["unMapDetails"]["statementId"] = statementId;
			data["unMapDetails"]["id"] = id;
			data["unMapDetails"]["investmentAmount"] = amount;
			data["unMapDetails"]["investmentDate"] = date;
			data["unMapDetails"]["nbfcId"] = $scope.nbfcId;
			url = appEnvironment.MUTUAL_FUND_URL;
			if ($scope.mutualType == 'investment') {
				action = "unMapInvestmentsData";
			} else {
				action = "unMapRedemptionsData";
			}
			
			var modalOptions = {
				isCloseEnabled: true,
				actionButtonText: 'Yes',
				closeButtonText: 'No',
				headerText: 'Alert',
				bodyText: 'Do you want to unmap the '+ ($scope.mutualType.charAt(0).toUpperCase() + $scope.mutualType.slice(1)) +' ?'
			};
			modalService.showModal({}, modalOptions).then(function (result) {
				lmsService.callApi(data, url, action, function (response) {
					if (response.status == "success") {
						console.log("response is:::: " + JSON.stringify(response));
						$scope.getMutualData(date, $scope.mutualType);
						$scope.nbfcDashboardDetails();
					
						var modalOptions = {
							actionButtonText: 'Ok',
							headerText: 'Information',
							bodyText: response.message
						};
						modalService.showModal({}, modalOptions).then(function (result) { });
					}
				});
			});
		}

		// $scope.getMutualData = function (investDate) {
		// 	console.log("investDate: " + investDate);
		// 	$("#mutualStatementUploadReconData").modal("show");
		// 	var data = {};
		// 	data["nbfcId"] = $scope.nbfcId;
		// 	data["investmentDate"] = investDate;
		// 	var url = appEnvironment.MUTUAL_FUND_URL;
		// 	lmsService.callApi(data, url, "getInvestmentDetails", function (response) {
		// 		if (response.status == "success") {
		// 			console.log("response is:::: " + JSON.stringify(response));
		// 			$scope.mutualListRTb = response.data.beneficiaryDetailsList;
		// 		} $scope.handleResponseError(response);
		// 	});
		// }
		$scope.addBeneficiaryDetails = function (paymentId) {
			console.log("addBeneficiaryDetails: " + JSON.stringify($scope.beneficiaryList));
			$scope.validated = $scope.validateBeneficiaryDetails();
			console.log("$scope.validated: " + JSON.stringify($scope.validated));
			if ($scope.validated.status == "success") {
				data["addBeneficiaryDetails"] = {};
				data["paymentId"] = paymentId;
				data["addBeneficiaryDetails"]["newRecords"] = [];
				data["addBeneficiaryDetails"]["updatedRecords"] = [];
				data["addBeneficiaryDetails"]["deletedRecords"] = [];
				for (var i = 0; i < $scope.beneficiaryList.length; i++) {
					if ($scope.beneficiaryList[i].isNew) {
						data["addBeneficiaryDetails"]["newRecords"] = $scope.beneficiaryList;
					}
				}

				// for (var i = 0; i < $scope.updateBeneList.length; i++) {
				// 	if ($scope.updateBeneList[i].isNew) {
				// 		data["addBeneficiaryDetails"]["newRecords"] = $scope.updateBeneList;
				// 	}
				// }

				if ($scope.deletedRecord.length > 0) {
					data["addBeneficiaryDetails"]["deletedRecords"] = $scope.deletedRecord;
				}
				var url = appEnvironment.PAYMENT_URL;
				lmsService.callApi(data, url, "addBeneficiaryDetails", function (response) {
					$scope.submitEnabled = false;
					if (response.status == "success") {
						$("#addBeneficiary").modal("hide");
						console.log("response is:::: " + JSON.stringify(response));
						var modalOptions = {
							actionButtonText: 'Ok',
							headerText: 'Information',
							bodyText: response.message
						};
						modalService.showModal({}, modalOptions).then(function (result) { });
						$scope.nbfcDashboardDetails();
					} $scope.handleResponseError(response);
				});
			}
		}

		$scope.IsVisible = false;
		$scope.showFullDatePicker = function () {
		
			$(".startContractDate.date").datepicker({
				autoclose: true,
				format: 'dd-mm-yyyy',
				endDate: "+2w",
				startDate: new Date(),
				beforeShowDay: function (date) {
					var allDates = ((date.getDate() > 9) ? date.getDate() : "0" + date.getDate()) + '-' + (((date.getMonth() + 1) > 9) ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)) + '-' + date.getFullYear();
					console.log("$scope.holidayMasterList:::: " + JSON.stringify($scope.holidayMasterList));
					if ($scope.holidayMasterList.indexOf(allDates) != -1)
				
						return false;
					else
						return true;

					
				}
				

			});
			
		}

		$scope.showDatePicker = function () {
			$(".startEditInfusionDate.date").datepicker({
				autoclose: true,
				format: 'dd-mm-yyyy',
				endDate: "+2w",
				startDate: new Date()
			});
		}

		$scope.showHolidayDatePicker = function () {
		
			$(".showHolidayDatePicker.date").datepicker({
				
			
				autoclose: true,
				format: 'dd-mm-yyyy',
				beforeShowDay: function (date) {
					var allDates = ((date.getDate() > 9) ? date.getDate() : "0" + date.getDate()) + '-' + (((date.getMonth() + 1) > 9) ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)) + '-' + date.getFullYear();
					console.log("$scope.holidayMasterList:::: " + JSON.stringify($scope.holidayMasterList));
					if ($scope.holidayMasterList.indexOf(allDates) != -1)
				
						return false;
					else
						return true;

					
				}
			});
		}
		
		$scope.showModalPopup = function(message) {
			var modalOptions = {
				isCloseEnabled: false,
				closeButtonText: 'Close',
				actionButtonText: 'Ok',
				headerText: 'Information',
				bodyText: message
			};
			modalService.showModal({}, modalOptions).then(function(result) {});
		}

		$scope.openPDF = function (paymentId) {
			var data = {};
			data["paymentId"] = paymentId;
			data["type"] = "payments";
            var url = appEnvironment.PAYMENT_URL;
            lmsService.callApi(data, url, "previewPdf", function(response) {
				if (response.status == "success") {
					if (!isEmpty(response.data)) {
						$scope.documentDetails = response.data.documentDetails;
						$scope.fileName = $scope.documentDetails.fileName;
						$scope.arrayBuffer = $scope.documentDetails.fileData;
						$scope.fileExt = $scope.documentDetails.fileExt;
					} else {
						$scope.showModalPopup("No file available for this contract.");
						return;
					}
					if($scope.fileExt.toLowerCase() == 'pdf'){
						var uint8Array  = new Uint8Array($scope.arrayBuffer);
						var arrayBuffer = uint8Array.buffer;
						var blob = new Blob([arrayBuffer], {type: 'application/pdf'});
						var fileURL = URL.createObjectURL(blob);
						window.open(fileURL, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=10,left=10,width=500,height=500");
					} else {
						$scope.showModalPopup("Wrong file uploaded.");
					}
				} $scope.handleResponseError(response);
			});
		}

		$scope.previewUploadedFile = function() {
			var pdffile = document.getElementById($scope.idValue).files[0];
			if (checkEmptyField(pdffile)) {
				$scope.showModalPopup("Please Upload file");
				return;
			}
			var pdffile_url = URL.createObjectURL(pdffile);
			window.open(pdffile_url, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=10,left=10,width=500,height=500");
		}

		$scope.previewMfData = function(date) {
			$scope.investDate = date;
			$scope.openMutualPDF();	
		}

		$scope.openMutualPDF = function () {
			var data = {};
			data["nbfcId"] = $scope.nbfcId;
			data["investmentDate"] = $scope.investmentDate;
			data["type"] = "mutualFunds";
            var url = appEnvironment.PAYMENT_URL;
            lmsService.callApi(data, url, "previewPdf", function(response) {
				if (response.status == "success") {
					if (!isEmpty(response.data)) {
						$scope.documentDetails = response.data.documentDetails;
						$scope.fileName = $scope.documentDetails.fileName;
						$scope.arrayBuffer = $scope.documentDetails.fileData;
						$scope.fileExt = $scope.documentDetails.fileExt;
					} else {
						$scope.showModalPopup("No file available for this contract.");
						return;
					}
					if($scope.fileExt.toLowerCase() == 'pdf'){
						var uint8Array  = new Uint8Array($scope.arrayBuffer);
						var arrayBuffer = uint8Array.buffer;
						var blob = new Blob([arrayBuffer], {type: 'application/pdf'});
						var fileURL = URL.createObjectURL(blob);
						window.open(fileURL, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=10,left=10,width=500,height=500");
					} else {
						$scope.showModalPopup("Wrong file uploaded.");
					}
				} $scope.handleResponseError(response);
			});
		}
		$scope.validateGenerateLetter = function (){
			if (!checkEmptyField($scope.referenceIdPayment)) {
				$scope.allowGenerateReports = true;
			} else {
				$scope.allowGenerateReports = false;
			}
		}
		$scope.validateGenerateMLetter = function (){
			if (!checkEmptyField($scope.referenceIdinvestment)) {
				$scope.allowgenerateMReports = true;
			} else {
				$scope.allowgenerateMReports = false;
			}
		}

		
		$scope.addBeneficiary = function (paymentId, amount, dateVal, actionVal) {
			$scope.actionVal = actionVal;
			$scope.viewPaymentBeneficiaryDetails(paymentId);
			$scope.paymentId = paymentId;
			$scope.totalAmount = removeCommaFromINRValue(amount);
			$scope.totalPaymentAmount = amount;
			$scope.beneDate = dateVal;
			$scope.totalBeneAmount = $scope.totalAmount;
			$('#addBeneficiary').modal('show');
			$("#generateLetter").hide();
			$("#referenceIdPayment").hide();
			$("#previewLetter").hide();
			$("#pullBack").hide();
			$("#updatePayment").show();
			
			$scope.allowSubmitReports= false;
			document.getElementById("errorMsg").innerHTML = "";
			$scope.beneficiaryList = [];
			if ($scope.beneficiaryList.length == 0) {
				$scope.beneficiaryList.push({
					"isNew": true,
					"id":"N"+$scope.beneficiaryList.length,
					"paymentAmt" : 0.00
				});
			}
			$scope.isNewAdded = true;
     		 $scope.beneIndex = -1;
			 $scope.generateLetter = false;
		}
		$scope.generatePdf = function (paymentId, amount, dateVal, status) {
			console.log("status: " + status);
			$scope.referenceIdPayment ="";
			if (status == "7004") {
				$scope.allowSubmitReports = true;
			} else {
				$scope.allowSubmitReports= false;
			}
			
			$scope.allowGenerateReports = false;

			$scope.viewPaymentBeneficiaryDetails(paymentId);
			$scope.paymentId = paymentId;
			$scope.totalAmount = amount;
			$scope.totalPaymentAmount = amount;
			$scope.beneDate = dateVal;
			$scope.totalBeneAmount = $scope.totalAmount;
			$('#addBeneficiary').modal('show');
			$("#generateLetter").show();
			$("#referenceIdPayment").show();
			
			$("#previewLetter").show();
			$("#pullBack").show();
			$("#updatePayment").hide();
			document.getElementById("errorMsg").innerHTML = "";
			$scope.beneficiaryList = [];
			if ($scope.beneficiaryList.length == 0) {
				$scope.beneficiaryList.push({
					"isNew": true,
					"id":"N"+$scope.beneficiaryList.length,
					"paymentAmt" : 0.00
				});
			}
			$scope.isNewAdded = true;
     		 $scope.beneIndex = -1;
		}
		$scope.sendToCheckerSubmit = function (paymentId, amount, dateVal, status) {
			$('#pullBackSend').show();
			$('#submitSendToChecker').show();
			console.log("status: " + status);
			if (status == "7004") {
				$scope.allowSubmitReports = true;
			} else {
				$scope.allowSubmitReports= false;
			}
			$scope.viewPaymentBeneficiaryDetails(paymentId);
			$scope.paymentId = paymentId;
			$scope.totalAmount = amount;
			$scope.totalPaymentAmount = amount;
			$scope.beneDate = dateVal;
			$scope.totalBeneAmount = $scope.totalAmount;
			$('#sendToChecker').modal('show');
			document.getElementById("errorMsg").innerHTML = "";
			$scope.beneficiaryList = [];
			if ($scope.beneficiaryList.length == 0) {
				$scope.beneficiaryList.push({
					"isNew": true,
					"id":"N"+$scope.beneficiaryList.length,
					"paymentAmt" : 0.00
				});
			}

			$scope.sendChecker = true;
			$scope.isNewAdded = true;
     		 $scope.beneIndex = -1;
		}
		$scope.waitingForApproval = function (paymentId, amount, dateVal, status) {
			console.log("status: " + status);
			if (status == "7004") {
				$scope.allowSubmitReports = true;
			} else {
				$scope.allowSubmitReports= false;
			}
			$scope.viewPaymentBeneficiaryDetails(paymentId);
			$scope.paymentId = paymentId;
			$scope.totalAmount = amount;
			$scope.totalPaymentAmount = amount;
			$scope.beneDate = dateVal;
			$scope.totalBeneAmount = $scope.totalAmount;
			$('#sendToChecker').modal('show');
			$('#submitSendToChecker').hide();
			$('#pullBackSend').show();
			document.getElementById("errorMsg").innerHTML = "";
			$scope.beneficiaryList = [];
			if ($scope.beneficiaryList.length == 0) {
				$scope.beneficiaryList.push({
					"isNew": true,
					"id":"N"+$scope.beneficiaryList.length,
					"paymentAmt" : 0.00
				});
			}
			$scope.isNewAdded = true;
     		 $scope.beneIndex = -1;
		}
		$scope.uploadScanFile = function (paymentId) {
			$scope.allowScanUpload = true;
			$scope.paymentId = paymentId;
			$("#uploadScanFile").modal("show");
		}
		$scope.uploadScanFileMutual = function (investDate) {
			$scope.allowScanUpload = true;
			$scope.investDate = investDate;
			$scope.idValue = 'uploadMfScanData';
			$("#uploadScanFileMutual").modal("show");
		}

		$scope.scanPreview = function() {
			$scope.idValue = "uploadScanData";
			$scope.previewUploadedFile();
		}
		
		// $scope.countDetailsBenef = function (paymentId) {
		// 	$scope.viewPaymentBeneficiaryDetails(paymentId);
		// 	$scope.paymentId = paymentId;
		
		// 	$('#beneficiaryDetails').modal('show');
		// 	$scope.beneficiaryDetailsList = response.data.roleUserList;
		// }
		$scope.countDetailsBenef = function (paymentId) {
			$('#beneficiaryDetails').modal('show');
			data["paymentId"] = paymentId;
			var url = appEnvironment.PAYMENT_URL;
			lmsService.callApi(data, url, "viewPaymentBeneficiaryDetails", function (response) {
				$scope.allowInfusionAdd = true;
				if (response.status == "success") {
					console.log("response is:::: " + JSON.stringify(response));
					$scope.beneficiaryDetailsList = response.data.paymentBeneficiaryList;
				
				} $scope.handleResponseError(response);
			});
		}

		$scope.countDetailsMutual = function (investDate) {
			var data = {};
			$('#mutualDetails').modal('show');
			data["nbfcId"] = $scope.nbfcId;
			data["investmentDate"] = investDate;
		
			var url = appEnvironment.MUTUAL_FUND_URL;
			lmsService.callApi(data, url, "viewMutualFundsDetails", function (response) {
				$scope.allowInfusionAdd = true;
				if (response.status == "success") {
					console.log("response is:::: " + JSON.stringify(response));
					$scope.mutualDetailsList = response.data.mfResultList;
					console.log("$scope.mutualDetailsList"+JSON.stringify($scope.mutualDetailsList));
					
				} $scope.handleResponseError(response);
			});
		}


		$scope.addEditBeneficiary = function () {
			if ($scope.beneficiaryList.length > 0) {
				$scope.validateBene = $scope.validateBeneficiaryDetails();
				if ($scope.validateBene.status == "success") {
					if ($scope.totalAmount > 0) {
						$scope.beneficiaryList.push({
							"isNew": true,
							"paymentAmt": 0.00,
							"id": "N"+($scope.beneficiaryList.length+1)
						});	
						document.getElementById("errorMsg").innerHTML = "";
					} else {
						var modalOptions = {
							actionButtonText: 'Ok',
							headerText: 'Information',
							bodyText: 'Cannot add Beneficiary, since amount is zero.'
						};
						modalService.showModal({}, modalOptions).then(function (result) {});
					}
				} else {
					document.getElementById("errorMsg").innerHTML = $scope.validateBene.message;
					return;
				}
			} else {
				$scope.beneficiaryList.push({
					"isNew": true,
					"paymentAmt": 0.00,
					"id": "N"+($scope.beneficiaryList.length)
				});
				document.getElementById("errEditAddress").innerHTML = "";
			}
			$scope.isNewAdded = true;
			$scope.isUpdated = false;
		}

		
		
		function getHolidayList() {
		//	$scope.stateAction = 'holidaylist';
		
			data = {};
			var url = appEnvironment.HOLIDAY_MASTER_URL;
			$scope.holidayList = [];
			smsService.callApi(data, url, "viewHolidayMaster", function (response) {
				if (response.status == "success") {
					var holidayList = response.data.holidayMasterList;
					for (var i = 0; i < holidayList.length; i++) {
						var date = $filter('date')(holidayList[i].holidayDate, "yyyy-MM-dd").split("-");
						var mm = Number(date[1]);
						var dd = Number(date[2]);
						var yy = Number(date[0]);
						var date = mm + "-" + dd + "-" + yy;

						$scope.holidayList[$scope.holidayList.length] = date;
					}
					$('.appMDatePicker').datepicker({
						autoclose: true,
						format: 'dd-mm-yyyy',
						beforeShowDay: disableSpecificDate
					});
				} $scope.handleResponseError(response);
			});
		}
		
		function disableSpecificDate(date) {
			var m = date.getMonth();
			var d = date.getDate();
			var y = date.getFullYear();

			// First convert the date in to the mm-dd-yyyy format 
			// Take note that we will increment the month count by 1 
			var currentdate = (m + 1) + '-' + d + '-' + y;
			for (var i = 0; i < $scope.holidayList.length; i++) {
				if (currentdate == $scope.holidayList[i]) {
					return false;
				}
			}
			if (date.getDay() == 0) {
				return false;
			} else if (date.getDay() == 6) {
				return false;
			}
			return true;
		}

		

		$scope.handleResponseError = function (response) {
			if (response.status == "failed") {

				var modalOptions = {
					actionButtonText: 'Ok',
					headerText: 'Error',
					bodyText: response.message
				};
				modalService.showModal({}, modalOptions).then(function (result) { });
				if (response.statusCode == -6006 || response.statusCode == -6007 || response.statusCode == -6008 || response.statusCode == -6010 || response.statusCode == -6011) { $state.go("login"); }
			} else if (response.status == "") {
				var modalOptions = {
					actionButtonText: 'Ok',
					headerText: 'Error',
					bodyText: "Unable to connect to server"
				};
				modalService.showModal({}, modalOptions).then(function (result) { });
			}
		}

	

	
		initialize();
	}
]).directive('compile', ['$compile', function ($compile) {
	return function (scope, element, attrs) {
		scope.$watch(
			function (scope) {
				// watch the 'compile' expression for changes
				return scope.$eval(attrs.compile);
			},
			function (value) {
				// when the 'compile' expression changes
				// assign it into the current DOM
				element.html(value);

				// compile the new DOM and link it to the current
				// scope.
				// NOTE: we only compile .childNodes so that
				// we don't get into infinite loop compiling ourselves
				$compile(element.contents())(scope);
			}
		);
	};
}]);
