import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getMonthlyPayAmount } from "../../../api/statisticalAxios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthPayAmount = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Monthly Pay Amount",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMonthlyPayAmount();
        const labels = data.map((item) => item.month + "월").reverse();
        const amounts = data.map((item) => item.amount).reverse();
        setChartData({
          labels,
          datasets: [
            {
              label: "Monthly Pay Amount",
              data: amounts,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching and setting chart data:", error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Subscription Status",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "월 매출 통계",
            },
          },
        }}
      />
    </div>
  );
};

export default MonthPayAmount;
