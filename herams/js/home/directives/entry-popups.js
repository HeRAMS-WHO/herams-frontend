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

    return {
        templateUrl: '/js/home/directives/entry-popups.html',
        restrict: 'E',
        replace: true,
        scope: {
            data:"="
        },
        controller: function($scope) {},
        link: function($scope, $el, $attr) {

            var pie1 = ChartConfigSvc.setTmpChart($scope.data.charts[0].percentage,CONFIG.home.colors.donut_color1),
                pie2 = ChartConfigSvc.setTmpChart($scope.data.charts[1].percentage,CONFIG.home.colors.donut_color2),
                pie3 = ChartConfigSvc.setTmpChart($scope.data.charts[2].percentage,CONFIG.home.colors.donut_color3);

            ChartConfigSvc.setAfterAnimate(pie1,function() {
                $('charts-percents:nth-child(1)').css('display','block');
            })


            $('#indic1-chart').highcharts(pie1);
            $('#indic2-chart').highcharts(pie2);
            $('#indic3-chart').highcharts(pie3);

        }
    }

});
