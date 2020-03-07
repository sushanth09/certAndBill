myApp.directive('loadingWidget', ['busyNotificationService', function (busyNotificationService) {
  return {
        restrict : 'A',
        //template : "app/Views/loading-widget-template.html",
        templateUrl: function(element, attr) {
        return attr.templateUrl ? attr.templateUrl : 'app/Views/loading-widget-template.html';
      },
        link : function (scope, element) {
          
          var showBusyIndicator =  function () {
            element.show();
          };
          
          var hideBusyIndicator =  function () {
            element.hide();
          };
          
          
          busyNotificationService.registerBusyHandlers(showBusyIndicator, hideBusyIndicator);
        }
    };

  
}]);


myApp.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

myApp.directive('alphabetsOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^A-Za-z]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});


myApp.directive('capitalize', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
          if (inputValue == undefined) inputValue = '';
          var capitalized = inputValue.toUpperCase();
          if (capitalized !== inputValue) {
            modelCtrl.$setViewValue(capitalized);
            modelCtrl.$render();
          }
          return capitalized;
        }
        modelCtrl.$parsers.push(capitalize);
        capitalize(scope[attrs.ngModel]); // capitalize initial value
      }
    };
  });


myApp.directive('decimalNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope) {    
            scope.$watch('trAmount', function(newValue,oldValue) {
                var arr = String(newValue).split("");
                if (arr.length === 0) return;
                if (arr.length === 1 && (arr[0] === '.' )) return;
                if (arr.length === 2 && newValue === '.') return;
                if (isNaN(newValue)) {
                    scope.trAmount = oldValue;
                }
            });
        }
    };
});


myApp.directive('disableArrowsSpaces', function() {

  function disableArrows(event) {
    if (event.keyCode === 37  || event.keyCode === 32) {
      event.preventDefault();
    }
  }

  return {
    link: function(scope, element, attrs) {
      element.on('keydown', disableArrows);
    }
  };  
});