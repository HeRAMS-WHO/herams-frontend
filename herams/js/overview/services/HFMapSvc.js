'use strict';

/**
 * @ngdoc service
 * @name app-herams.service:MainMapSvc
 * @description
 *   This service provides a set of methods to handle leaflet on the main page
 */
angular.module('app-herams').service('HFMapSvc', function($rootScope,$state,$timeout,$window,$compile,$log,esriSvc,commonSvc) {

    var map,mapSpecs;

    function displayData(map,serverData) {

        var listHF = serverData.hf_list,
            colorsSpecs = serverData.config.colors;

        for (var i in listHF) {
            var myIcon = L.divIcon({
                className: 'herams-marker-icon',
                html:'<i class="fas fa-circle" style="color:'+ colorsSpecs[listHF[i].type] +'"></i>'
            });
             L.marker(listHF[i].coord, {icon: myIcon}).addTo(map);
        }

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
            map = L.map(container, {
                zoomControl:false,
                center: [mapSpecs.lat, mapSpecs.long],
                zoom: mapSpecs.zoom
            });

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
            if (map) map.setView([mapSpecs.lat, mapSpecs.long]);
        }
    }
});
