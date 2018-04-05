"use strict";


/**
 * @ngdoc controller
 * @name phc_dashboard.controller:HomeCtrl
 * @description
 *   Overall controller for the 'Home' page
 */
angular.module('app-herams').controller('HomeCtrl', function($scope,commonSvc,$log) {

    /* - Collapsable Panel - */
    var collapsed = false;

    function setCollapse() {
        $('.collapse-left-content').click(function() {
            $('.menu-entry').addClass('reduced');
            $('.map-entry').addClass('fullscreen');

            collapsed = !collapsed;

            $scope.$broadcast('collapse-click',{collapsed: collapsed});
        });

        $('.expand-left-content').click(function() {
                $('.menu-entry').removeClass('reduced');
                $('.map-entry').removeClass('fullscreen');

            collapsed = !collapsed;

            $scope.$broadcast('collapse-click',{collapsed: collapsed});
        });
    }


    /* - Init - */
    $scope.homedata = {};
    $scope.init = function() {

        return commonSvc.loadData('config/home_data.json').then(loadSuccess)
                    .catch(loadFailure)
                    .then(loadFinally);

        function loadSuccess(httpResponse) {

            $scope.homedata = httpResponse.data.results;
            setCollapse();

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




