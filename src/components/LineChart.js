import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import data from '../assets/chart1.json';

function LineChart() {
  const options = {
    title: {
        text: 'Plot 1',
    },
    xAxis: {
        categories: data.iv.x,
        title: {
            text: 'Date'
        }
    },
    yAxis: [{
        title: {
            text: 'Implied Volatility'
        },
    }, {
        title: {
            text: 'Realised Volatility'
        },
        opposite: true,
    }],
    series: [{
        yAxis: 0,
        data: data.iv.y,
        name: 'iv',
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
    },{
        yAxis: 1,
        data: data.hist_volatility.y,
        name: 'volatility history',
        dataLabels: {
          enabled: true,
          formatter: function() {
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
    }],
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  );
}

export default LineChart;
