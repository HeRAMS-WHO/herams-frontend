"use strict";


/**
 * @ngdoc controller
 * @name phc_dashboard.controller:BaseCtrl
 * @description
 *   This controller is used on all the pages except the HF card which doesn't inherit from base
 */
angular.module('app-herams').controller('HomeCtrl', function($scope,commonSvc,$log) {

    $scope.homedata = {};

    $scope.init = function() {

        return commonSvc.loadData('config/home_data.json').then(loadSuccess)
                    .catch(loadFailure)
                    .then(loadFinally);

        function loadSuccess(httpResponse) {

            $scope.homedata = httpResponse.data.results;
            $log.info('loaded Home Data correctly: ',httpResponse);
        }

        function loadFailure(httpResponse) {
            $log.info('There has been an error Home Data');
        }

        function loadFinally(httpResponse) {
            $log.info('Home - last but not least');
        }

    }

});


