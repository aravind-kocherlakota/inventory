import Chart from "react-apexcharts";
const BarChart = ({series,products,titleName}) => {

    let options = {
        title:{
            text:titleName
        },
        chart: {
          id: "basic-bar"
        },
        xaxis: {
          categories: products
        }
      }
      
    let seriesData = [
        {
          name: "Aggregated Count",
          data: series
        }
      ]
      return (
        <div id="barchart">
            <Chart options={options} series={seriesData} type="bar" width={600} />
        </div>
      );
  }

export default BarChart