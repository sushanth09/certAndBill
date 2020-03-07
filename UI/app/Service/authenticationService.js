myApp.factory('authenticationService', ['Base64', 'busyNotificationService', 'modalService', '$http', '$cookieStore', '$rootScope', '$timeout', 'config', 'cryptoService', 'interceptorService', 'localconfig', 'serverconfig', 'appConstants',
    function (Base64, busyNotificationService, modalService, $http, $cookieStore, $rootScope, $timeout, config, cryptoService, interceptorService, localconfig, serverconfig, appConstants) {

        var service = {};
        var appEnvironment = '';

        var errorResponse = { "status": "failed" };

        initialize();

        function initialize() {
            if (APP_ENVIRONMENT === config.ENVIRONMENT_LOCAL) {
                appEnvironment = localconfig;
            } else if (APP_ENVIRONMENT === config.ENVIRONMENT_SERVER) {
                appEnvironment = serverconfig;
            }
        }

        service.login = function (userId, password, userData, callback) {
            busyNotificationService.showBusyIndicator();
            var pwd = Base64.encode(password);
            var data = { "password": pwd };
            var dataObj = {
                "userId": userId,
                "data": data,
                "action": "validateUser",
                "isNewUser": userData["isNewUser"]
            };
            console.log("dataObj >> " + JSON.stringify(dataObj));
            dataObj = interceptorService.encapsulateRequest(dataObj);
            var config = {
                method: appEnvironment.METHOD_POST,
                url: appEnvironment.LOGIN_URL,
                data: dataObj
            };
            interceptorService.apiCall(config, function (response) {
                callback(response);
            });
        };
        service.logout = function (action, callback) {
            //busyNotificationService.showBusyIndicator();
            var dataObj = {};
            dataObj = getRequestHeaders($rootScope.globals)
            dataObj = {
                "action": action
            };

            dataObj = interceptorService.encapsulateRequest(dataObj);

            var config = {
                method: appEnvironment.METHOD_POST,
                url: appEnvironment.USER_MANAGEMENT,
                data: dataObj
            };

            interceptorService.apiCall(config, function (response) {
                callback(response);
            });

        };
        
        /* Reset Timer */
        service.resetSession = function (data, callback) {
            var dataObj = {};
            dataObj = getRequestHeaders($rootScope.globals)
            dataObj['data'] = data;
            dataObj['action'] = 'resetSession';

            dataObj = interceptorService.encapsulateRequest(dataObj);

            var config = {
                method: appEnvironment.METHOD_POST,
                url: appEnvironment.USER_MANAGEMENT,
                data: dataObj
            };

            interceptorService.apiCall(config, function (response) {
                callback(response);
            });
        };

        service.ClearCredentials = function () {
            console.log("authenticationService.ClearCredentials()");
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        };

        return service;
    }]);

myApp.factory('Base64', function () {
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        }
    };

});