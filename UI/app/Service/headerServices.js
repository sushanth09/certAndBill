myApp.factory('headerServices', ['busyNotificationService', 'modalService', '$http', '$cookieStore', '$rootScope', '$timeout', 'config', 'cryptoService', 'interceptorService', 'localconfig', 'serverconfig', 'appConstants',
	function (busyNotificationService, modalService, $http, $cookieStore, $rootScope, $timeout, config, cryptoService, interceptorService, localconfig, serverconfig, appConstants, homeService) {

		var service = {};
		var appEnvironment = '';

		function initialize() {
			//console.log("$rootScope.globals:: "+$rootScope.globals);
			if (APP_ENVIRONMENT === config.ENVIRONMENT_LOCAL) {
				appEnvironment = localconfig;
			} else if (APP_ENVIRONMENT === config.ENVIRONMENT_SERVER) {
				appEnvironment = serverconfig;
			}

		}
		service.updateUserDetails = function (data, callback) {
			var dataObj = {};
			dataObj = getRequestHeaders($rootScope.globals)
			dataObj["data"] = data;
			dataObj["action"] = "editUser";
			var config = interceptorService.getConfig(dataObj, appEnvironment.USER_MANAGEMENT);
			interceptorService.apiCall(config, function (response) { callback(response); });
		};

		service.logout = function (data, callback) {
			var dataObj = {};
			dataObj = getRequestHeaders($rootScope.globals)
			dataObj["data"] = data;

			dataObj["action"] = "logout";
			var config = interceptorService.getConfig(dataObj, appEnvironment.USER_MANAGEMENT);
			interceptorService.apiCall(config, function (response) { callback(response); });
		};

		/* service.getHeaders = function(data, callback) {
		var dataObj={};
		dataObj["data"] = data;
			dataObj["userId"]= $rootScope.globals.userId;
			dataObj["userName"]= $rootScope.globals.userName;
			dataObj["accessToken"]= $rootScope.globals.accessToken;
			dataObj["userRole"]= $rootScope.globals.userRole;
		var config = interceptorService.getConfig(dataObj,appEnvironment.HEADER_URL);
		interceptorService.apiCall(config, function (response) {callback(response);});
		} */

		service.validateSwitchUserRole = function (data, callback) {
			var dataObj = {};
			dataObj = getRequestHeaders($rootScope.globals)
			dataObj["data"] = data;

			var config = interceptorService.getConfig(dataObj, appEnvironment.VALIDATE_SWITCH_USER_ROLE);
			interceptorService.apiCall(config, function (response) { callback(response); });
		};
		service.releaseUploadedFiles = function (data, callback) {
			var dataObj = {};
			dataObj = getRequestHeaders($rootScope.globals)
			dataObj["data"] = data;
			var config = interceptorService.getConfig(dataObj, appEnvironment.RELEASE_FILE);
			interceptorService.apiCall(config, function (response) { callback(response); });
		};



		service.resetUserLogoutTimer = function (data, callback) {
			var dataObj = {};
			dataObj = getRequestHeaders($rootScope.globals)
			dataObj["data"] = data;
			interceptorService.resetTimeOut();
		};
		initialize();

		return service;

	}]);
