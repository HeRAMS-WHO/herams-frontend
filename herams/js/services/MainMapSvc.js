'use strict';

/**
 * @ngdoc service
 * @name app-herams.service:MainMapSvc
 * @description
 *   This service provides a set of methods to handle leaflet on the main page
 */
angular.module('app-herams').service('MainMapSvc', function($rootScope,$timeout,$compile,$log) {

    var cnt = 0;

    return {

        /**
        * @name MainMapSvc.createMainMap
        * @description
        *   returns a leaflet map object after creation according to params
        */
        createMainMap: function(container,lat,long,basemap) {

            var map = L.map(container).setView([lat, long], 4);
            var Esri_WorldGrayCanvas = L.tileLayer(basemap).addTo(map);

            return map;

        },

        /**
        * @name MainMapSvc.addLayerToMainMap
        * @description
        *   adds layers to a leaflet map, with custom popup on click
        */
        addLayerToMainMap: function(map,geosrc,lat,long) {

            var geodata = $.ajax({
              url: geosrc,
              dataType: "json",
              success: console.log("Geodata successfully loaded."),
              error: function (xhr) {
                alert(xhr.statusText)
              }
            });

            $.when(geodata).done(function() {
                var geojson = L.geoJSON(geodata.responseJSON).addTo(map);
                cnt++;

                geojson.on('click', function(e) {

                    if ($('.entry-popup.layer'+cnt).length<=0) {

                         var popup = L.popup({className:'entry-popup layer'+cnt,closeButton:false})
                            .setLatLng([lat, long])
                            .setContent('<entry-popup></entry-popup>')
                            .openOn(map);

                        $timeout(function(){
                            $compile(popup._contentNode)($rootScope);
                        });
                    } else {
                        e.stopPropagation();
                    }

                });

            });

        }
    }
});
