'use strict';

/**
 * @ngdoc directive
 * @name app-herams.directive:layout13
 * @restrict E
 * @scope
 *   @param {type} description
 * @description
 *   map on the left + 3 blocks next to it on the right, 2 top and 1 below
 * @example
 *   <layout13 />
 */
angular.module('app-herams').directive('layout13', function(HFMapSvc,$timeout,$log,commonSvc) {

    function config(chart) {
       chart.colors = SAMPLECHART.colors;
       return chart;
    }

    function loadcharts() {

        var chart1_data = commonSvc.deepCopy(SAMPLECHART.stacked_chart),
            chart2_data = commonSvc.deepCopy(SAMPLECHART.stacked_chart);

        chart1_data.title.text = "Damage";
        chart2_data.title.text = "Function";

        // chart-container
        Highcharts.chart('chart1', config(chart1_data));
        Highcharts.chart('chart2', config(chart2_data));
    }

    return {
        templateUrl: '/js/overview/directives/layouts/layout_1_3.html',
        restrict: 'E',
        replace: true,
        scope: {
            mapdata:"="
        },
        link: function(scope) {
            loadcharts();
        }

     }

});

