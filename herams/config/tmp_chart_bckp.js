var SAMPLECHART = {
    colors: ['#457ac0', '#2d559a', '#6aa5f3', '#b7cffb'], /*reverse order */
    stacked_chart: {
        chart: {
            type: 'bar',
            width: 300,
            height: 240,
            backgroundColor:'rgba(255, 255, 255, 0.0)' /* making background transparent */
        },
        title: {
            text: 'Title Placeholder',
            align: 'left'
        },
        legend: {
           enabled: false,
            style: {
               y: '25px'
            }
        },
        exporting: {
           enabled: false /* hiding context menu - print, export, etc */
        },
        xAxis: {
            categories: ['Data 1', 'Data 2', ' Data 3']
        },
        yAxis: {
            min: 0,
            labels:{
                enabled: false
            },
            title: {
                enabled: false
            }
        },
        plotOptions: {
            series: {
                stacking: 'normal',
                pointWidth: 10 /* fixing height for bars */
            }
        },
        series: [{
            name: '#1',
            data: [5, 3, 4]
        }, {
            name: '#2',
            data: [2, 2, 3]
        }, {
            name: '#3',
            data: [3, 4, 4]
        }]
    }
}
