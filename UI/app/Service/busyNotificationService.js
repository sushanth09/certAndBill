myApp.factory('busyNotificationService', ['$rootScope',
  function ($rootScope) {

    var showBusyHandler;
    var hideBusyHandler;

    function showBusyIndicator() {
      console.log("busyNotificationService.showBusyIndicator()");
      if (showBusyHandler) {
        showBusyHandler();
        $rootScope.loading = true;
      }
    }

    function hideBusyIndicator() {
      console.log("busyNotificationService.hideBusyIndicator()");
      if (hideBusyHandler) {
        hideBusyHandler();
        $rootScope.loading = false;
      }
    }

    function registerBusyHandlers(showHandler, hideHandler) {
      console.log("busyNotificationService.registerBusyHandlers()");
      if (showHandler) {
        showBusyHandler = showHandler;
      }

      if (hideHandler) {
        hideBusyHandler = hideHandler;
      }

    }

    return {
      'showBusyIndicator': showBusyIndicator,
      'hideBusyIndicator': hideBusyIndicator,
      'registerBusyHandlers': registerBusyHandlers
    };

  }]);