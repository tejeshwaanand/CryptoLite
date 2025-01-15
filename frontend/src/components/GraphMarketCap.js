import { useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
// import { fetchChartMarketCap } from "@/services/coinService";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chart.js/auto";
import { Color } from "three";
import CoinlistLoading from "@/Loadings/CoinlistLoading";

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GlobalMarketCapChart = () => {
  const selectedCoin = useSelector((state) => state.coins.selectedCoin);
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedCoin) {
        try {
          const responce = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/coinchart/${selectedCoin}`);
          const data = await responce.json();
          const formattedData = {
            labels: data.market_caps.map((entry) => {
              const time = new Date(entry[0]);
              return `${time.getHours()}:${time.getMinutes()}`;
            }),
            datasets: [
              {
                label: `${selectedCoin} Market Cap`,
                data: data.market_caps.map((entry) => entry[1]),
                borderColor: "#FEC20C",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
              },
            ],
          };
          setChartData(formattedData);
        } catch (error) {
          console.error("Error fetching market chart data:", error);
        }
      }
    };

    fetchData();
  }, [selectedCoin]);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  if (!selectedCoin) {
    return null;
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index", // Enable tooltip on nearest data point along the line
      intersect: false,
    },
  };

  return (
    <div
      className=" border-2 rounded-lg p-4 border-gray-800 w-full my-4"
      style={{ height: "400px" }}
    >
      {chartData ? (
        <Line ref={chartRef} data={chartData} options={chartOptions} />
      ) : (
        <div className="w-full h-80">
          <CoinlistLoading />
        </div>
      )}
    </div>
  );
};

export default GlobalMarketCapChart;
