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

    var mainMap;

    /* Cross Browser window's size */
    function getWindowWdth() {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0];

        return  w.innerWidth || e.clientWidth || g.clientWidth;
        // * if height needed : * y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    }

    function resizer () {
        // $log.info('resizer HOME');
    }

    return {
        templateUrl: '/js/home/directives/home-map.html',
        restrict: 'E',
        replace: true,
        scope: {
            mapdata:"="
        },
        controller: function($scope) {},
        link: function($scope, $el, $attr) {

            $scope.$watch('mapdata', function(homeData) {

                if (homeData.config) {

                     /* create Map */
                    mainMap = MainMapSvc.createMainMap('mapid',homeData.config);

                    /* redraw map on changes */
                    $scope.$on('collapse-click',resizer);
                    $(window).resize(resizer);

                    /* adding HeRams */
                    var statuses = homeData.config.statuses,
                        layers = homeData.layers;

                    // MainMapSvc.addLayersToMainMap(mainMap,layers,statuses);
                    MainMapSvc.addcircleMarkerToMainMap(mainMap,layers,statuses);

                }

            })

        }
    }

});

