"use strict";

/**
 * @ngdoc controller
 * @name phc_dashboard.controller:BaseCtrl
 * @description
 *   This controller is used on all the pages except the HF card which doesn't inherit from base
 */
angular.module('app-herams').controller('MainCtrl', function($scope,commonSvc,$log) {

    $scope.home = function() {
        commonSvc.home();
    }

});
