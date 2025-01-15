import React, { useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
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

const ChartComponent = ({ data, label, title, days }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  if (!data) {
    return <p>Loading chart data...</p>;
  }

  let labels;
  if (days == 1) {
    labels = data.map((entry, index) => {
      const time = new Date(entry[0]);
      return `${time.getHours()}:${time.getMinutes()}`;
    });
  } else if (days === 30 || days === 7) {
    labels = data.map((entry) => {
      const time = new Date(entry[0]);
      return `${time.getMonth() + 1}/${time.getDate()}`;
    });
  } else if (days === 365) {
    labels = data.map((entry) => {
      const time = new Date(entry[0]);
      return `${time.getFullYear()}-${time.getMonth() + 1}`;
    });
  } else {
    labels = data.map((entry) => {
      const time = new Date(entry[0]);
      return `${time.getMonth() + 1}/${time.getDate()}`;
    });
  }
  const formattedData = {
    labels,
    datasets: [
      {
        label: label,
        data: data.map((entry) => entry[1]),
        borderColor: "#FEC20C",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      title: {
        display: false,
        text: title,
      },
      legend: {
        display: false,
      },
    },
  };

  return (
    <div
      className="w-full border-2 border-gray-800 rounded-lg p-2"
      style={{ height: "400px" }}
    >
      <Line ref={chartRef} data={formattedData} options={chartOptions} />
    </div>
  );
};

export default ChartComponent;
