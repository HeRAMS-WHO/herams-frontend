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
angular.module('app-herams').directive('hfmap', function($log) {

    return {
        templateUrl: '/js/overview/directives/hf-map.html',
        restrict: 'E',
        replace: true,
        scope: true,
        link: function(scope) {
            scope.legend = [];
            scope.$watch('mapdata', function(new_val) {
                if (new_val.config) {
                    for (var i in new_val.config.legend) {
                         scope.legend.push(new_val.config.legend[i])
                    }
                }
            });

        }
    }

});

