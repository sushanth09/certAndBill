myApp.controller('encryptController', ['Base64', 'busyNotificationService', '$scope', '$filter', '$location', '$window', '$rootScope', '$state', 'appConstants', 'modalService', 'auditFactory', 'responseStatus', 'encryptService',
	function (Base64, busyNotificationService, $scope, $filter, $location, $window, $rootScope, $state, appConstants, modalService, auditFactory, responseStatus, encryptService) {

		$scope.encryData = {};
		$scope.base64Key = CryptoJS.enc.Base64.parse(Base64.encode("KDocs"));
		$scope.iv = CryptoJS.enc.Base64.parse(Base64.encode("abcdef9876543210"));

		$scope.encryptData = function () {
			var encrypted = CryptoJS.AES.encrypt(
				JSON.stringify($scope.encryData),
				"abcdef9876543210",
				{ iv: "abcdef9876543210" });
			$scope.ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);

			var cipherParams = CryptoJS.lib.CipherParams.create({
				ciphertext: CryptoJS.enc.Base64.parse($scope.ciphertext)
			});
			var decrypted = CryptoJS.AES.decrypt(
				cipherParams,
				$scope.base64Key,
				{ iv: $scope.iv });
			$scope.descrString = decrypted.toString(CryptoJS.enc.Utf8);
			var data2 = { "cif": "ttt" };
			encryptService.encryptDataService(data2, function (response) {
				if (response.status == 'success') {
				} else if (response.status === "failed") {
					var modalOptions = {
						isCloseEnabled: false,
						headerText: 'Information',
						bodyText: (response.message == undefined || response.message == null || response.message == "") ? 'There has been some internal issue.' : response.message
					};
				}
			});

		}
	}
]);
