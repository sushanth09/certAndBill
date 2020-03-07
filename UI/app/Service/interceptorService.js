myApp.factory('interceptorService', ['Base64', 'busyNotificationService', 'modalService', '$http', '$cookieStore', '$rootScope', '$timeout', 'config', 'cryptoService', 'localconfig', 'serverconfig', 'appConstants',
    function (Base64, busyNotificationService, modalService, $http, $cookieStore, $rootScope, $timeout, config, cryptoService, localconfig, serverconfig, appConstants) {
		var service = {};
        var appEnvironment = '';
        var errorResponse = {
            "status": "failed"
        };

        initialize();

        function initialize() {
            console.log("adminAuditLogService.initialize()");
            if (APP_ENVIRONMENT === config.ENVIRONMENT_LOCAL) {
                appEnvironment = localconfig;
            } else if (APP_ENVIRONMENT === config.ENVIRONMENT_SERVER) {
                appEnvironment = serverconfig;
            }
        }

		service.encapsulateRequest = function (req) {
			if(req.data == undefined || req.data == null){
				req.data = {};
			}
			
			//validParams (req tampering)
			var validParams = {};
			for(key in req){
				if(key != "data"){
					validParams[key] = req[key];
				}
			}
			req["data"]["validParams"] = validParams;


			var encData = cryptoService.encrypt(req.data);
			req.iv = encData.iv;
			req.salt = encData.salt;
			req.data = encData.data;
			return req;
		};
		 service.getConfig = function(data,url) {
			 var dataObj={};
			  dataObj = data;
				busyNotificationService.showBusyIndicator();
				dataObj = service.encapsulateRequest(data);
				var config = {
					method: appEnvironment.METHOD_POST,
					url: url,
					data: dataObj,
				};
				
				return config ;
		}
				  
		service.apiCall = function(config, callback){
			$http(config).success(function (response) {
				$rootScope.sessionTime = (Number(response.sessionTimeout == undefined || response.sessionTimeout == null ? ($rootScope.sessionTime / 60000) : response.sessionTimeout) * 60000);
				$rootScope.$broadcast('clearTimer', {data:{}});
                busyNotificationService.hideBusyIndicator();
				if($rootScope.globals.currentUser == undefined || $rootScope.globals.currentUser == null)
					$rootScope.globals.currentUser = {};
				$rootScope.globals.currentUser.accessToken = response.accessToken == undefined || response.accessToken == null ? $rootScope.globals.currentUser.accessToken : response.accessToken;
				callback(response);
				busyNotificationService.hideBusyIndicator();
            }).error(function (response) {
				console.log("inside error response:::::::::: "+JSON.stringify(response));
				busyNotificationService.hideBusyIndicator();
				var modalOptions = {
					isCloseEnabled: false,
					headerText: 'Information',
					bodyText: 'Could not connect to LMS Server. Please Contact LMS Support.'
				};
				modalService.showModal({}, modalOptions).then(function (result) {});
				try{
					$rootScope.sessionTime = (Number(response.sessionTimeout == undefined || response.sessionTimeout == null ? ($rootScope.sessionTime / 60000) : response.sessionTimeout) * 60000);
					$rootScope.$broadcast('clearTimer', {data:{}});
				}catch(e){
					console.log("Error in Interceptor Service"+e);
				}
                callback(response);
				busyNotificationService.hideBusyIndicator();
            });
		}

		return service;
}]);