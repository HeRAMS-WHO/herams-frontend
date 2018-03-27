/* ------------------ GEOGRAPHIC CONFIGS ------------------ */

var CONFIG = {
    esriHTTP : {
        start: "https://extranet.who.int/maps/rest/services/WHE_BASEMAP/GLOBAL_ADM/MapServer/4/query?where=ADM0_NAME+IN+%28%27",
        end: "%27%29&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=ADM0_NAME%2C+ISO_2_CODE&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=json"
    },
    home: {
        layersOpacity: 0.7,
        dfltColors: {
          layer_stroke_color: "#5791e1",
          layer_fill_color: "#ffffff",
        },
        centroidRadius: 15
    }
};
