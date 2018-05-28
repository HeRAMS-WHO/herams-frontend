'use strict';

/**
 * @ngdoc service
 * @name app-herams.service:esritogeojsonSvc
 * @description
 *   This service provides a set of methods to imporr ESRI data into Leaflet
 */
angular.module('app-herams').service('esriSvc', function($timeout,$log, $http, LayerPopupSvc) {

    var refMap;

    /**
    * @name getEsriURL
    * @description
    *  returns the ESRI url from a countryname
     *  url is formed according to the config given in 'config.js'
     *  @Params:
     *  - countryname: ESRI country name
    */
    function getEsriURL(countryname){
        return CONFIG.esriHTTP.start + countryname + CONFIG.esriHTTP.end;
    }

    /**
    * @name importEsri
    * @description HTTP get
    *  getting the specified ESRI json from distant URL
     *  @Params:
     *  - layerData: reference to the leaflet Map instance
     *  - pColor: color associated to the specific layer (in this case, from its configured status in 'home_data.json')
    */
    function importEsri(layerData,pColor) {
        var urlEsri = getEsriURL(layerData.name);
/*
        $.getJSON( urlEsri, function(data) {
            convertToGeoJSON (data.features,layerData,pColor);
        });
*/

        $http({
                'method': 'GET',
                'url': urlEsri,
                'headers': {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            }).then(function success(data) {
                // $log.info('esri import ok', data);
                convertToGeoJSON (data.data.features,layerData,pColor);
            });
    }

    /**
    * @name convertToGeoJSON
    * @description
     * - Converts ESRI data to GeoJSON for use in Leaflet using ArcgisToGeojsonUtils
     * - Calls creation of the Leaflet layer
     *  @Params:
     *  - layerData: reference to the leaflet Map instance
     *  - pColor: color associated to the specific layer (in this case, from its configured status in 'home_data.json')
    */
    function convertToGeoJSON (esriFeatures,layerData,pColor){

        var geoJSON = { "type": "FeatureCollection" };

        var features = esriFeatures.map(function(feature) {
            return ArcgisToGeojsonUtils.arcgisToGeoJSON(feature);
        });

        geoJSON.features = features;
        addGeojsonLayer(geoJSON,layerData,pColor);

    }

    /**
    * @name addGeojsonLayer
    * @description
     * - Creates a layer on the map (layer can contain multiple features)
     * - implements a popup if layer contains 'stats' data using 'LayerPopupSvc'
     *  @Params:
     *  - layerData: reference to the leaflet Map instance
     *  - pColor: color associated to the specific layer (in this case, from its configured status in 'home_data.json')
    */
    function addGeojsonLayer (geoJSON,layerData,pColor){

        var strokeCol   = (pColor)? pColor : CONFIG.home.dfltColors.layer_stroke_color,
            fillCol     = (pColor)? pColor : CONFIG.home.dfltColors.layer_fill_color;

        var geojson = L.geoJSON(geoJSON, {
                    style: {
                        color       : strokeCol,
                        weight      : CONFIG.home.dfltColors.layer_stroke_weight,
                        fillOpacity : CONFIG.home.layersOpacity,
                        fillColor   : fillCol
                    }
                }).addTo(refMap);

        if (layerData.stats != null) {
           LayerPopupSvc.addPopup(refMap,geojson,layerData);
        }

    }

    return {

        /**
        * @name esriSvc.getEsriShape
        * @description using the esriSvc
        *  with custom popup using the LayerPopupSvc
         *  @Params:
         *  - map: reference to the leaflet Map instance
         *  - layerData: specific layer data in 'home_data.json'
         *  - pColor is optional
        */
        getEsriShape: function(map, layerData, pColor) {
            refMap = map;
            importEsri(layerData, pColor);
        }
    }
});
