myApp.controller('adminController', ['busyNotificationService', '$timeout', '$scope', '$uibModal', '$filter', '$location', '$window', '$rootScope', '$state', 'appConstants', 'localconfig', 'serverconfig', 'config', 'modalService', '$http', '$stateParams', 'lmsService',
    function (busyNotificationService, $timeout, $scope, $uibModal, $filter, $location, $window, $rootScope, $state, appConstants, localconfig, serverconfig, config, modalService, $http, $stateParams, lmsService) {
		var data = {};
		function initialize(){
			$rootScope.bodylayout = '';
			console.log("Admin Controller loaded");
			if($rootScope.globals == undefined){
				$state.go("login");
			}
			$scope.appConstants = appConstants;
            if (APP_ENVIRONMENT === config.ENVIRONMENT_LOCAL) {
                appEnvironment = localconfig;
            } else if (APP_ENVIRONMENT === config.ENVIRONMENT_SERVER) {
                appEnvironment = serverconfig;
			}
			$scope.fetchNbfcDetails();
		}
		
		$scope.fetchNbfcDetails = function() {
            var url = appEnvironment.NBFC_LIST;
            lmsService.callApi(data, url, "nbfcList", function (response) {
                if (response.status == "success") {
                    $scope.nbfcList = response.data.nbfcList;
                }
                $scope.handleResponseError(response);
                var windowHeight = $(window).height() - 200;
                $scope.maxRows = Math.ceil(windowHeight / 50);
               
                $scope.maxRows = 10;
            });
		}
		$scope.addCredit =function(){
			$('#addCredit').modal('show');
		}
		$scope.addMutualFunds =function(){
			$('#addMutualFunds').modal('show');
		}
		$scope.addPayments =function(){
			$('#addPayments').modal('show');
		}
		
		$scope.moreCreditRequest =function(){
			$('#moreCreditRequest').modal('show');
		}
		$scope.moreMutualFunds=function(){
			$('#moreMutualFunds').modal('show');
		}
		$scope.morePayments=function(){
			$('#morePayments').modal('show');
		}
		$scope.nbfcDetails = function() {
			console.log("aaa");
            var url = appEnvironment.ACCOUNT_LIST;
            //lmsService.callApi(data, url, "accoundDetailsList", function (response) {
				var response = {
					"data":{
						"creditList" : [
							{
								"date": "20-01-2019",
								"creditAmount": "66666",
								"recoverPending": "66666"
							},
							{
								"date": "7-01-2019",
								"creditAmount": "66666",
								"recoverPending": "66666"
							},
							{
								"date": "7-01-2019",
								"creditAmount": "66666",
								"recoverPending": "66666"
							},
							{
								"date": "7-01-2019",
								"creditAmount": "66666",
								"recoverPending": "66666"
							},
							{
								"date": "7-01-2019",
								"creditAmount": "66666",
								"recoverPending": "66666"
							},{
								"date": "7-01-2019",
								"creditAmount": "66666",
								"recoverPending": "66666"
							},{
								"date": "7-01-2019",
								"creditAmount": "66666",
								"recoverPending": "66666"
							}
						],
						"mutualFundList":[
							{
								"date": "20-01-2019",
								"count": "2",
								"mutualAmount": "77777",
								"investment": "77777",
								"redeem": "55",
								"margin": "55"
							},
							{
								"date": "25-03-2019",
								"count": "2",
								"mutualAmount": "77777",
								"investment": "77777",
								"redeem": "55",
								"margin": "55"
							},{
								"date": "20-01-2019",
								"count": "2",
								"mutualAmount": "77777",
								"investment": "77777",
								"redeem": "55",
								"margin": "55"
							},
							{
								"date": "25-03-2019",
								"count": "2",
								"mutualAmount": "77777",
								"investment": "77777",
								"redeem": "55",
								"margin": "55"
							},{
								"date": "20-01-2019",
								"count": "2",
								"mutualAmount": "77777",
								"investment": "77777",
								"redeem": "55",
								"margin": "55"
							},
							{
								"date": "25-03-2019",
								"count": "2",
								"mutualAmount": "77777",
								"investment": "77777",
								"redeem": "55",
								"margin": "55"
							},
							{
								"date": "25-03-2019",
								"count": "2",
								"mutualAmount": "77777",
								"investment": "77777",
								"redeem": "55",
								"margin": "55"
							}
						],
						"paymentList":[
							{
								"date": "25-01-2019",
								"count": "2",
								"pendingAmount": "77777",
								"flag":"1",
								"status": ""
							},{
								"date": "25-01-2019",
								"count": "2",
								"pendingAmount": "77777",
								"flag":"1",
								"status": ""
							},{
								"date": "25-01-2019",
								"count": "2",
								"pendingAmount": "77777",
								"flag":"2",
								"status": ""
							},{
								"date": "25-01-2019",
								"count": "5",
								"pendingAmount": "77777",
								"flag":"3",
								"status": ""
							},{
								"date": "25-01-2019",
								"count": "2",
								"pendingAmount": "77777",
								"flag":"4",
								"status": ""
							},{
								"date": "25-01-2019",
								"count": "2",
								"pendingAmount": "77777",
								"flag":"2",
								"status": ""
							},{
								"date": "25-01-2019",
								"count": "5",
								"pendingAmount": "77777",
								"flag":"4",
								"status": ""
							}
						]
					},
					"status": "success",
					"statusCode": 200
				}
				console.log("data fetched: " + response);
				if (response.status == "success") {
					$scope.creditList = response.data.creditList;
					$scope.mutualFundList = response.data.mutualFundList;
					$scope.paymentList = response.data.paymentList;
					console.log(" $scope.creditList" +JSON.stringify( $scope.creditList));
				}
				$scope.handleResponseError(response);
				var windowHeight = $(window).height() - 200;
				$scope.maxRows = Math.ceil(windowHeight / 50);
				
				$scope.maxRows = 10;
            //});
		}
		$scope.showFullDatePicker = function() {
			$(".startContractDate.date").datepicker({
				autoclose: true,
				format: 'dd-mm-yyyy',
			});
			
		}
		$scope.saveCredit=function(){
			
			$scope.creditList.push(angular.copy($scope.creditList));
			$("#editCollectionTranchPayInDate").datepicker('setDate', '');
			$scope.creditList = {};
			$scope.creditList = $scope.creditList;
			
		}
		$scope.handleResponseError= function(response){
			if (response.status == "failed") {
				
			   var modalOptions = {
				   actionButtonText: 'Ok',
				   headerText: 'Error',
				   bodyText: response.message
			   };
			   modalService.showModal({}, modalOptions).then(function(result) {});
			   if(response.statusCode == -6006 || response.statusCode == -6007 || response.statusCode == -6008  || response.statusCode == -6010 || response.statusCode == -6011) { $state.go("login");}
		   }  else if (response.status == "")  {
			   var modalOptions = {
				   actionButtonText: 'Ok',
				   headerText: 'Error',
				   bodyText: "Unable to connect to server"
			   };
			   modalService.showModal({}, modalOptions).then(function(result) {});
		   }
	   }
	   
		initialize();
	}
]);
