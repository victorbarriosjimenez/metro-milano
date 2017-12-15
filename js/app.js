'use strict';

/**
 * @ngdoc overview
 * @name newappApp
 * @description
 * # newappApp
 *
 * Main module of the application.
 */
var MakeApp = angular
    .module('newApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.bootstrap'
    ])
    .config(function ($routeProvider) {
        //Se definen las distintas rutas y las cargará en el div principal de la aplicación
        $routeProvider
            .when('/', {
                templateUrl: 'dashboard/dashboard.html',
                controller: 'dashboardCtrl'
            })
            .when('/astar', {
                templateUrl: 'astar/astar.html',
                controller: 'astarCtrl'
            })
            .when('/frontend', {
                templateUrl: 'frontend/frontend.html',
                controller: 'frontendCtrl'
            })
            .when('/404', {
                templateUrl: 'pages/page-404.html',
            })
            //layout
            .otherwise({
                redirectTo: '/'
            });
    });


// Ruta spinner de carga o loading, usado para la carga del contenido
MakeApp.directive('ngSpinnerLoader', ['$rootScope',
    function ($rootScope) {
        return {
            link: function (scope, element) {
                element.addClass('hide');
                $rootScope.$on('$routeChangeStart', function () {
                    element.removeClass('hide');
                });
                $rootScope.$on('$routeChangeSuccess', function () {
                    setTimeout(function () {
                        element.addClass('hide');
                    }, 500);
                    $("html, body").animate({
                        scrollTop: 0
                    }, 500);
                });
            }
        };
    }
])

MakeApp.factory('httpErrorResponseInterceptor', ['$q', '$location',
    function ($q, $location) {
        return {
            response: function (responseData) {
                return responseData;
            },
            responseError: function error(response) {
                switch (response.status) {
                    case 401:
                        $location.path('/login');
                        break;
                    case 404:
                        $location.path('/404');
                        break;
                    default:
                        $location.path('/error');
                }

                return $q.reject(response);
            }
        };
    }
]);

MakeApp.config(['$httpProvider',
    function ($httpProvider) {
        $httpProvider.interceptors.push('httpErrorResponseInterceptor');
    }
]);