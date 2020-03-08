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

		$scope.login = function() {
			console.log("inside $scope.login");
			$scope.userRole = "ADMIN";
			var data = {};
			data["userId"] = $scope.userId.toLowerCase();
			data["password"] = $scope.password;
			authenticationService.login(data, function (response) {
				if (response.status == "success") {
					$scope.loginError = "";
					$rootScope.globals = response.data;
					console.log("rootScope.globals: " + JSON.stringify($rootScope.globals));
					$rootScope.globals.accessToken=response.accessToken;
					console.log("userRole: " + $scope.userRole);
					if($scope.userRole == "ADMIN") {
						console.log("inside if");
						$state.go("dashboard");
					} else if($scope.userRole == "STAFF") {
						$state.go("staff");
					} else if($scope.userRole == "STUDENT") {
						$state.go("student");
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
