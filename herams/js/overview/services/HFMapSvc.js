'use strict';

/**
 * @ngdoc service
 * @name app-herams.service:HFMapSvc
 * @description
 *   This service provides a set of methods to create a Map on the workspace page
 */
angular.module('app-herams').service('HFMapSvc', function($rootScope,$state,$timeout,$window,$compile,$log,esriSvc,commonSvc) {

    var map,mapSpecs,dynBounds;

    function displayData(map,serverData) {

        var listHF = serverData.hf_list,
            colorsSpecs = serverData.config.colors,
            latlongList = [];

        for (var i in listHF) {
            var myIcon = L.divIcon({
                className: 'herams-marker-icon',
                html:'<i class="fas fa-circle" style="color:'+ colorsSpecs[listHF[i].type] +'"></i>'
            });
             L.marker(listHF[i].coord, {icon: myIcon}).addTo(map);
             latlongList.push(listHF[i].coord);
        }

        /* constraints to max 200 first coords working better fro Nigeria */
        var maxLatLongs = (latlongList.length <200)? latlongList.length : 200;

        dynBounds = new L.LatLngBounds(latlongList.slice(0,maxLatLongs));
        map.fitBounds(dynBounds);

    }


    return {

        /**
        * @name HFMapSvc.createMap
        * @description
        *   returns a leaflet map object after creation according to params
        */
        createMap: function(container,serverData) {

            mapSpecs = CONFIG.overview.map;

            /* - creating map instance - */
            map = L.map(container);
            map.zoomControl.setPosition('topright');

            /* - adding basemaps - */
            for (var i in mapSpecs.basemaps) {
               var tmp = L.tileLayer(mapSpecs.basemaps[i]).addTo(map);
            }

            /* - adding HF markers - */
            displayData(map,serverData);

            /* - adding ESRI layer - */
            esriSvc.getEsriShape(map, mapSpecs.layers[0]);

            /* - responsiveness - */
            this.refreshLayout();

        },

        refreshLayout: function() {

            var viewportHght = $(window).height()-280;
            viewportHght = (viewportHght>550)? viewportHght : 550;

            $('.main-content').height(viewportHght);
            $('.map-container').height(viewportHght);

            var hght = $('.map-container').innerHeight();

            $("#mapid").height(hght);
            if (map) map.invalidateSize();

            if (map) map.fitBounds(dynBounds);

        }
    }
});
