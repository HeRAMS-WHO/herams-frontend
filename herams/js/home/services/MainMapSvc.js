'use strict';

/**
 * @ngdoc service
 * @name app-herams.service:MainMapSvc
 * @description
 *   This service provides a set of methods to handle leaflet on the main page
 */
angular.module('app-herams').service('MainMapSvc', function($rootScope,$state,$timeout,$window,$compile,$log,commonSvc,esriSvc,LayerPopupSvc) {

    function disableZooming(pMap) {
        pMap.touchZoom.disable();
        pMap.doubleClickZoom.disable();
        pMap.scrollWheelZoom.disable();
        pMap.boxZoom.disable();
    }

/*
    function showScaling(pMap) {
        var saleIndic = L.control.scale().addTo(pMap);
    }
*/
    return {

        /**
         * @name MainMapSvc.createMainMap
         * @description
         *   returns a leaflet map object after creation according to params
         */
        createMainMap: function (container,config) {

            /* - Setting Map Bounds - */
            var minNorth = L.latLng(87.8750,  -30.535486),
            maxSouth = L.latLng(-71.1879, 160.769861),
            bounds = L.latLngBounds(minNorth, maxSouth);


            /* Creating map */
            var map = L.map(container,
                {
                    maxBounds: bounds,
                    minZoom: config.zoom_options.minZoom,
                    maxZoom: config.zoom_options.maxZoom,
                    zoomDelta: config.zoom_options.zoomDelta,
                    center: [40.056073, 78.883203],
                    zoom: 3
                });

            map.fitBounds(bounds);
                // .setView([22.3964, 114.1095], 3);
                /*
                .setView(
                    [config.center.lat, config.center.long],
                    config.zoom_options.zoom
                );
                */

            map.zoomControl.setPosition('bottomright');

            /!* No Zooming *!/
            // disableZooming(map);


            /* Adding required basemaps - imagery, countrynames, etc.. */
            for (var i in config.basemaps) {
                var tmp = L.tileLayer(config.basemaps[i]).addTo(map);
            }

            return map;

        },


        /**
        * @name MainMapSvc.addLayersToMainMap
        * @description
        *  adds ESRI layers to a leaflet map using the esriSvc
        *  with custom popup using the LayerPopupSvc
         *  @Params:
         *  - map: reference to the leaflet Map instance
         *  - layers: array of layers as configured in 'home_data.json'
         *  - statuses: array of possible statuses for each layer as configured in 'home_data.json'
        */

        addLayersToMainMap: function (map, layers, statuses) {
            for (var i in layers) {
                var status = statuses[layers[i].status];
                esriSvc.getEsriShape(map, layers[i], status.color);
            }
        },


        /**
        * @name MainMapSvc.addcircleMarkerToMainMap
        * @description
        *  adds circle Markers to Map
        *  with custom popup using the LayerPopupSvc
         *  @Params:
         *  - map: reference to the leaflet Map instance
         *  - layers: array of layers as configured in 'home_data.json'
         *  - statuses: array of possible statuses for each layer as configured in 'home_data.json'
        */

        addcircleMarkerToMainMap: function(map, layers, statuses) {
            for (var i in layers) {

                /* - MARKERS INIT - */
                var status = statuses[layers[i].status];
                var latlng = L.latLng(layers[i].geodata.lat, layers[i].geodata.long);
                var marker = L.circleMarker(latlng, {
                            radius:CONFIG.home.centroidRadius,
                            fillColor : status.color,
                            color: layers[i].available? "white" : status.color,
                            weight: layers[i].available? 3 : 0,
                            opacity: 1,
                            fillOpacity: CONFIG.home.layersOpacity,
                            className: layers[i].stats? '' : 'disable-cursor'
                        }).addTo(map);

                /* - MARKERS HOVERS - */
                if (layers[i].available) {
                    marker.on('mouseover', function (evt) {
                        evt.target.setStyle({
                            radius: CONFIG.home.centroidRadius + 3,
                            fillOpacity: 1
                        });
                    });
                    marker.on('mouseout', function (evt) {
                        evt.target.setStyle({
                            radius: CONFIG.home.centroidRadius,
                            fillOpacity: CONFIG.home.layersOpacity
                        });
                    });
                }

                /* - MARKERS POPUPS - */
                if (layers[i].stats != null) {
                   LayerPopupSvc.addPopup(map,marker,layers[i]);
                }
            }
        }
    }
});
