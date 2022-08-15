import Chart from "react-apexcharts";
const ApexChart = ({series,titleName}) => {

      const options =  {
            title:{
                text:titleName
            },
          chart: {
            width: 380,
            type: 'pie',
          },
          labels: ['expired', 'not Expired', 'No Valid Expiry Date'],
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        }
      return (
        <div id="chart">
            <Chart options={options} series={series} type="pie" width={600} />
        </div>
      );
  }

export default ApexChart