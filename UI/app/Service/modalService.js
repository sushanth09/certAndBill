myApp.service('modalService', [ '$rootScope', '$uibModal', 'config', 'localconfig', 'serverconfig', 'appConstants',
    function ($rootScope, $modal, config, localconfig, serverconfig, appConstants){
      
      var appEnvironment = '';
        
        initialize();
        
        function initialize () {
          if(APP_ENVIRONMENT === config.ENVIRONMENT_LOCAL) {
            appEnvironment = localconfig;
          } else if (APP_ENVIRONMENT === config.ENVIRONMENT_SERVER) {
            appEnvironment = serverconfig;
          }
        }
        
        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'app/Views/common/prompt-modal.html'
        };
		//**************Edited by AI***************//
        var modalOptions = {
            isCloseEnabled : false,
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };
		//*****************************************//

        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $modalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        $modalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $modalInstance.dismiss('cancel');
                    };
                };
            }

            return $modal.open(tempModalDefaults).result;
        };
            
}]);