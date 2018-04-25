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
angular.module('app-herams').directive('entryPopup', function($log,chartsSvc) {

    function getLayerDataFromName(allLayers,countryname) {
        for (var i in allLayers) {
          if (allLayers[i].name == countryname) return allLayers[i];
        }
    }

    function getLegendTmplt(legend,color) {
        return (legend.indexOf('N/A')==-1)? "<div><i class='fas fa-circle' style='color:"+color+"'></i>"+ legend +"</div>" : "<div style='text-align:center;width:72px;'>"+ legend +"</div>";
    }

    function generateLegend(legends) {
        var html = "";
        for (var i in legends) {
            html += getLegendTmplt(legends[i].label,legends[i].color);
        }
        return html;
    }

    function customPieHome(piechart) {

        var c = piechart;

        c.chart.backgroundColor = '#42424b';
        c.chart.height = 102;
        c.chart.width = 102;

        return c;

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

            var pie1 = customPieHome(chartsSvc.getPie(layerData.stats.charts[0].data)),
                pie2 = customPieHome(chartsSvc.getPie(layerData.stats.charts[1].data)),
                pie3 = customPieHome(chartsSvc.getPie(layerData.stats.charts[2].data));


            chartsSvc.setAfterAnimateHome(pie1,function() {
                $('charts-percents:nth-child(1)').css('display','block');
            })


            $('#indic1-chart').highcharts(pie1);
            $('#indic2-chart').highcharts(pie2);
            $('#indic3-chart').highcharts(pie3);

            $('#chart1-legend').html(generateLegend(layerData.stats.charts[0].legend));
            $('#chart2-legend').html(generateLegend(layerData.stats.charts[1].legend));
            $('#chart3-legend').html(generateLegend(layerData.stats.charts[2].legend));

        }
    }

});
