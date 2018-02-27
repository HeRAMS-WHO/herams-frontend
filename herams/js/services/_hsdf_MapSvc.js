'use strict';

/**
 * @ngdoc service
 * @name phc_dashboard.service:MapSvc
 * @description
 *   This service provides methods related to the map.
 */
angular.module('app-herams').service('MapSvc', function(APIServices) {
    return {
        createMap: function(element, withOSM, blocked) {
            var map = L.map(element, {
                center: [9, 8],
                zoom: 5,
                minZoom: 5,
                maxZoom: 18,
                zoomControl: false,
                attributionControl: false
            });


            map.createPane('admin0');
            map.getPane('admin0').style.zIndex = 201;
            map.createPane('admin1');
            map.getPane('admin1').style.zIndex = 210;
            map.createPane('admin2');
            map.getPane('admin2').style.zIndex = 220;
            map.createPane('admin3');
            map.getPane('admin3').style.zIndex = 230;

            if (withOSM) {
                var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 18
                }).addTo(map);
            }

            if (blocked) {
                map.dragging.disable();
                map.touchZoom.disable();
                map.doubleClickZoom.disable();
                map.scrollWheelZoom.disable();
                map.boxZoom.disable();
            }

            return map;
        },

        layersFromAdminParent: function(adminId, map, mpane, style, callback) {
            var self = this;
            APIServices.getAdminsLayersFromParentId(adminId).then(function(data) {
                var layers = self.createGeoJSON(data, style, { pane: mpane ? mpane : 'tilePane', bindTooltip: 'geog_name' });
                if (map) {
                    map.addLayer(layers);
                }
                if (callback) {
                    callback(data);
                }
            });
        },

        layerFromAdmin: function(adminId, map, mpane, style, callback) {
            var self = this;
            APIServices.getAdminLayerFromId(adminId).then(function(data) {
                var layers = self.createGeoJSON(data, style, { pane: mpane ? mpane : 'tilePane', bindTooltip: 'geog_name' });
                if (map) {
                    map.addLayer(layers);
                }
                if (callback) {
                    callback(data);
                }
            });
        },

        centerOnFeatures: function(map, features) {
            var latlngs = [];
            for (var f in features) {
                for (var i in features[f].geometry.coordinates) {
                    var coord = features[f].geometry.coordinates[i];
                    for (var j in coord) {
                        var points = coord[j];
                        for (var k in points) {
                            latlngs.push(L.GeoJSON.coordsToLatLng(points[k]));
                        }
                    }
                }
            }
            if (latlngs.length > 0) {
                map.fitBounds(latlngs);
            }
        },

        centerOnFeaturesWithMarker: function(map, features, marker) {
            var latlngs = [];
            for (var f in features) {
                for (var i in features[f].geometry.coordinates) {
                    var coord = features[f].geometry.coordinates[i];
                    for (var j in coord) {
                        var points = coord[j];
                        for (var k in points) {
                            latlngs.push(L.GeoJSON.coordsToLatLng(points[k]));
                        }
                    }
                }
            }
            if (latlngs.length > 0) {
                latlngs.push(marker);
                map.fitBounds(latlngs);
            }
        },

        createGeoJSON: function(data, style, options) {
            return L.geoJson(data, {
                pane: options.pane || 'overlay',
                style: function(feature) {
                    return style;
                },
                onEachFeature: function(feature, layer) {
                    if (options.bindTooltip) {
                        var selectedElement = layer.feature.properties;
                        layer.bindTooltip(selectedElement[options.bindTooltip], { sticky: true, direction: 'top' });
                    }
                }
            });
        }
    }
});
