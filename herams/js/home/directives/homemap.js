/*
"use strict";
angular.module('app-herams').controller('MapCtrl', function(MainMapSvc,$log) {

    var Esri_WorldGrayCanvas = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
    var mainMap = MainMapSvc.createMainMap('mapid',34.553,18.048,Esri_WorldGrayCanvas);

    MainMapSvc.addLayerToMainMap(mainMap,'config/geojson_Admin0.json',9.0820,8.6753);

});
*/

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
                var mainMap = MainMapSvc.createMainMap('mapid',$scope.mapdata.map_lat,$scope.mapdata.map_long,$scope.mapdata.map_baselayer);

                /* adding Nigeria */
                var countries = $scope.mapdata.countries;
                for (var i in countries) {
                    MainMapSvc.addLayerToMainMap(
                        mainMap,
                        countries[i].geodata.layer_url,
                        countries[i].geodata.lat,
                        countries[i].geodata.long,
                        i
                    );
                }

            })


        }
    }

});

