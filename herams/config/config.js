/* ------------------ GEOGRAPHIC CONFIGS ------------------ */

var CONFIG = {
    esriHTTP : {
        start: "https://extranet.who.int/maps/rest/services/WHE_BASEMAP/GLOBAL_ADM/MapServer/4/query?where=ADM0_NAME+IN+%28%27",
        end: "%27%29&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=ADM0_NAME%2C+ISO_2_CODE&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=json"
    },
    home: {
        layersOpacity: 0.6,
        dfltColors: {
          layer_stroke_color: "#7b7b7b",
            layer_stroke_weight: 1.5,
          layer_fill_color: "#ffffff"
        },
        centroidRadius: 15
    },
    overview: {
        map: {
            "zoom": 6.4,
            "lat" : 9.0820,

            "long": 8.6753,
            "basemaps": [
              "https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            ],
            "layers": [
              {
                "name": "Nigeria"
              }
            ]
        }
    }
};
