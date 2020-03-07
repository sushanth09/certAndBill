       var APP_ENVIRONMENT = "server";
    var APP_API_URL = "http://192.168.0.4:80/api/";
// var APP_ENVIRONMENT = "local";
// var APP_API_URL = "http://192.168.0.4:80/api/";  

var myApp = angular.module('myApp', ['ui.router', 'angularMoment', 'ui.bootstrap', 'ui.bootstrap.datetimepicker', 'mb-scrollbar', 'uiSwitch',
    'angularFileUpload', 'ngCookies', 'pdf', 'ngSanitize', 'ngCsv', 'dndLists']);
    angular.module('myApp').directive('restrictInput', function () {
      return {
          restrict: 'A',
          require: 'ngModel',
          link: function (scope, element, attr, ngModelCtrl) {
              function fromUser(text) {
                  var transformedInput = text.replace(/[^0-9:-]/g, '');
                  console.log(transformedInput);
                  if (transformedInput !== text) {
                      ngModelCtrl.$setViewValue(transformedInput);
                      ngModelCtrl.$render();
                  }
                  return transformedInput;
              }
              ngModelCtrl.$parsers.push(fromUser);
          }
      };
  });
  myApp.directive('currencyConvertor', function() {
      return {
          
          link: function(scope, element, attrs) {
              scope.$watch(element.attr('currency-convertor'), function() {
                  initializeConversion();
                });
              function initializeConversion() {
                  
                  scope.formattedVal = inrFormatVal1(scope.$eval(element.attr('currency-convertor')));
                  element.text(scope.formattedVal);
                  return true;
              }
              
          }
      }
  });
  myApp.directive('inputCurrencyConvertor', function() {
      return {
          restrict: 'A',
          scope : {
              paymentamt : "=",
              functionname : "&"
          },
          link: function(scope, element, attrs) {
              firstInitializeConversion();
              
              $(element).on('change keyup input focus focusin focusout', function() {
                  initializeConversion();
              })
              
              function initializeConversion() {
                // scope.paymentamt = amount(element.val());
                // scope.$apply();
                // scope.functionname();
                // scope.$apply();
                // return true;

                if(element.val() != undefined && element.val() != '' && element.val() != 0.00) {
                  var cursor = element[0].selectionStart;
                  scope.paymentamt = parseFloat(amount(element.val())).toFixed(2);
                  console.log("cursor :: "+cursor)
                  scope.functionname();
                  scope.$apply();
                  inrFormatedValue = angular.copy(inrFormatVal1(scope.paymentamt));
                  
                  
                  //element.setCursorPosition(cursor)
                  element.val(inrFormatedValue);
                  element[0].setSelectionRange(cursor, cursor);
                  return true;
                } else {
                  
                  scope.paymentamt = 0.00;
                  scope.functionname();
                  scope.$apply();
                  
                }
                
              }
              function firstInitializeConversion() {
                
                if(scope.paymentamt != undefined && scope.paymentamt != '') {
                  console.log("firstInitializeConversion called");
                  scope.paymentamt = parseFloat(amount(scope.paymentamt.toString())).toFixed(2);
                  scope.functionname();
                  console.log("inrFormat :: "+inrFormat(scope.paymentamt));
                  element.val(inrFormat(scope.paymentamt));
                  return true;
                }
                
              }
          }
      }
  }); 
  
  angular.module('myApp').directive('customTables', function () {
      return {
        scope : true,
        controller: function ($scope, $element, $parse) {
          
          $scope.initPageArray = function() {
            $scope.customTablePagination = {
              "getMaxRows": 10,
              "getStartRow": 0,
              "pagearray": [],
              "showing": "",
              "currentPage": 1,
              "pagination": "",
            }
            
          }
          
          $scope.initPageArray();
          tinitialize();
          function tinitialize() {
            console.log("$element :: "+$scope.$eval($element.attr('records')));
            $scope.records = $scope.$eval($element.attr('records'));
            if ($scope.records != undefined) {
              
              customTableFooter = "";
              var totalPages = $scope.records.length / $scope.customTablePagination['getMaxRows'];
              $scope.setPagination();
              if (totalPages != undefined) {
                $scope.customTablePagination['pagination'] = "";
                for (var i = 0; i < $scope.customTablePagination.pagearray.length; i++) {
                  isPrev = $scope.customTablePagination.pagearray[i] == 'Prev' ? true : false;
                  isNext = $scope.customTablePagination.pagearray[i] == 'Next' ? true : false;
                  isContinue = $scope.customTablePagination.pagearray[i] == '...' || $scope.customTablePagination.pagearray[i] == '..' ? true : false;
                  if (!isNext && !isPrev && !isContinue) {
                    item = Math.trunc($scope.customTablePagination.pagearray[i]);
                  } else {
                    item = $scope.customTablePagination.pagearray[i];
                  }
                  isActive = item == $scope.customTablePagination.currentPage ? 'active' : '';
                  $scope.customTablePagination['pagination'] += "<li class='clickableLink " + isActive + "'>"
                  if (isNext) {
                    $scope.customTablePagination['pagination'] += "<a onclick='angular.element(this).scope().changePage("+($scope.customTablePagination.currentPage + 1)+")'>Next</a>";
                  } else if (!(item == 'Prev' || item == 'Next' || item == '..' || item == '...')) {
                    $scope.customTablePagination['pagination'] += "<a onclick='angular.element(this).scope().changePage("+item+")'>" + item + "</a>";
                  } else if (item == '..' || item == '...') {
                    $scope.customTablePagination['pagination'] += "<a class='continue'>" + item + "</a>";
                  } else if (isPrev) {
                    $scope.customTablePagination['pagination'] += "<a onclick='angular.element(this).scope().changePage("+($scope.customTablePagination.currentPage - 1)+")'>Prev</a>";
                  }
                  $scope.customTablePagination['pagination'] += "</li>";
                }
              }
              if ((($scope.customTablePagination.currentPage) * $scope.customTablePagination.getMaxRows) > $scope.records.length) {
                displayEndsRecordCount = $scope.records.length;
              } else {
                displayEndsRecordCount = (($scope.customTablePagination.currentPage) * $scope.customTablePagination.getMaxRows);
              }
    
              if ($scope.records.length > 0) {
                $scope.customTablePagination['showing'] = "Showing: " + ((($scope.customTablePagination.currentPage - 1) * $scope.customTablePagination.getMaxRows) + 1) + " - " + displayEndsRecordCount + " of " + $scope.records.length + " records";
              } else {
                $scope.customTablePagination['showing'] = "Showing: 0 - 0 of 0 Records";
              }
            }
            var tableFooter = $scope.customTablePagination['showing'];
            tableFooter += "<div class='pull-right'>";
            tableFooter += "<div class='pagination'>";
            tableFooter += $scope.customTablePagination['pagination'];
            tableFooter += "</div>";
            tableFooter += "</div>";
            $element.find('.customTableFooter').html(tableFooter);
            
          }
    
          $scope.setPagination = function () {
            $scope.customTablePagination.pagearray = [];
            var totalPages = Math.ceil($scope.records.length / $scope.customTablePagination['getMaxRows']);
            if (totalPages <= 5) {
              for (var i = 1; i <= totalPages; i++)
              $scope.customTablePagination.pagearray.push(i);
            }
    
            if (totalPages > 5) {
              if ($scope.customTablePagination['currentPage'] <= 3) {
                for (var j = 1; j <= 5; j++) {
                  $scope.customTablePagination.pagearray.push(j);
                }
                $scope.customTablePagination.pagearray.push('...');
                $scope.customTablePagination.pagearray.push(totalPages);
                $scope.customTablePagination.pagearray.push('Next');
              } else if (totalPages - $scope.customTablePagination['currentPage'] <= 3) {
                $scope.customTablePagination.pagearray.push('Prev');
                $scope.customTablePagination.pagearray.push(1);
                $scope.customTablePagination.pagearray.push('..');
                for (var k = totalPages - 4; k <= totalPages; k++) {
                  $scope.customTablePagination.pagearray.push(k);
                }
    
              } else {
                $scope.customTablePagination.pagearray.push('Prev');
                $scope.customTablePagination.pagearray.push(1);
                $scope.customTablePagination.pagearray.push('..');
                for (var l = $scope.customTablePagination['currentPage'] - 2; l <= $scope.customTablePagination['currentPage'] + 2; l++) {
                    console.log("l :: "+l);
                    $scope.customTablePagination.pagearray.push(l);
                }
                $scope.customTablePagination.pagearray.push('...');
                $scope.customTablePagination.pagearray.push(totalPages);
                $scope.customTablePagination.pagearray.push('Next');
              }
            }
          }
          $scope.$watch($element.attr('custom-tables'), function () {
            console.log('recordsChanged');
            $scope.initPageArray()
            tinitialize();
          });
          $scope.getLimit = function () {
            return $scope.customTablePagination.getMaxRows;
          }
          $scope.getStart = function () {
            return $scope.customTablePagination.getStartRow;
          }
          $scope.changePage = function (pageNo) {
            console.log("changePage called");
            $scope.customTablePagination.getStartRow = (parseInt(pageNo)-1) * $scope.customTablePagination.getMaxRows;
            $scope.customTablePagination.currentPage = parseInt(pageNo);
            tinitialize();
            $scope.$apply();
          }
    
        }
      }
  });
  (function () {
      'use strict';
  
      /**
       * @desc - Shows a thumbnail caption on hover.
       * @example <input type="text" ng-model="field.value" date-parser="{{momentFormat}}"/>
       */
      angular.module('myApp').directive('dateParser', dateParser);
  
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
                  if (value) {
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
  
  
      $(document).on('mouseenter', ".truncateText", function () {
          var $this = $(this);
          if (this.offsetWidth < this.scrollWidth && !$this.attr('title')) {
              $this.tooltip({
                  title: $this.text(),
                  placement: "bottom"
              });
              $this.tooltip('show');
          }
      });
  })();
