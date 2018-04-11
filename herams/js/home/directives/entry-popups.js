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
angular.module('app-herams').directive('entryPopup', function($log,ChartConfigSvc) {

    function getLayerDataFromName(allLayers,countryname) {
        for (var i in allLayers) {
          if (allLayers[i].name == countryname) return allLayers[i];
        }
    }

    function getLegendTmplt(legend,color) {
        return "<div><i class='fas fa-circle' style='color:"+color+"'></i>"+ legend +"</div>";
    }

    function generateLegend(legends) {
        var html = "";
        for (var i in legends) {
            html += getLegendTmplt(legends[i].label,legends[i].color);
        }
        return html;
    }

    return {
        templateUrl: '/js/home/directives/entry-popups.html',
        restrict: 'E',
        replace: true,
        scope: {
            countryname:"@"
        },
        controller: function($scope) {},
        link: function($scope, $el, $attr) {

            var HOMEDATA = $scope.$parent.homedata;
            var layerData = getLayerDataFromName(HOMEDATA.layers,$scope.countryname);

            $scope.data = layerData.stats;

            var pie1 = ChartConfigSvc.setTmpChartMultVal(layerData.stats.charts[0].data),
                pie2 = ChartConfigSvc.setTmpChartMultVal(layerData.stats.charts[1].data),
                pie3 = ChartConfigSvc.setTmpChartMultVal(layerData.stats.charts[2].data);


            /* - OVERRIDING WS ISSUES - */
            var tmp = [{y: 1, color: "#1c51a0", noTooltip: false},{y: 6, color: "#50afdf"},{y: 87, color: "#c6e2f1"},{y: 6, color: "#606060"}];
            pie3 = ChartConfigSvc.setTmpChartMultVal(tmp);
            $log.info('checking pie3 : ',tmp);

            ChartConfigSvc.setAfterAnimate(pie1,function() {
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
