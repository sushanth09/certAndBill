var myApp = angular.module('myApp', ['ui.router', 'angularMoment', 'ui.bootstrap.datetimepicker', 'mb-scrollbar']);
 
// date time picker
angular.module('myApp').directive('restrictInput', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attr, ngModelCtrl) {
      function fromUser(text) {
        var transformedInput = text.replace(/[^0-9:-]/g, '');
        console.log(transformedInput);
        if(transformedInput !== text) {
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render();
        }
        return transformedInput;
      }
      ngModelCtrl.$parsers.push(fromUser);
    }
  }; 
});

(function() {
    'use strict';

    /**
     * @desc - Shows a thumbnail caption on hover.
     * @example <input type="text" ng-model="field.value" date-parser="{{momentFormat}}"/>
     */
    angular
        .module('myApp')
        .directive('dateParser', dateParser);

    function dateParser() {

        return {
            link: link,
            restrict: 'A',
            require: 'ngModel'
        };

        function link(scope, element, attrs, ngModel) {
            var moment = window.moment,
                dateFormat = attrs.dateParser,
                alternativeFormat = dateFormat.replace('DD', 'D').replace('MM', 'M'); //alternative do accept days and months with a single digit

            //use push to make sure our parser will be the last to run
            ngModel.$formatters.push(formatter);
            ngModel.$parsers.push(parser);

            function parser(viewValue) {
                var value = ngModel.$viewValue; //value that none of the parsers touched
                if(value) {
                    var date = moment(value, [dateFormat, alternativeFormat], true);
                    ngModel.$setValidity('date', date.isValid());
                    return date.isValid() ? date._d : value;
                }

                return value;
            }

            function formatter(value) {
                var m = moment(value);
                var valid = m.isValid();
                if (valid) return m.format(dateFormat);
                else return value;
            }
        }
    }

})();