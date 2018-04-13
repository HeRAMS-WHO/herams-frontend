var SAMPLECHART;
SAMPLECHART = {
    colors: ['#457ac0', '#2d559a', '#6aa5f3', '#b7cffb'], /*reverse order */
    stacked_chart: {
        chart: {
            type: 'bar',
            marginLeft: 0,
            marginRight: 0,
            spacing: [0, 0, 0, 0],
            backgroundColor: 'rgba(255, 255, 255, 0.0)', /* making background transparent */
            style: {
                fontFamily: '"Source Sans Pro",sans-serif'
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
        title: {
            align: 'left'
        },
        legend: {
            align: "left",
            enabled: true,
            symbolRadius: 0,
            symbolWidth: 8,
            symbolHeight: 8,
            marginLeft: 0,
            spacing: [0, 0, 0, 0]
        },
        xAxis: {
            categories: ['Theme #1', 'Theme #2', 'Theme #3', 'Theme #4', 'Theme #5'],
            labels: { // this is to place labels above bars only
                x: 0,
                y: -10,
                align: 'left',
                style: {
                    fontSize: "14px"
                }
            }
        },
        yAxis: {
            labels: {
                enabled: false
            },
            title: {
                enabled: false
            }
        },
        exporting: {
            enabled: false /* hiding context menu - print, export, etc */
        },
        plotOptions: {
            series: {
                stacking: 'normal',
                pointWidth: 10 /* fixing height for bars */
            }
        },
        series: [{  // if only one object: regular bar chart (not stacked)
            name: '#1 (test)',
            data: [50, 10, 5]
        }, {
            name: '#2 (test)',
            data: [25, 20, 30]
        }, {
            name: '#3 (test)',
            data: [25, 70, 65]
        }]
    },
    bar_chart: {
        chart: {
            type: 'bar',
            spacing: [0, 0, 0, 0],
            marginRight: 25,
            marginLeft: 130,
            marginBottom: 50,
            backgroundColor: 'rgba(255, 255, 255, 0.0)', /* making background transparent */
            style: {
                fontFamily: '"Source Sans Pro",sans-serif'
            }
        },
        title: {
            text: '-',
            align: 'left'
        },
        legend: {
            enabled: false,
        },
        tooltip: {
            backgroundColor: 'rgba(66,66,74,1)',
            borderWidth: 0,
            shadow: false,
            style: {
                color: '#ffffff'
            },
            formatter: function () {
                return '<b>' + this.point.custom + '</b>';
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
            categories: ['Health Post', 'Health Clinic', 'Primary Health Center', 'Primary Health Clinic'],
            labels: { // this is to place labels above bars only
                style: {
                    width: '100px',
                    fontSize: "14px"
                }
            }
        },
        yAxis: [{
            labels: {
                enabled: false
            },
            title: {
                enabled: false
            }
        }],
        exporting: {
            enabled: false /* hiding context menu - print, export, etc */
        },
        plotOptions: {
            bar: {
                pointWidth: 10, /* fixing height for bars */
                align: 'left',
                dataLabels: {
                    enabled: true,
                    style: {
                        fontSize: "12px",
                        fontWeight: "bold"
                    }
                }
            }
        },
        series: [{  // if only one object: regular bar chart (not stacked)
            data: [
                {y: 30, custom: 342, color: "#dc4a8b"},
                {y: 4, custom: 167, color: "#599d22"},
                {y: 20, custom: 210, color: "#52addc"},
                {y: 10, custom: 62, color: "#006958"}
            ]
        }]
    }


};
