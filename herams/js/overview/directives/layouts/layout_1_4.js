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
angular.module('app-herams').directive('layout14', function(chartsSvc,$timeout,$log) {

    var chartdata;

    function setWindowResize() {
        $(window).on('resize', function () {
            $( "#chart1" ).empty();
            $( "#chart2" ).empty();
            $( "#chart3" ).empty();
            $( "#chart4" ).empty();
            loadcharts();
        });
    }

    function loadcharts() {
        $log.info('----- drawing charts -----');

        chartsSvc.loadChart(chartdata[0],'chart1');
        chartsSvc.loadChart(chartdata[1],'chart2');
        chartsSvc.loadChart(chartdata[2],'chart3');
        chartsSvc.loadChart(chartdata[3],'chart4');
   }

    return {
        templateUrl: '/js/overview/directives/layouts/layout_1_4.html',
        restrict: 'E',
        replace: true,
        scope: {
            data:"="
        },
        controller: function($scope) {
            $scope.$watch('data',function(data){
                if (data.length>0) {
                    chartdata = data;
                    $timeout(function() {
                       loadcharts();
                       setWindowResize();
                    },300);
                }
            });
        }

     }

});

