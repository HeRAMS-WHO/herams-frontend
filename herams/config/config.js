/* ------------------ GEOGRAPHIC CONFIGS ------------------ */

var CONFIG = {
    home: {
        basemaps: [
            "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            "https://server.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        ],
        lat : 34.553,
        long: 18.048,
        colors: {
            layer_stroke_color: "#5791e1",
            layer_fill_color: "#ffffff",
            donut_color1: "#0098fd",
            donut_color2: "#eb8600",
            donut_color3: "#fe0104"
        }
    }
};