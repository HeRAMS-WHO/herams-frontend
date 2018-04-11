'use strict';

/**
 * @ngdoc service
 * @name app-herams.service:MainMapSvc
 * @description
 *   This service provides a set of methods to handle leaflet on the main page
 */
angular.module('app-herams').service('HFMapSvc', function($rootScope,$state,$timeout,$window,$compile,$log,esriSvc,commonSvc) {

    var map;

    function displayData() {
        return commonSvc.loadData('config/overview_map_sample.json').then(loadSuccess)
                    .catch(loadFailure)
                    .then(loadFinally);

        function loadSuccess(httpResponse) {

            var rslts = httpResponse.data.results;

            $log.info('loaded Overview Map Data correctly: ',rslts);
        }

        function loadFailure(httpResponse) {
            $log.info('There has been an error Overview Map Data');
        }

        function loadFinally(httpResponse) {
            $log.info('Overview Map - last but not least');
        }
    }

    /*
    $scope.init = function() {

        return commonSvc.loadData('config/home_data.json').then(loadSuccess)
                    .catch(loadFailure)
                    .then(loadFinally);

        function loadSuccess(httpResponse) {

            $scope.homedata = httpResponse.data.results;
            setCollapse();

            $log.info('loaded Home Data correctly: ',httpResponse);
        }

        function loadFailure(httpResponse) {
            $log.info('There has been an error Home Data');
        }

        function loadFinally(httpResponse) {
            $log.info('Home - last but not least');
        }

    }

     */

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


            displayData();

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
