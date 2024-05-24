import React, { useMemo } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import data from '../assets/chart2.json';

HighchartsMore(Highcharts);

function SecondChart() {
    const closeSeries = useMemo(
        () => data.close.x.map((s, index) => ([new Date(s).getTime(), data.close.y[index]])),
        [data.close.y, data.close.x]
    );

    const candlestickSeries = useMemo(
        () => data.close.x.map((s, index) => {
            const close = data.close.y[index];
            return {
                x: new Date(s).getTime(),
                open: close,
                high: close,
                low: close,
                close: close,
                color: index === 0 ? 'green' : (data.close.y[index] >= data.close.y[index - 1] ? 'green' : 'red'),
                upColor: 'green',
                downColor: 'red'
            };
        }),
        [data.close.y, data.close.x]
    );

    const barSeries = useMemo(
        () => data.bar_chart.map(bar => ({
            data: bar.price.map((price, index) => {
                const [low, high] = price.split('-').map(Number);
                return {
                    x: new Date(bar.start).getTime(),
                    y: (low + high) / 2,
                    low,
                    high,
                    value: bar.value[index]
                };
            }),
            name: `Bar chart starting at ${bar.start}`
        })),
        [data.bar_chart]
    );

    const options = {
        chart: {
            height: 800
        },
        title: {
            text: 'Chart 2'
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: 'time'
            }
        },
        yAxis: [{
            title: {
                text: 'Close'
            }
        }],
        series: [
            {
                name: 'Close',
                data: closeSeries,
                type: 'line',
                tooltip: {
                    valueDecimals: 2
                }
            },
            {
                name: 'Candlestick',
                data: candlestickSeries,
                type: 'candlestick',
                color: 'red',
                upColor: 'green',
                tooltip: {
                    valueDecimals: 2
                }
            },
            ...barSeries.map(bar => ({
                name: bar.name,
                type: 'columnrange',
                data: bar.data.map(item => [item.x, item.low, item.high]),
                tooltip: {
                    pointFormat: 'Low: {point.low}<br/>High: {point.high}<br/>Value: {point.value}'
                }
            }))
        ]
    };

    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
            constructorType={'stockChart'}
        />
    );
}

export default SecondChart;
