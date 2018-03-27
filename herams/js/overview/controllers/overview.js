"use strict";


/**
 * @ngdoc controller
 * @name phc_dashboard.controller:BaseCtrl
 * @description
 *   This controller is used on all the pages except the HF card which doesn't inherit from base
 */
angular.module('app-herams').controller('MainCtrl', function($scope,commonSvc,$log) {

    /* ui-router */
    $scope.home = function() {
        commonSvc.home();
    }

    /* CHARTS (temporary) */

    function config(chart) {
       chart.colors = SAMPLECHART.colors;
       return chart;
    }

    $scope.loadcharts = function() {
        // chart-container
        Highcharts.chart('chart1', config(SAMPLECHART.stacked_chart));
        Highcharts.chart('chart2', config(SAMPLECHART.stacked_chart));
        Highcharts.chart('chart3', config(SAMPLECHART.stacked_chart));
        Highcharts.chart('chart4', config(SAMPLECHART.stacked_chart));
    }

    console.log(config(SAMPLECHART));
    console.log(config(SAMPLECHART.stacked_chart));

    // $scope.loadcharts();

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

});
