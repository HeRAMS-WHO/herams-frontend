'use strict';

/**
 * @ngdoc directive
 * @name app-herams.directive:layout14
 * @restrict E
 * @scope
 *   @param {type} description
 * @description
 *   Lorem ipsum
 * @example
 *   <entry-popup />
 */
angular.module('app-herams').directive('layout14', function(HFMapSvc,$timeout,$log,commonSvc) {

    function config(chart) {
       chart.colors = SAMPLECHART.colors;

       return chart;
    }

    function loadcharts() {

        // $log.info(JSON.stringify(SAMPLECHART));

        var chart1_data = commonSvc.deepCopy(SAMPLECHART.bar_chart),
            chart2_data = commonSvc.deepCopy(SAMPLECHART.stacked_chart),
            chart3_data = commonSvc.deepCopy(SAMPLECHART.stacked_chart),
            chart4_data = commonSvc.deepCopy(SAMPLECHART.stacked_chart);

        chart1_data.title.text = "Damage";
        chart2_data.title.text = "Function";
        chart3_data.title.text = "Availability";

        Highcharts.chart('chart1', chart1_data);
        Highcharts.chart('chart2', config(chart2_data));
        Highcharts.chart('chart3', config(chart3_data));
    }

    return {
        templateUrl: '/js/overview/directives/layouts/layout_1_4.html',
        restrict: 'E',
        replace: true,
        scope: {
            mapdata:"="
        },

        link: function(scope) {
            $timeout(function() {
                $log.info('drawing charts');
                loadcharts();
            },300);
        },

        controller: function($scope) {
            $(window).on('resize', function () {
                $( "#chart1" ).empty();
                $( "#chart2" ).empty();
                $( "#chart3" ).empty();
                $( "#chart4" ).empty();
                loadcharts();
            });
        }

     }

});

