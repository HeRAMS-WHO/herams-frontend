'use strict';

/**
 * @ngdoc directive
 * @name app-herams.directive:entryPopup
 * @restrict E
 * @scope
 *   @param {type} description
 * @description
 *   Lorem ipsum
 * @example
 *   <entry-popup />
 */
angular.module('app-herams').directive('entryPopup', function($log,commonSvc) {

    function getLayerDataFromName(allLayers,countryname) {
        for (var i in allLayers) {
          if (allLayers[i].name == countryname) return allLayers[i];
        }
    }

    function getLegendTmplt(legend,color) {
        return (legend.indexOf('N/A')==-1)?
            "<div><i class='fas fa-circle' style='color:"+color+"'></i>"+ legend +"</div>" : "<div style='text-align:center;width:72px;'>"+ legend +"</div>";
    }

    function generateLegend(legends) {
        var legends_html = "";
        for (var i in legends) {
            legends_html += getLegendTmplt(legends[i].label,legends[i].color);
        }
        return legends_html;
    }

    function dfltPieHome(data) {

        var dflt = commonSvc.deepCopy(CONFIG.charts.pie);
        dflt.chart.margin = [0, 0, 0, 0];
        dflt.series[0].data = data;

        return dflt;
    }

    function customPieHome(data) {

        var c = dfltPieHome(data);

        c.chart.backgroundColor = '#42424b';
        c.chart.height = 102;
        c.chart.width = 102;

        return c;

    }

    function setAfterAnimate(piechart,f) {
        piechart.plotOptions.pie.events = {};
        piechart.plotOptions.pie.events.afterAnimate = f();
    }

    return {
        templateUrl: '/js/home/directives/entry-popups.html',
        restrict: 'E',
        replace: true,
        scope: {
            countryname:"@"
        },
        controller: function($scope) {},
        link: function($scope) {

            var HOMEDATA = $scope.$parent.homedata;
            var layerData = getLayerDataFromName(HOMEDATA.layers,$scope.countryname);

            $scope.data = layerData.stats;

            var pie1 = customPieHome(layerData.stats.charts[0].data),
                pie2 = customPieHome(layerData.stats.charts[1].data),
                pie3 = customPieHome(layerData.stats.charts[2].data);


            setAfterAnimate(pie1,function() {
                $('charts-percents:nth-child(1)').css('display','block');
            })


            $('#indic1-chart').highcharts(pie1);
            $('#indic2-chart').highcharts(pie2);
            $('#indic3-chart').highcharts(pie3);

            $('#chart1-legend').html(generateLegend(layerData.stats.charts[0].legend));
            $('#chart2-legend').html(generateLegend(layerData.stats.charts[1].legend));
            $('#chart3-legend').html(generateLegend(layerData.stats.charts[2].legend));

            /* opacity on Service Availability's icon set down if no data */
            var serv_avail_Lgd = layerData.stats.charts[2].legend[0].label;
            if (serv_avail_Lgd.indexOf('N/A')!=-1) $('.charts-icons>div:nth-child(3)').css('opacity', 0.3);

        }
    }

});
