myApp.controller('loginController', ['busyNotificationService', 'modalService', '$scope', '$location', '$window', '$rootScope', '$state', '$controller', '$uibModal', 'appConstants', 'authenticationService',

	function (busyNotificationService, modalService, $scope, $location, $window, $rootScope, $state, $controller, $uibModal, appConstants, authenticationService) {
		$scope.emailChar = appConstants.UPPER_CASE_CHARS.concat(appConstants.LOWER_CASE_CHARS).concat(appConstants.NUMBERS).concat(".").concat("-").concat("@");
		initialize();

		function initialize() {
			console.log("loginController.initialize()");
			$scope.user = {};
			$rootScope.bodylayout = 'login';
			$scope.userName = "";
			$scope.userId = "";
			$scope.password = "";
			$scope.loginError = "";
			$scope.loggedUser = "";
			$scope.error = "";
			$scope.userFirstValidChars = appConstants.UPPER_CASE_CHARS.concat(appConstants.NUMBERS);
			$scope.userOtherValidChars = appConstants.NUMBERS;
			$scope.userName = 'userName';
			authenticationService.ClearCredentials();
		}

		$scope.login = function(isNewUser){
			console.log("inside $scope.login");
			$rootScope.globals.userRole = "ADMIN";
			var data = {};
			data["isNewUser"] = isNewUser;
			authenticationService.login($scope.userId.toLowerCase(), $scope.password, data, function (response) {
				if (response.status == "success") {
					if(response.data.isNewUser){
						var modalOptions = {
							isCloseEnabled: true,
							closeButtonText: 'Cancel',
							actionButtonText: 'Continue',
							headerText: 'Information',
							bodyText: response.message
						};
						modalService.showModal({}, modalOptions).then(function (result) {
							$scope.login(true);
						});
						return;
					}
					$scope.loginError = "";
					$rootScope.globals = response.data;
					console.log("rootScope.globals: " + JSON.stringify($rootScope.globals));
					$rootScope.globals.accessToken=response.accessToken;
					if($rootScope.globals.userRole == "ADMIN") {
						$state.go("userAdmin");
					} else if($rootScope.globals.userRole == "MANAGEMENT") {
						$state.go("userManagement");
					} else if($rootScope.globals.userRole == "USER") {
						$state.go("user");
					}
				}
				$scope.responseError(response);
				
			});
		}

		$scope.responseError = function (response) {
			if (response.status === "failed") {
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
				};
				modalService.showModal({}, modalOptions).then(function (result) { });
			} else if (response.status != "success") {
				$state.go("login");
			}
		}
	}
]);
