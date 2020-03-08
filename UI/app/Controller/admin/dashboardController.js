myApp.controller('dashboardController', ['busyNotificationService', '$timeout','$scope', '$uibModal', '$filter', '$location', '$window', '$rootScope', '$state', 'appConstants', 'modalService', '$stateParams','billingService','config','localconfig', 'serverconfig',
        function(busyNotificationService, $timeout, $scope, $uibModal, $filter, $location, $window, $rootScope, $state, appConstants, modalService, $stateParams, billingService, config, localconfig, serverconfig) {
			$scope.emailChar = appConstants.UPPER_CASE_CHARS.concat(appConstants.LOWER_CASE_CHARS).concat(appConstants.NUMBERS).concat(".").concat("-").concat("@");
			$scope.userHameChar = appConstants.UPPER_CASE_CHARS.concat(appConstants.LOWER_CASE_CHARS).concat(" ");
			$scope.numericChar = appConstants.NUMBERS;

			function initialize() {
				console.log("initialized controller");
				$scope.appConstants = appConstants;
				if (APP_ENVIRONMENT === config.ENVIRONMENT_LOCAL) {
					appEnvironment = localconfig;
				} else if (APP_ENVIRONMENT === config.ENVIRONMENT_SERVER) {
					appEnvironment = serverconfig;
				}
				$scope.updateUserPassword = "";
				$scope.userPassword = "";
				//$scope.fetchUserDetails();
			}

			$scope.saveCourseDetails = function() {
				console.log("$scope.fetchCollateralTranche");
				data = {};
				data['userDetails'] = $scope.userDetails;
				var url = appEnvironment.DASHBOARD_URL;
				billingService.callApi(data, url,"addCourseDetails", function(response) {
					if(response.status == "success") {
						$('#modalcourse').modal('hide');
						$scope.userDetails = {};
						alert("Data added Successfuly");
					} else if(response.status == "failed"){
						alert("Data added Successfuly");
					}
				});
			}

			$scope.saveStaffDetails = function() {
				console.log("$scope.fetchCollateralTranche");
				data = {};
				$scope.staffDetails.idType = 'ST';
				data['userRoleDetails'] = $scope.staffDetails;
				var url = appEnvironment.DASHBOARD_URL;
				billingService.callApi(data, url,"addStudentOrStaffDetails", function(response) {
					if(response.status == "success") {
						$scope.staffDetails = {};
						$('#modalStaff').modal('hide');
						alert("Data added Successfuly");
						$scope.$apply();
					} else if(response.status == "failed"){
						alert("Error while adding data.");
					}
				});
			}
			
			$scope.saveStudentDetails = function() {
				console.log("$scope.fetchCollateralTranche");
				data = {};
				$scope.studentDetails.idType = 'STU';
				data['userRoleDetails'] = $scope.studentDetails;
				var url = appEnvironment.DASHBOARD_URL;
				billingService.callApi(data, url,"addStudentOrStaffDetails", function(response) {
					if(response.status == "success") {
						$scope.studentDetails = {};
						$('#modalStudent').modal('hide');
						alert("Data added Successfuly");
						$scope.$apply();
					} else if(response.status == "failed"){
						alert("Error while adding data");
					}
				});
			}
			
			$scope.myFunction = function() {
				window.open('http://localhost/billingSystem/UI/#/', '_blank');
			}
			
			$scope.resetDetails = function(value) {
				if (value == 'course')
					$scope.userDetails = {};
				else if(value == 'staff')
					$scope.staffDetails = {};
				else if(value == 'student')
					$scope.studentDetails = {};
			}

			$scope.fetchUserDetails = function(){
				console.log("inside fetchUserDetails");
				data = {};
				$scope.usersList = [];
				var url = appEnvironment.ADMIN_URL;
				billingService.callApi(data, URL, "getUserList", function (response) {
					if(response.status == "success") {
						$scope.usersList = response.data.userList;
						console.log("users list::: " + JSON.stringify($scope.usersList));
					} else if(response.status == "failed"){
						bodyMessage = 'There has been some internal issue.';
						var modalOptions = {
							isCloseEnabled: false,
							headerText: 'Information',
							bodyText: bodyMessage
						};
						modalService.showModal({}, modalOptions).then(function (result) {});
					}
				});
			}

			$scope.fetchCollateralTranche = function() {
				console.log("$scope.fetchCollateralTranche");
				data = {};
				data['contractId'] = $scope.userDetails;
				data['contractVersion'] = $scope.contractVersion;
				var url = appEnvironment.CONTRACT_URL;
				billingService.callApi(data, url,"fetchContractCollaterals", function(response) {
					if(response.status == "success") {
						$scope.usersList = response.data.userList;					
					} $scope.handleResponseError(response);
				});
			}
            initialize();
		}
    ])
