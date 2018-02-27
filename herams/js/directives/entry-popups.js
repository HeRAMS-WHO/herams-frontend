'use strict';

/**
 * @ngdoc directive
 * @name phc_dashboard.directive:oneHf
 * @restrict E
 * @scope
 *   @param {Object} hf The Health Facility
 *   @param {Integer} admin3Id ID of the ward containing the HF
 * @description
 *   This directive calls the APIService to load data for the HF.
 *   Then delegates the display to the left & right blocs.
 * @example
 *   <one-hf hf="X" admin3-id="X" />
 */
angular.module('app-herams').directive('entryPopup', function($log,ChartConfigSvc) {

    var tmpPct1 = 56.6,
        tmpPct2 = 23.1,
        tmpPct3 = 20.3;

    return {
        templateUrl: '/js/directives/entry-popups.html',
        restrict: 'E',
        replace: true,
        scope: {},
        link: function($scope, $el, $attr) {

            $scope.percent1 = tmpPct1;
            $scope.percent2 = tmpPct2;
            $scope.percent3 = tmpPct3;

            var pie1 = ChartConfigSvc.setTmpChart(tmpPct1,'#0098fd'),
                 pie2 = ChartConfigSvc.setTmpChart(tmpPct2,'#eb8600'),
                 pie3 = ChartConfigSvc.setTmpChart(tmpPct3,'#fe0104');

            ChartConfigSvc.setAfterAnimate(pie1,function() {
                $('charts-percents:nth-child(1)').css('display','block');
            })


            $('#indic1-chart').highcharts(pie1);
            $('#indic2-chart').highcharts(pie2);
            $('#indic3-chart').highcharts(pie3);

        }
    }

});
