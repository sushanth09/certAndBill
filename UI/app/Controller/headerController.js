myApp.controller('headerController', ['busyNotificationService', 'modalService', '$scope', '$location', '$window', '$rootScope', '$state', '$controller', '$uibModal', 'appConstants', 'localconfig', 'serverconfig', 'config', 'authenticationService', 'lmsService', 'headerServices',

	function (busyNotificationService, modalService, $scope, $location, $window, $rootScope, $state, $controller, $uibModal, appConstants, localconfig, serverconfig, config, authenticationService, lmsService, headerServices) {
		$scope.numericChar = appConstants.NUMBERS;

		function initialize() {
			$rootScope.bodylayout = '';
			$scope.loggedInUserDetails = $rootScope.globals;
			$scope.userName = $scope.loggedInUserDetails.userName;
			$scope.mobileNumber = $scope.loggedInUserDetails.mobileNumber;
			$scope.userId = $scope.loggedInUserDetails.userId;
			$scope.userRoleList = $scope.loggedInUserDetails.userRoleList;
			//$scope.headerTab();
			$scope.appConstants = appConstants;
			if (APP_ENVIRONMENT === config.ENVIRONMENT_LOCAL) {
				appEnvironment = localconfig;
			} else if (APP_ENVIRONMENT === config.ENVIRONMENT_SERVER) {
				appEnvironment = serverconfig;
			}
		}

		$scope.isDataSaved = function () {
			$scope.allowConfigUpdate = true;
			$rootScope.globals.isDataSaved = true;
		}

		if ($rootScope.globals.updateButtonStatus) {
			var modalOptions = {
				isCloseEnabled: true,
				closeButtonText: 'No',
				actionButtonText: 'Yes',
				headerText: 'Alert',
				bodyText: "You haven't saved the data you modified. Are you sure you want to go to another page without saving it?"
			};
		}

		$scope.allowUpdateBasicInfo = false;
		$scope.validateBasicInfo = function (elementID) {
			if (!checkEmptyField($scope.updateProfileDetails.mobileNumber) && !checkEmptyField($scope.updateProfileDetails.mobileNumber)) {
				var mobileregex = /^([7-8-9]{1})([0-9]{9})$/;
				if (!mobileregex.test($scope.updateProfileDetails.mobileNumber)) {
					console.log("false");
					$scope.allowUpdateBasicInfo = false;

				} else {
					console.log("true");
					$scope.allowUpdateBasicInfo = true;
				}

			} else {
				$scope.allowUpdateBasicInfo = false;
			}
		}

		$scope.showUpdatePersonalProfile = function () {
			$scope.allowCreateUser = true;
			$scope.allowUpdateBasicInfo = false;
			$scope.updateProfileDetails = $scope.loggedInUserDetails;
			$('#updatePersonalProfile').modal('show');
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

		$scope.showUpdatePersonalPassword = function () {
			data = {};
			if ($rootScope.globals.updateButtonStatus) {
				var modalOptions = {
					isCloseEnabled: true,
					closeButtonText: 'No',
					actionButtonText: 'Yes',
					headerText: 'Alert',
					bodyText: "You haven't saved the data you modified. Are you sure you want to go to another page without saving it?"
				};
				modalService.showModal({}, modalOptions).then(function (result) {
					$rootScope.globals.updateButtonStatus = false;
					if ($rootScope.globals.pageUpdateType == "fileUpload") {
						if ($stateParams) {
							headerServices.releaseUploadedFiles(data, function (response) {
								if (response.status == "success") {
									$('#updatePersonalPassword').modal('show');
								}
								$scope.handleResponseError(response);
							});
						}
					}
				});
			} else {
				$('#updatePersonalPassword').modal('show');
			}
		}

		$scope.updateProfileValidator = function () {
			if ($scope.updateProfileDetails.mobileNumber.length != 10 || $scope.updateProfileDetails.mobileNumber == $scope.mobileNumber) {
				$scope.mobileNumber = false;
			} else {
				$scope.mobileNumber = true;
			}
			if ($scope.mobileNumber == true) {
				$scope.allowPersonalProfileUpdate = true;
			} else {
				$scope.allowPersonalProfileUpdate = false;
			}
		}

		$scope.changeActiveRole = function (activateRole) {
			console.log("activateRole: " +activateRole);
			if (activateRole == "ADMIN") {
				$rootScope.globals.userRole = activateRole;
				$state.go('userAdmin');
			} else if (activateRole == "MANAGEMENT") {
				$rootScope.globals.userRole = activateRole;
				$state.go('userManagement');
			} else if (activateRole == "USER") {
				$scope.fetchNbfcDetails(activateRole);
			} 
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

		$scope.fetchNbfcDetails = function (activateRole) {
			var data = {};
			var url = appEnvironment.NBFC_URL;
			lmsService.callApi(data, url, "viewNbfcDetails", function (response) {
				if (response.status == "success") {
					$scope.nbfcList = response.data.nbfcDetailsList;
					console.log("response: " + response.data.nbfcDetailsList);
					if ($scope.nbfcList.length == 0) {
						$scope.showModalPopup("Please add atleast One NBFC details.");
					} else {
						if ($rootScope.globals.nbfcId == 0) {
							$rootScope.globals.nbfcId = $scope.nbfcList[0].id;
						}
						$rootScope.globals.userRole = activateRole;
						$state.go('user');
					}
				}
				$scope.handleResponseError(response);
			});
		}

		$scope.updatePersonalBasicInfo = function () {
			data = {};
			data = $scope.updateProfileDetails;
			headerServices.updateUserDetails(data, function (response) {
				if (response.status == "success") {
					$("#updatePersonalProfile").modal('hide');
					var modalOptions = {
						actionButtonText: 'Ok',
						headerText: 'Information',
						bodyText: 'You have successfully updated your profile'
					};
					$scope.loggedInUserDetails.mobileNumber = response.data.mobileNo;
					modalService.showModal({}, modalOptions).then(function (result) { });
				}
				$scope.handleResponseError(response);
			});
		}

		$scope.workInProgress = function () {
			var modalOptions = {
				isCloseEnabled: true,
				closeButtonText: '',
				actionButtonText: 'Ok',
				headerText: 'Warning',
				bodyText: "We are still working on this module."
			};
			modalService.showModal({}, modalOptions).then(function (result) {
			})
		}


		$scope.userLogout = function () {
			console.log("loginController.logout()");
			//$rootScope.globals.userRole = "ADMIN";
			data = {};
			var modalOptions = {
				isCloseEnabled: true,
				actionButtonText: 'Yes',
				closeButtonText: 'No',
				headerText: 'Alert',
				bodyText: "Are you sure you want to Logout?"
			};
			modalService.showModal({}, modalOptions).then(function (result) {
				headerServices.logout(data, function (response) {
					if (response.status === "success") {
						console.log("reponse:: " + JSON.stringify(response));
						$state.go("login");
					} else if (response.status === "failed") {
						var bodyMessage = '';
						if (response.message) {
							bodyMessage = response.message;
						} else {
							bodyMessage = 'There has been some internal issue.';
						}
						var modalOptions = {
							isCloseEnabled: false,
							headerText: 'Information',
							bodyText: bodyMessage
						}
						modalService.showModal({}, modalOptions).then(function (result) { });
						if (response.statusCode == -6006 || response.statusCode == -6007 || response.statusCode == -6008 || response.statusCode == -6010) { //$state.go("login");
						}
					} else {
						$scope.error = response.message;
					}
				});
			});
		};

		$scope.logout = function () {
			console.log("inside loginController.logout()");
			data = {};
			headerServices.logout(data, function (response) {
				if (response.status === "success") {
					console.log("reponse:: " + JSON.stringify(response));
					$state.go("login");
				} else if (response.status === "failed") {
					var bodyMessage = '';
					if (response.message) {
						bodyMessage = response.message;
					} else {
						bodyMessage = 'There has been some internal issue.';
					}
					var modalOptions = {
						isCloseEnabled: false,
						headerText: 'Information',
						bodyText: bodyMessage
					}
					modalService.showModal({}, modalOptions).then(function (result) { });
					if (response.statusCode == -6006 || response.statusCode == -6007 || response.statusCode == -6008 || response.statusCode == -6010) { //$state.go("login");
					}
				} else {
					$scope.error = response.message;
				}
			});
		};

		var c = 0;
		var max_count = appConstants.SESSION_TIMEOUT_POPUP;
		if ($rootScope.incTimer != undefined && $rootScope.incTimer != null)
			clearTimeout($rootScope.incTimer);
		if ($rootScope.setTimer != undefined && $rootScope.setTimer != null)
			clearTimeout($rootScope.setTimer);
		startTimer();

		function startTimer() {
			$rootScope.setTimer = setTimeout(function () {
				c = 0;
				max_count = appConstants.SESSION_TIMEOUT_POPUP;
				$('#timer').html(max_count);
				$("#logout_popup").modal({
					backdrop: 'static',
					keyboard: false
				});
				timedCount();
			}, $rootScope.sessionTime - max_count);
		}

		function timedCount() {
			c = c + 1;
			remaining_time = (max_count / 1000) - c;
			console.log("remaining_time:" + remaining_time);
			if (remaining_time == 0) {
				$('#logout_popup').modal('hide');
				$('body').removeClass('modal-open');
				$('.modal-backdrop').remove();
				c = 0;
				max_count = appConstants.SESSION_TIMEOUT_POPUP;
				clearTimeout($rootScope.incTimer);
				clearTimeout($rootScope.setTimer);
				$scope.logout();
			} else {
				$('#timer').html(remaining_time);
				$rootScope.incTimer = setTimeout(function () {
					timedCount()
				}, 1000);
			}
		}

		$("#keepLogIn").click(function () {
			$('#logout_popup').modal('hide');
			//CALL BACKEND
			var data = {
				'userId': $rootScope.globals.userId
			};
			authenticationService.resetSession(data, function (response) {
				$rootScope.sessionTime = (Number(response.sessionTimeout == undefined || response.sessionTimeout == null ? ($rootScope.sessionTime / 60000) : response.sessionTimeout) * 60000);
			});
			console.log("sessionTime:: " + $rootScope.sessionTime);
			c = 0;
			max_count = appConstants.SESSION_TIMEOUT_POPUP;
			clearTimeout($rootScope.incTimer);
			clearTimeout($rootScope.setTimer);
			startTimer();
		});

		$scope.$on('clearTimer', function (event, args) {
			console.log("Session Reset!!!" + $rootScope.sessionTime);
			c = 0;
			max_count = appConstants.SESSION_TIMEOUT_POPUP;
			clearTimeout($rootScope.incTimer);
			clearTimeout($rootScope.setTimer);
			startTimer();
		});

		initialize();

		$scope.$on('$locationChangeStart', function (event, next, current) {
			// Here you can take the control and call your own functions:
			console.log('Back Button is disabled');
			// Prevent the browser default action (Going back):
			event.preventDefault();
		});
	}
]);
