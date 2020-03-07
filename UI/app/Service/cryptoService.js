myApp.factory('cryptoService', ['Base64', 'busyNotificationService', 'modalService', '$http', '$cookieStore', '$rootScope', '$timeout', 'config', 'localconfig', 'serverconfig', 'appConstants',
    function (Base64, busyNotificationService, modalService, $http, $cookieStore, $rootScope, $timeout, config, localconfig, serverconfig, appConstants) {

        var service = {};
        var appEnvironment = '';

        var errorResponse = {"status": "failed"};

        initialize();

        function initialize() {
            console.log("authenticationService.initialize()");
            if (APP_ENVIRONMENT === config.ENVIRONMENT_LOCAL) {
                appEnvironment = localconfig;
            } else if (APP_ENVIRONMENT === config.ENVIRONMENT_SERVER) {
                appEnvironment = serverconfig;
            }
        }
		
		service.encryptDataLogin = function (data) {
			var encryptedData = CryptoJSHM.HmacSHA1(data, appConstants.ENCRY_CODE);
			return encryptedData.toString();
		};
		
		service.encryptData = function (data) {
			var encryptedData = CryptoJSHM.HmacSHA1(JSON.stringify(data), appConstants.ENCRY_CODE);
			return encryptedData.toString();
		};
		
		service.encrypt = function (data) {
			/* Encrypt */
			data = JSON.stringify(data);
			var iterationCount = 1000;
			var keySize = 128;
			var iv = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
			var salt = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
			var aesUtil = new AesUtil(keySize, iterationCount);
			ciphertext = aesUtil.encrypt(salt, iv, appConstants.ENCRY_CODE, data);
			return {"iv":iv,"salt":salt,"data":ciphertext};
		};
		service.decrypt = function (data, iv, salt) {
			if(data == undefined || data == null || data == ""){
				return;
			} else if (Object.keys(data).length === 0){
				return;
			}

			/* Decrypt */
			var iterationCount = 1000;
			var keySize = 128;
			var iv = iv;
			var salt = salt;
			var aesUtil = new AesUtil(keySize, iterationCount);
			plaintext = aesUtil.decrypt(salt, iv, appConstants.ENCRY_CODE, data);
			return JSON.parse(plaintext);
		};

        return service;
    }]);