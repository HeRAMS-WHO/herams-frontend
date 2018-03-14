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
angular.module('app-herams').directive('homemap', function(MainMapSvc,$timeout,$log) {

    return {
        templateUrl: '/js/home/directives/home-map.html',
        restrict: 'E',
        replace: true,
        scope: {
            mapdata:"="
        },
        controller: function($scope) {},
        link: function($scope, $el, $attr) {


            $timeout(function() {

                $log.info('homemap.js > $scope.mapdata: ',$scope.mapdata);

                /* create Map */
                var mainMap = MainMapSvc.createMainMap('mapid',$scope.mapdata.config);

                /* adding HeRams */
                var statuses = $scope.mapdata.config.statuses,
                    layers = $scope.mapdata.layers;
                MainMapSvc.addLayersToMainMap(mainMap,layers,statuses);

            })


        }
    }

});

