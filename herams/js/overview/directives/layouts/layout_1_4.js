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
angular.module('app-herams').directive('layout14', function(HFMapSvc,$timeout,$log) {

    function config(chart) {
       chart.colors = SAMPLECHART.colors;
       return chart;
    }

    function loadcharts() {
        // chart-container
        Highcharts.chart('chart1', config(SAMPLECHART.stacked_chart));
        Highcharts.chart('chart2', config(SAMPLECHART.stacked_chart));
        Highcharts.chart('chart3', config(SAMPLECHART.stacked_chart));
        Highcharts.chart('chart4', config(SAMPLECHART.stacked_chart));
    }

    return {
        templateUrl: '/js/overview/directives/layouts/layout_1_4.html',
        restrict: 'E',
        replace: true,
        scope: {
            mapdata:"="
        },
        link: function(scope) {

            console.log(config(SAMPLECHART));
            console.log(config(SAMPLECHART.stacked_chart));

            loadcharts();
        }

     }

});

