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
angular.module('app-herams').directive('hfmap', function(HFMapSvc,$timeout,$log) {

    return {
        templateUrl: '/js/overview/directives/hf-map.html',
        restrict: 'E',
        replace: true,
        scope: {
            mapdata:"="
        },
        controller: function($scope) {},
        link: function($scope, $el, $attr) {

            $timeout(function() {

                /* create Map */
                HFMapSvc.createMap('mapid',$scope.mapdata);
            })
        }
    }

});

