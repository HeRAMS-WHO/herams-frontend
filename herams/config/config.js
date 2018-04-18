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
            zoom: 6.4,
            lat : 9.0820,
            long: 8.6753,
            basemaps: [
              "https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            ],
            layers: [
              {
                name: "Nigeria"
              }
            ]
        },
        charts: {
            common: {
              title: {
                align: "left"
              },
              exporting: {
                enabled: false
              },
              yAxis: [
                {
                  labels: {
                    enabled: false
                  },
                  title: {
                    enabled: false
                  }
                }
              ]
            },
            bar: {
              chart: {
                type: "bar",
                spacing: [
                  0,
                  0,
                  0,
                  0
                ],
                marginRight: 25,
                marginLeft: 130,
                marginBottom: 50,
                backgroundColor: "rgba(255, 255, 255, 0.0)",
                style: {
                  fontFamily: "'Source Sans Pro',sans-serif"
                }
              },
              legend: {
                enabled: false
              },
            tooltip: {
                backgroundColor: 'rgba(66,66,74,1)',
                borderWidth: 0,
                shadow: false,
                style: {
                    color: '#ffffff'
                },
                formatter: function () {
                    return '<b>' + this.point.y + '</b>';
                },
                positioner: function(labelWidth, labelHeight, point) {
                    var tooltipX = point.plotX + 100;
                    var tooltipY = point.plotY-3;
                    return {
                        x: tooltipX,
                        y: tooltipY
                    };
                }
            },
              xAxis: {
                categories: ["placeholder 1","placeholder 2","placeholder 3","placeholder 4"],
                labels: {
                  style: {
                    width: "100px",
                    fontSize: "14px"
                  }
                }
              },
              plotOptions: {
                bar: {
                  pointWidth: 10,
                  align: "left",
                  dataLabels: {
                    enabled: true,
                    formatter: function () {
                        return '<b>' + this.point.custom + '</b>';
                    },
                    style: {
                      fontSize: "12px",
                      fontWeight: "bold"
                    }
                  }
                }
              },
              series: [
                {
                  data: [
                    {
                      y: 30,
                      custom: 342,
                      color: "#dc4a8b"
                    },
                    {
                      y: 4,
                      custom: 167,
                      color: "#599d22"
                    },
                    {
                      y: 20,
                      custom: 210,
                      color: "#52addc"
                    },
                    {
                      y: 10,
                      custom: 62,
                      color: "#006958"
                    }
                  ]
                }
              ]

            },
            stacked: {
              chart: {
                type: "bar",
                marginLeft: 0,
                marginRight: 0,
                spacing: [
                  0,
                  0,
                  0,
                  0
                ],
                backgroundColor: "rgba(255, 255, 255, 0.0)",
                style: {
                  fontFamily: "'Source Sans Pro',sans-serif"
                }
              },
                tooltip: {
                    backgroundColor: 'rgba(66,66,74,1)',
                    borderWidth: 0,
                    shadow: false,
                    style: {
                        color: '#ffffff'
                    },
                    formatter: function () {
                        return '<b>' + this.y + '</b>';
                    },
                    positioner: function(labelWidth, labelHeight, point) {
                        var tooltipX = point.plotX-labelWidth;
                        var tooltipY = point.plotY-3;
                        return {
                            x: tooltipX,
                            y: tooltipY
                        };
                    }
                },
              yAxis: [
                {
                  labels: {
                    enabled: false
                  },
                  title: {
                    enabled: false
                  }
                }
              ],
              legend: {
                align: "left",
                enabled: true,
                symbolRadius: 0,
                symbolWidth: 8,
                symbolHeight: 8,
                marginLeft: 0,
                spacing: [
                  0,
                  0,
                  0,
                  0
                ]
              },
              xAxis: {
                categories: ["placeholder 1","placeholder 2","placeholder 3"],
                labels: {
                  x: 0,
                  y: -10,
                  align: "left",
                  style: {
                      width:"200px",
                    fontSize: "14px"
                  }
                }
              },
              plotOptions: {
                series: {
                  stacking: "normal",
                  pointWidth: 10
                }
              },
              series: [
                {
                  name: "#1 (test)",
                  data: [
                    50,
                    10,
                    5
                  ]
                },
                {
                  name: "#2 (test)",
                  data: [
                    25,
                    20,
                    30
                  ]
                },
                {
                  name: "#3 (test)",
                  data: [
                    25,
                    70,
                    65
                  ]
                }
              ]
            }
        }
    }
};
