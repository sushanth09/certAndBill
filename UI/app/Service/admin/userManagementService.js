myApp.factory('userManagementService', [ 'busyNotificationService', 'modalService', '$http', '$state', '$cookieStore', '$stateParams', '$rootScope', '$timeout', 'config', 'localconfig', 'serverconfig', 'appConstants', 'interceptorService',
    function (busyNotificationService, modalService, $http, $state, $cookieStore, $stateParams, $rootScope, $timeout, config, localconfig, serverconfig, appConstants,  interceptorService) {

        var service = {};
        var appEnvironment = '';

        var errorResponse = {"status": "failed"};

        initialize();

        function initialize() {
            console.log("userManagementService.initialize() called");
            if (APP_ENVIRONMENT === config.ENVIRONMENT_LOCAL) {
                appEnvironment = localconfig;
            } else if (APP_ENVIRONMENT === config.ENVIRONMENT_SERVER) {
                appEnvironment = serverconfig;
            }
        }
		 service.userManagement = function (data,action, callback) {
			 busyNotificationService.showBusyIndicator();
		   var dataObj={};
		   dataObj["data"] = data;
		   dataObj["userId"]= $rootScope.globals.userId;
		   dataObj["userName"]= $rootScope.globals.userName;
		   dataObj["accessToken"]= $rootScope.globals.accessToken;
		   dataObj["userRole"]= $rootScope.globals.currentRole;
		   dataObj["action"]= action;
		   var config = interceptorService.getConfig(dataObj,appEnvironment.USER_MANAGEMENT);
		   interceptorService.apiCall(config, function (response) {callback(response);});
		 };
		
		
		return service;

    }]);
