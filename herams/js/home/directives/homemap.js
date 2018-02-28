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

                /* create Map */
                var mainMap = MainMapSvc.createMainMap('mapid');

                /* adding Nigeria */
                var layers = $scope.mapdata.layers;
                for (var i in layers) {
                    MainMapSvc.addLayerToMainMap(
                        mainMap,
                        layers[i].geodata.layer_url,
                        layers[i].geodata.lat,
                        layers[i].geodata.long,
                        i
                    );
                }

            })


        }
    }

});

