myApp.factory('encryptService', ['Base64', 'busyNotificationService', 'modalService', '$http', '$cookieStore', '$rootScope', '$timeout', 'config', 'cryptoService', 'localconfig', 'serverconfig', 'appConstants',
    function (Base64, busyNotificationService, modalService, $http, $cookieStore, $rootScope, $timeout, config, cryptoService, localconfig, serverconfig, appConstants) {

        var service = {};
        var appEnvironment = '';

        var errorResponse = {"status": "failed"};

        initialize();

        function initialize() {
            console.log("encryptService.initialize()");
            if (APP_ENVIRONMENT === config.ENVIRONMENT_LOCAL) {
                appEnvironment = localconfig;
            } else if (APP_ENVIRONMENT === config.ENVIRONMENT_SERVER) {
                appEnvironment = serverconfig;
            }
        }
		
		service.encryptDataService = function(data, callback){
			var dataObj = {
				"data": data
			}
			var config = {
                method: appEnvironment.METHOD_POST,
                url: appEnvironment.ENCODE_URL,
                data: dataObj
            };
            console.log("encryptService.encrypt()");
            $http(config).success(function (response) {
                busyNotificationService.hideBusyIndicator();
				callback(response);
            }).error(function (data, status) {
                busyNotificationService.hideBusyIndicator();
                callback(errorResponse);
            });
		};
		
		service.decryptDataService = function(data, callback){
			var dataObj = {
				"data": data
			}
			var config = {
                method: appEnvironment.METHOD_POST,
                url: appEnvironment.DECODE_URL,
                data: dataObj
            };
            console.log("encryptService.decrypt() ");
            $http(config).success(function (response) {
                busyNotificationService.hideBusyIndicator();
				callback(response);
            }).error(function (data, status) {
                busyNotificationService.hideBusyIndicator();
                callback(errorResponse);
            });
		};
		return service;
}]);