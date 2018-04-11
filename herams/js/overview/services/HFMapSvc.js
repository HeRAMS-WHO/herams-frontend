'use strict';

/**
 * @ngdoc service
 * @name app-herams.service:MainMapSvc
 * @description
 *   This service provides a set of methods to handle leaflet on the main page
 */
angular.module('app-herams').service('HFMapSvc', function($rootScope,$state,$timeout,$window,$compile,$log,esriSvc) {

    var map;

    return {

        /**
        * @name HFMapSvc.createMap
        * @description
        *   returns a leaflet map object after creation according to params
        */
        createMap: function(container,mapdata) {

            /* - creating map instance - */
            var map = L.map(container, {
                zoomControl:false,
                center: [mapdata.lat, mapdata.long],
                zoom: mapdata.zoom
            });

            /* - adding basemaps - */
            for (var i in mapdata.basemaps) {
               var tmp = L.tileLayer(mapdata.basemaps[i]).addTo(map);
            }

            /* - adding ESRI layer - */
            esriSvc.getEsriShape(map, mapdata.layers[0]);

            /* - responsiveness - */
            $(window).on('orientationchange pageshow resize', function () {
                var hght = $('.map-container').innerHeight();

                $("#mapid").height(hght);
                map.invalidateSize();
                map.setView([mapdata.lat, mapdata.long]);
            }).trigger('resize');

        }
    }
});
