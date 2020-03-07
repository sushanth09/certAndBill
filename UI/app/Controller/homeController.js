myApp.controller('homeController', ['busyNotificationService', '$timeout', '$scope', '$uibModal', '$filter', '$location', '$window', '$rootScope', '$state', 'appConstants', 'localconfig', 'serverconfig', 'config', 'modalService', '$http', '$stateParams', 'lmsService',
    function (busyNotificationService, $timeout, $scope, $uibModal, $filter, $location, $window, $rootScope, $state, appConstants, localconfig, serverconfig, config, modalService, $http, $stateParams, lmsService) {
		var data = {};
		function initialize(){
			$rootScope.bodylayout = '';
			console.log("Home Controller loaded");
			if($rootScope.globals == undefined){
				$state.go("login");
			}
			$scope.appConstants = appConstants;
            if (APP_ENVIRONMENT === config.ENVIRONMENT_LOCAL) {
                appEnvironment = localconfig;
            } else if (APP_ENVIRONMENT === config.ENVIRONMENT_SERVER) {
                appEnvironment = serverconfig;
			}
		}
		
		$scope.handleResponseError= function(response){
			if (response.status == "failed") {
				
			   var modalOptions = {
				   actionButtonText: 'Ok',
				   headerText: 'Error',
				   bodyText: response.message
			   };
			   modalService.showModal({}, modalOptions).then(function(result) {});
			   if(response.statusCode == -6006 || response.statusCode == -6007 || response.statusCode == -6008  || response.statusCode == -6010 || response.statusCode == -6011) { $state.go("login");}
		   }  else if (response.status == "")  {
			   var modalOptions = {
				   actionButtonText: 'Ok',
				   headerText: 'Error',
				   bodyText: "Unable to connect to server"
			   };
			   modalService.showModal({}, modalOptions).then(function(result) {});
		   }
	   }
	   
		initialize();
	}
]);
