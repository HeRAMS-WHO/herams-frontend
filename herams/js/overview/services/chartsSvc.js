'use strict';

/**
 * @ngdoc service
 * @name app-herams.service:chartsSvc
 * @description
 *   This service provides a set of methods to handle charts in the workspace pages
 */
angular.module('app-herams').factory('chartsSvc', function($log,commonSvc) {

    var chartsInstances = [];

    /* - Stacked Bar charts specifics - */

    function initChart(container,distData) {

         if (distData.type == "stacked" || distData.type == "bar") {

             var chart_common_config = commonSvc.deepCopy(CONFIG.charts.common);
             var chart = $.extend(commonSvc.deepCopy(chart_common_config), CONFIG.charts.stacked);

             var titleFrmtd = (distData.total != undefined)? distData.title + '<span class="chart-title-total"> ('+ distData.total + ')</span>' : distData.title;
              
             chart.title.useHTML = true;
             chart.title.text = titleFrmtd;
             chart.xAxis.categories = distData.labels;
             chart.series = distData.series;

             if (distData.type == "stacked") chart.colors = distData.colors;

         } else {

            //var chart = commonSvc.deepCopy(CONFIG.charts.pie);
             var chart_common_config = commonSvc.deepCopy(CONFIG.charts.common);
             var chart = $.extend(commonSvc.deepCopy(chart_common_config), CONFIG.charts.pie);

            chart.title.text = distData.title;
            chart.tooltip = CONFIG.charts.tooltip_pie;
            chart.series[0].data = distData.data;

         }

         chart.chart.renderTo = container;
         chart.legend = CONFIG.charts.legend_cust;

         return chart;
    }

    function loadChart (container, chart_dist_data) {

        var chart = new Highcharts.Chart(initChart(container,chart_dist_data),function(chart){

            if (chart_dist_data.type == "pie") {

                insertCenterTxt(chart,chart_dist_data.total);
                setPieLegendClick(chart,chart_dist_data.total);

            } else if (chart_dist_data.type == "stacked") {

                setStackedMaxWdth(chart,container);

            }
        });

        chartsInstances.push(chart);

    }

    function removeCharts() {
        for (var i=0;i<chartsInstances.length;i++) {
           chartsInstances[i].destroy();
        }
        chartsInstances = [];
    }

    /* - Pie charts specifics - */
    function insertCenterTxt(chart,val) {

        var span = '<span class="pieChartCenterTxt">' + val + '</span>';
        var textY = chart.plotTop  + (chart.plotHeight * 0.5);

        $(chart.renderTo).append(span);
        span = $(chart.renderTo).find('.pieChartCenterTxt');
        span.css('top', textY);

    };

    function updtCenterTxt(chart,val) {

        var span = $(chart.renderTo).find('.pieChartCenterTxt');
        span.html(val);

    };

    function setPieLegendClick(piechart,total) {

        $(piechart.series[0].data).each(function(i, e) {
            e.legendItem.on('click', function() {
                if (!e.sliced) {
                    total -= e.y;
                } else {
                    total += e.y;
                }
                e.slice(!e.sliced);
                updtCenterTxt(piechart,total)
            });
        });

    }


    /* - Stacked Bar charts specifics - */
    function setStackedMaxWdth(chart,container) {
        var wdth = $('#'+container).innerWidth(),
            hght = $('#'+container).innerHeight()- 30;
        chart.setSize (wdth, hght);
    }


    return {

        setCharts: function(datas) {
            for (var i=0;i<datas.length;i++) {
                var targ = 'chart'+(i+1);
                if (datas[i].type != "table") loadChart(targ, datas[i]);
            }
        },

        destroyCharts: function() {
            if (chartsInstances.length>0) removeCharts();
        },

    }
});
