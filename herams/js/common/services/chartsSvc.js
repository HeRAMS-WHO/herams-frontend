'use strict';

/**
 * @ngdoc service
 * @name app-herams.service:chartsSvc
 * @description
 *   This service provides a set of methods to handle charts in the workspace pages
 */
angular.module('app-herams').service('chartsSvc', function($log,commonSvc) {

    var chartsInstances = [];

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

    function setSackedMaxWdth(chart,container) {
        var wdth = $('#'+container).innerWidth(),
            hght = $('#'+container).innerHeight()- 30;
        chart.setSize (wdth, hght);
    }

    function setChart(container,distData) {

         if (distData.type == "stacked" || distData.type == "bar") {

             var chart_common_config = commonSvc.deepCopy(CONFIG.charts.common);
             var chart = $.extend(commonSvc.deepCopy(chart_common_config), CONFIG.charts.stacked);

             // var titleFrmtd = (distData.total != undefined)? distData.title + ' <span class="chart-title-total">(distData.total)</span>' : distData.title;
             var titleFrmtd = (distData.total != undefined)? distData.title + ' <span class="chart-title-total">('+ distData.total + ')</span>' : distData.title + ' <span class="chart-title-total">(<i style="color:#ff0000;"> !missing </i>)</span>';

             chart.title.useHTML = true;
             chart.title.text = titleFrmtd;
             chart.xAxis.categories = distData.labels;
             chart.series = distData.series;

             if (distData.type == "stacked") chart.colors = distData.colors;

         } else {

            var chart = commonSvc.deepCopy(CONFIG.charts.pie);

            chart.title.text = distData.title;
            chart.tooltip = CONFIG.charts.tooltip_pie;
            chart.series[0].data = distData.data;

         }

         chart.chart.renderTo = container;
         chart.legend = CONFIG.charts.legend_cust;

         return chart;
    }

    function loadChart (chart_dist_data,chart_html_container) {

        // $log.info('loadChart :: chart_dist_data = ',chart_dist_data);

        var chart = new Highcharts.Chart(setChart(chart_html_container,chart_dist_data),function(chart){

            if (chart_dist_data.type == "pie") {

                var displayTot = chart_dist_data.total;
                insertCenterTxt(chart,chart_dist_data.total);

                $(chart.series[0].data).each(function(i, e) {

                    e.legendItem.on('click', function() {
                        if (!e.sliced) {
                            displayTot -= e.y;
                        } else {
                            displayTot += e.y;
                        }
                        e.slice(!e.sliced);
                        updtCenterTxt(chart,displayTot)
                    });
                });
            } else if (chart_dist_data.type == "stacked") {
                setSackedMaxWdth(chart,chart_html_container);
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


    return {
        setCHarts: function(datas) {
            for (var i=0;i<datas.length;i++) {
                var targ = 'chart'+(i+1);
                if (datas[i].type != "table") loadChart(datas[i],targ);
            }
        },

        destroyCharts: function() {
            if (chartsInstances.length>0) removeCharts();
        },

        getPie: function(data) {
            var custChart = commonSvc.deepCopy(CONFIG.charts.pie);
            custChart.chart.margin = [0, 0, 0, 0];
            custChart.series[0].data = data;

            return custChart;
        },

        setAfterAnimateHome: function(piechart,f) {
            piechart.plotOptions.pie.events = {};
            piechart.plotOptions.pie.events.afterAnimate = f();
        }

    }
});
