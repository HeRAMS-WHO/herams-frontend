'use strict';

/**
 * @ngdoc service
 * @name app-herams.service:MainMapSvc
 * @description
 *   This service provides a set of methods to handle leaflet on the main page
 */
angular.module('app-herams').service('HFMapSvc', function($rootScope,$state,$timeout,$window,$compile,$log,esriSvc,commonSvc) {


    function displayData(map) {
        return commonSvc.loadData('config/overview_map_sample.json').then(loadSuccess)
                    .catch(loadFailure)
                    .then(loadFinally);

        function loadSuccess(httpResponse) {

            var rslts = httpResponse.data.results,
                typesSpecs = rslts.types;

            for (var i in rslts.data) {
                var myIcon = L.divIcon({
                    className: 'herams-marker-icon',
                    html:'<i class="fas fa-circle" style="color:'+ typesSpecs[rslts.data[i].type].color +'"></i>'
                });
                 L.marker(rslts.data[i].latlong, {icon: myIcon}).addTo(map);
            }

        }

        function loadFailure(httpResponse) {
            $log.info('There has been an error Overview Map Data');
        }

        function loadFinally(httpResponse) {
            $log.info('Overview Map - last but not least');
        }
    }


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


            displayData(map);

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
