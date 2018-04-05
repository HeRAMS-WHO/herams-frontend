'use strict';

/**
 * @ngdoc service
 * @name phc_dashboard.service:MapSvc
 * @description
 *   This service provides methods related to the map.
 */
angular.module('app-herams').service('ChartConfigSvc', function($log,commonSvc) {

    var chartW = 102,
        chartH = 102,
        bgColor = '#42424b',
        tmpMainDonuts = {
           chart: {
               type: 'pie',
               animation: true,
               margin: [0,0,0,0],
               spacingBottom: 0,
               spacingTop: 0,
               spacingLeft: 0,
               spacingRight: 0,
               backgroundColor: bgColor,
               height: chartW,
               width: chartH
           },
           exporting: {
               enabled: false
           },
           credits: {
               enabled: false
           },
           title: {
               text: ' '
           },
           legend: {
               enabled: false
           },
           plotOptions: {
               pie: {
                   borderColor: 'transparent',
                   innerSize: '93%',
                   innerColor: 'white',
                   enableMouseTracking: true,
                   dataLabels: {
                       enabled: false
                   }
               }
           },
           tooltip: {
               enabled: false
           },
           series: [
               {
                   size: '100%',
                   states: {
                       hover: {
                           enabled: false
                       }
                   }
               }
           ]
       };

    return {

        getGenPie: function() {
            return tmpMainDonuts;
        },
        setTmpChart: function(n,color) {
            var custChart = commonSvc.deepCopy(this.getGenPie());

            custChart.series[0].data = [
               {
                   y: n,
                   color: color,
                   noTooltip: false
               },
               {
                   y: 100-n,
                   color: '#6c6b70'
               }
            ];

            return custChart;
        },
        setTmpChartMultVal: function(data) {
            var custChart = commonSvc.deepCopy(this.getGenPie());
            custChart.series[0].data = data;

            return custChart;
        },
        setAfterAnimate: function(chart,f) {
            chart.plotOptions.pie.events = {};
            chart.plotOptions.pie.events.afterAnimate = f();
        }
    }
});
