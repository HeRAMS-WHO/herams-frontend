"use strict";


/**
 * @ngdoc controller
 * @name phc_dashboard.controller:BaseCtrl
 * @description
 *   This controller is used on all the pages except the HF card which doesn't inherit from base
 */
angular.module('app-herams').controller('MainCtrl', function($scope,commonSvc,$log,HFMapSvc) {


    $scope.date = new Date();

    /* ui-router */
    $scope.home = function() {
        commonSvc.home();
    }

    /* Data Load */
    $scope.init = function() {

        return commonSvc.loadData('config/overview_data.json').then(loadSuccess)
                    .catch(loadFailure)
                    .then(loadFinally);

        function loadSuccess(httpResponse) {

            $scope.heramdata = httpResponse.data.results;
            $log.info('loaded Overview Data correctly: ',$scope.heramdata);
        }

        function loadFailure(httpResponse) {
            $log.info('There has been an error Overview Data');
        }

        function loadFinally(httpResponse) {
            $log.info('Overview - last but not least');
        }

    }

    $(window).on('resize pageshow', function () {
        HFMapSvc.refreshLayout();
    });

    /* Partners */
    $('.partners-list-btn').click(function() {
        $('.partners-list-grp').show();
        $('.partners-list-cache').click(function() {
            $('.partners-list-grp').hide();
        });
    });


});
