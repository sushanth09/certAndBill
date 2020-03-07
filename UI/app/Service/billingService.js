myApp.factory('billingService', ['busyNotificationService', 'modalService', '$http', '$cookieStore', '$rootScope', '$timeout', 'config', 'cryptoService', 'interceptorService', 'localconfig', 'serverconfig', 'appConstants',
	function (busyNotificationService, modalService, $http, $cookieStore, $rootScope, $timeout, config, cryptoService, interceptorService, localconfig, serverconfig, appConstants) {

		var service = {};
		var appEnvironment = '';
		var errorResponse = {
			"status": "failed"
		};

		initialize();
		
		service.callApi = function(data, URL, action, callback) {
			var dataObj={};
		    dataObj = getRequestHeaders($rootScope.globals)
		    dataObj["data"] = data;
		    dataObj["action"]= action;
		    console.log("dataObj :: "+JSON.stringify(dataObj));
		    var config = interceptorService.getConfig(dataObj, URL);
            interceptorService.apiCall(config, function(response) {
                callback(response);
            });
        }
		
		service.callFileApi = function(file, dataObj, URL, callback) {
			console.log("lmsService.uploadFile() called");
			console.log("globals values: " + JSON.stringify($rootScope.globals));
			busyNotificationService.showBusyIndicator();
		    var fd = new FormData();
			fd.append("file", file);
			fd.append("fileName", checkEmptyField(dataObj["data"]["fileName"]) ? "" : dataObj["data"]["fileName"]);
			fd.append("statementDate", checkEmptyField(dataObj["data"]["statementDate"]) ? "" : dataObj["data"]["statementDate"]);
			fd.append("paymentId", checkEmptyField(dataObj["data"]["paymentId"]) ? "" : dataObj["data"]["paymentId"]);
			fd.append("mfInvestDate", checkEmptyField(dataObj["data"]["mfInvestDate"]) ? "" : dataObj["data"]["mfInvestDate"]);
			fd.append("nbfcId", checkEmptyField(dataObj["data"]["nbfcId"]) ? "" : dataObj["data"]["nbfcId"]);
			fd.append("action", dataObj["action"]);
			fd.append("userId", $rootScope.globals.userId);
			fd.append("userName", $rootScope.globals.userName);
			fd.append("accessToken", $rootScope.globals.accessToken);
			console.log("fd data: " + JSON.stringify(fd));
			$http.post(URL, fd, {
				transformRequest: angular.identity,
				headers: {"Content-Type": undefined}
			})
			.success(function(response){
				busyNotificationService.hideBusyIndicator();
				//$rootScope.globals.currentUser.accessToken = response.accessToken;
				callback(response);
			})
			.error(function(response){
				busyNotificationService.hideBusyIndicator();
				callback(response);
			});
        }
		
		function initialize() {
			console.log("lmsService.initialize()");
			if (APP_ENVIRONMENT === config.ENVIRONMENT_LOCAL) {
				appEnvironment = localconfig;
			} else if (APP_ENVIRONMENT === config.ENVIRONMENT_SERVER) {
				appEnvironment = serverconfig;
			}
		}
		return service;
	}
]);