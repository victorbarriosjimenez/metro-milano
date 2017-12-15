'use strict';

/**
 * @ngdoc function
 * @name newappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the newappApp
 */
angular.module('newApp')
  .controller('dashboardCtrl', ['$scope', 'dashboardService', 'pluginsService', function ($scope, dashboardService, pluginsService) {
      $scope.$on('$viewContentLoaded', function () {

      });

      $scope.activeTab = true;

  }]);
