'use strict';

/**
 * @ngdoc service
 * @name app-herams.service:MainMapSvc
 * @description
 *   This service provides a set of methods to handle leaflet on the main page
 */
angular.module('app-herams').service('MainMapSvc', function($rootScope,$state,$timeout,$compile,$log,commonSvc) {

    var cnt = 0;

    /* - CONFIG - */
    var country_shape_stroke        = CONFIG.home.colors.layer_stroke_color,
        country_shape_fill          = CONFIG.home.colors.layer_fill_color,
        country_shape_stroke_over   = country_shape_fill,
        country_shape_fill_over     = country_shape_stroke;

    var styleNormal = {
            color       : country_shape_stroke,
            weight      : 1,
            fillOpacity : 0.6,
            fillColor   : country_shape_fill
        },
        styleOver = {
            color       : country_shape_stroke_over,
            fillOpacity : 1,
            fillColor   : country_shape_fill_over
        };

    function getPopupData(country_num) {
        return 'homedata.layers['+country_num+'].stats';
    }

    function handleLayerSuccess() {
        console.log("Geodata successfully loaded.");
    }

    function handleLayerError(xhr) {
        console.log("An error occurred.");
    }


    return {

        /**
        * @name MainMapSvc.createMainMap
        * @description
        *   returns a leaflet map object after creation according to params
        */
        createMainMap: function(container) {

            var map = L.map(container, { zoomControl:false }).setView([CONFIG.home.lat, CONFIG.home.long], 4);

            for (var i in CONFIG.home.basemaps) {
               var tmp = L.tileLayer(CONFIG.home.basemaps[i]).addTo(map);
            }

            return map;

        },

        /**
        * @name MainMapSvc.addLayerToMainMap
        * @description
        *   adds layers to a leaflet map, with custom popup on click
        */
        addLayerToMainMap: function(map,geosrc,lat,long,layerNum) {

            var geodata = $.ajax({
              url       : geosrc,
              dataType  : "json",
              success   : handleLayerSuccess(),
              error     : function(xhr) {
                  handleLayerError(xhr);
                }
            });

            $.when(geodata).done(function() {

                var geojson = L.geoJSON(geodata.responseJSON, {
                    style: styleNormal
                }).addTo(map);

                cnt++;

                geojson.on('mouseover', function(e) {

                    if ($('.entry-popup.layer'+cnt).length<=0) {

                        this.setStyle(styleOver);

                        var popup_content = '<entry-popup data="'+getPopupData(layerNum)+'"></entry-popup>';

                        var popup = L.popup({className:'entry-popup layer'+cnt,closeButton:false})
                            .setLatLng([lat, long])
                            .setContent(popup_content)
                            .openOn(map);

                        $timeout(function(){
                            var scope = angular.element('.home').scope();
                            $compile(popup._contentNode)(scope);
                        });
                    }

                });

                geojson.on('mouseout', function(e) {

                    if ($('.entry-popup.layer'+cnt).length>0) {
                        this.setStyle(styleNormal);
                        $('.entry-popup.layer'+cnt).remove();
                    }
                });

                geojson.on('click', function(e) {
                    $log.info('Let s go to next screen!!');
                    commonSvc.overview();
                });

            });

        }
    }
});
