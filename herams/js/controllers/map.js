"use strict";

/**
 * @ngdoc controller
 * @name phc_dashboard.controller:MapCtrl
 * @description
 *   This controller is used on the map page
 */
angular.module('app-herams').controller('MapCtrl', function(MainMapSvc,$log) {

    /* create Map */
    var Esri_WorldGrayCanvas = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
    var mainMap = MainMapSvc.createMainMap('mapid',34.553,18.048,Esri_WorldGrayCanvas);

    /* adding Nigeria */
    MainMapSvc.addLayerToMainMap(mainMap,'config/geojson_Admin0.json',9.0820,8.6753);

});
