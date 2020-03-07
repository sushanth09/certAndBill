'use strict';

var Application = Application || {};

Application.Constants = angular.module('application.constants', []);
Application.Services = angular.module('application.services', []);
Application.Factories = angular.module('application.factories', []);
Application.Controllers = angular.module('application.controllers', []);
Application.Filters = angular.module('application.filters', []);
Application.Directives = angular.module('application.directives', []);

angular.modules('application.templates', []); // to be reused in future.


    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("home");
        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "app/Views/login.html"
            })
            .state('home', {
                url: "/home",
                templateUrl: "app/Views/home.html"
            });
    })

    .config('$httpProvider', function ($httpProvider) {

        if (!$httpProvider.defaults.header.get)
            $httpProvider.defaults.header.get = {};
        /* $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
        $httpProvider.defaults.headers.get['Expires'] = '0';     */

        $httpProvider.interceptors.push(['$q', '$injector', function ($q, $injector) {
            var notificationChannel, http;

            function getNotificationChannel() {
                return notificationChannel || $injector.get('requestNotificationChannel');
            }

            function getHttp() {
                return http || $injector.get('$http');
            }

            return {
                'request': function (config) {
                    getNotificationChannel.requestStarted();
                    return config;
                },
                'response': function (response) {
                    if (getHttp().pendingRequests.length < 1) {
                        getNotificationChannel.responseEnded();
                    }

                    return response;
                },
                'responseError': function (rejection) {
                    if (getHttp().pendingRequests.length < 1) {
                        getNotificationChannel.responseEnded();
                    }

                    var errorMessage;
                    switch (rejection.status) {
                        case 500:
                            errorMessage = 'Backend system error';
                            break;
                        case 401:
                            errorMessage = 'Not authorized error';
                            break;
                        default:
                            errorMessage = 'Unexpected system error';
                    }

                    getNotificationChannel.responseError(errorMessage);
                    return $q.reject(rejection);
                }
            };

        }]);

    });