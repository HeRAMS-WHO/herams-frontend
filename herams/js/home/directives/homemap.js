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

    /* Cross Browser window's size */
    function getWindowWdth() {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0];

        return  w.innerWidth || e.clientWidth || g.clientWidth;
        // * if height needed : * y = w.innerHeight|| e.clientHeight|| g.clientHeight;
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

            $timeout(function() {

                // $log.info('homemap.js > $scope.mapdata: ',$scope.mapdata);

                /* create Map */
                var mainMap = MainMapSvc.createMainMap('mapid',$scope.mapdata.config);

                $scope.$on('collapse-click',function(evt,args) {

                    var margin_expand = parseInt($(".map-entry").css('margin-left'));
                    var wdth = (!args.collapsed)? getWindowWdth()-margin_expand : getWindowWdth();

                     $log.info('homemap.js > wdth: ',wdth);

                    $("#mapid").width(wdth);
                    mainMap.invalidateSize();

                });

                /* adding HeRams */
                var statuses = $scope.mapdata.config.statuses,
                    layers = $scope.mapdata.layers;

                // MainMapSvc.addLayersToMainMap(mainMap,layers,statuses);
                MainMapSvc.addcircleMarkerToMainMap(mainMap,layers,statuses);

            })

        }
    }

});

