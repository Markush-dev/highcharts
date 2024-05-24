import { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HistogramModule from 'highcharts/modules/histogram-bellcurve';
import data from '../assets/chart1.json';

HistogramModule(Highcharts);

function HistogramChart() {
  const averageYValue = useMemo(() => {
      let total = 0;
      let count = 0;
      
      data.iv_hist_vol_diff.y.forEach(value => {
        total += value;
        count++;
      });
      
      return total / count;
  }, [data.iv_hist_vol_diff.y]);

  const options = {
    chart: {
        type: 'histogram',
    },
    title: {
        text: 'Plot 2',
    },
    xAxis: {
        categories: data.iv_hist_vol_diff.x,
        title: {
            text: 'Date'
        }
    },
    yAxis: {
        title: {
            text: 'Implied Volatility Differences'
        },
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
    series: [{
        data: data.iv_hist_vol_diff.y,
        name: 'Differences',
        dataLabels: {
          enabled: true,
          formatter: function() {
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
    }],
  };


  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  );
}

export default HistogramChart;
