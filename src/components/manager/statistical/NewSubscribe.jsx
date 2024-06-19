import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getDailyNewSubscriber } from "../../../api/statisticalAxios";
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

const NewSubscribe = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Daily New Subscriber",
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
        const data = await getDailyNewSubscriber();
        const labels = data.map((item) => item.date).reverse();
        const amounts = data.map((item) => item.subscriber);
        setChartData({
          labels,
          datasets: [
            {
              label: "Daily New Subscriber",
              data: amounts,
              backgroundColor: "rgba(54, 162, 235, 0.2)", // 파란색 배경
              borderColor: "rgba(54, 162, 235, 1)", // 파란색 테두리
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
              text: "일 구독자 수",
            },
          },
          scales: {
            y: {
              beginAtZero: false,
              ticks: {
                stepSize: 1,
                callback: function (value) {
                  if (Number.isInteger(value)) {
                    return value;
                  }
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default NewSubscribe;
