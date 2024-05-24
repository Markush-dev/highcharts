import { useMemo, useState } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import HistogramModule from 'highcharts/modules/histogram-bellcurve';
import data from '../assets/chart1.json';

HistogramModule(Highcharts);

function FirstChart() {
    const [filteredData, setFilteredData] = useState(data);

    const impliedSeries = useMemo(
        () => filteredData.iv.x.map((s, index) => ([new Date(s).getTime(), filteredData.iv.y[index]])),
        [filteredData.iv.y, filteredData.iv.x]
    );

    const realisedSeries = useMemo(
        () => filteredData.iv.x.map((s, index) => ([new Date(s).getTime(), filteredData.hist_volatility.y[index]])),
        [filteredData.iv.x, filteredData.hist_volatility.y]
    );

    const barSeries = useMemo(
        () => filteredData.iv.x.map((s, index) => ([new Date(s).getTime(), filteredData.iv_hist_vol_diff.y[index]])),
        [filteredData.iv.x, filteredData.iv_hist_vol_diff.y]
    );

    const histogramBaseData = useMemo(
        () => filteredData.iv_hist_vol_diff.y.map((value, index) => [new Date(filteredData.iv.x[index]).getTime(), value]),
        [filteredData.iv_hist_vol_diff.y, filteredData.iv.x]
    );

    const averageYValue = useMemo(() => {
        const total = filteredData.iv_hist_vol_diff.y.reduce((sum, value) => sum + value, 0);
        return total / filteredData.iv_hist_vol_diff.y.length;
    }, [filteredData.iv_hist_vol_diff.y]);

    const lastValue = filteredData.last_value;

    const options = {
        chart: {
            height: 800,
        },
        rangeSelector: {
            selected: 1,
            inputEnabled: true,
            events: {
                afterSetExtremes: function (e) {
                    const { min, max } = e.target;
                    const filtered = {
                        ...data,
                        iv: {
                            ...data.iv,
                            x: data.iv.x.filter(s => new Date(s).getTime() >= min && new Date(s).getTime() <= max),
                            y: data.iv.y.filter((_, index) => {
                                const date = new Date(data.iv.x[index]).getTime();
                                return date >= min && date <= max;
                            })
                        },
                        hist_volatility: {
                            ...data.hist_volatility,
                            y: data.hist_volatility.y.filter((_, index) => {
                                const date = new Date(data.iv.x[index]).getTime();
                                return date >= min && date <= max;
                            })
                        },
                        iv_hist_vol_diff: {
                            ...data.iv_hist_vol_diff,
                            y: data.iv_hist_vol_diff.y.filter((_, index) => {
                                const date = new Date(data.iv.x[index]).getTime();
                                return date >= min && date <= max;
                            })
                        }
                    };
                    setFilteredData(filtered);
                }
            }
        },
        title: {
            text: 'Chart 1',
        },
        xAxis: [{
            title: {
                text: 'Date'
            },
            categories: filteredData.iv.x.map(s => new Date(s).toISOString().split('T')[0]),
        }],
        yAxis: [
            {
                title: {
                    text: 'Implied Volatility'
                },
                height: '33%',
                lineWidth: 2
            },
            {
                title: {
                    text: 'Realised Volatility'
                },
                height: '33%',
                lineWidth: 2,
                opposite: true
            },
            {
                title: {
                    text: 'Volatility Difference'
                },
                top: '34%',
                height: '33%',
                lineWidth: 1,
                plotLines: [{
                    color: 'red',
                    width: 2,
                    value: averageYValue,
                    dashStyle: 'dash',
                    label: {
                        text: `Average: ${averageYValue.toFixed(2)}`,
                        align: 'center',
                        verticalAlign: 'middle',
                        style: {
                            color: 'red',
                            fontWeight: 'bold'
                        }
                    },
                    zIndex: 5
                }]
            },
            {
                title: {
                    text: 'Histogram'
                },
                top: '68%',
                height: '32%',
                lineWidth: 2,
                offset: 0
            }
        ],
        series: [
            {
                yAxis: 0,
                data: impliedSeries,
                name: 'Implied Volatility',
                type: 'line',
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        if (this.point.index === this.series.data.length - 1) {
                            return this.y;
                        } else {
                            return null;
                        }
                    },
                    align: 'right',
                    verticalAlign: 'bottom',
                    style: {
                        fontWeight: 'bold',
                        color: '#000000'
                    }
                }
            },
            {
                yAxis: 1,
                data: realisedSeries,
                name: 'Realised Volatility',
                type: 'line',
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        if (this.point.index === this.series.data.length - 1) {
                            return this.y;
                        } else {
                            return null;
                        }
                    },
                    align: 'right',
                    verticalAlign: 'bottom',
                    style: {
                        fontWeight: 'bold',
                        color: '#000000'
                    }
                }
            },
            {
                yAxis: 2,
                data: barSeries,
                name: 'Volatility Difference',
                type: 'area',
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        if (this.point.index === this.series.data.length - 1) {
                            return this.y;
                        } else {
                            return null;
                        }
                    },
                    align: 'left',
                    verticalAlign: 'top',
                    style: {
                        fontWeight: 'bold',
                        color: '#000000'
                    }
                }
            },
            {
                yAxis: 3,
                name: 'Histogram',
                type: 'histogram',
                baseSeries: 'barSeries',
                zIndex: -1,
                color: {
                    linearGradient: { x1: 0, x2: 1, y1: 0, y2: 1 },
                    stops: [
                        [0, 'rgba(173, 216, 230, 1)'],
                        [1, 'rgba(0, 0, 139, 1)']
                    ]
                },
                data: histogramBaseData
            },
            {
                type: 'scatter',
                data: [[new Date(filteredData.iv.x[filteredData.iv.x.length - 1]).getTime(), filteredData.iv_hist_vol_diff.y[filteredData.iv_hist_vol_diff.y.length - 1]]],
                marker: {
                    symbol: 'circle',
                    radius: 6,
                    fillColor: 'red'
                },
                dataLabels: {
                    enabled: true,
                    format: `Last Values:<br>IV: ${lastValue.iv}<br>RV: ${lastValue.hist_volatility}<br>Vol. Spread: ${lastValue.iv_hist_vol_diff}<br>Vol. Spread Percentile: ${lastValue.iv_hist_vol_percentile}`,
                    align: 'right',
                    verticalAlign: 'top',
                    style: {
                        fontWeight: 'bold',
                        color: '#000000'
                    }
                }
            }
        ],
    };

    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
            constructorType='stockChart'
        />
    );
}

export default FirstChart;
