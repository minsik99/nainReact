import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getDailyNewMember } from "../../../api/statisticalAxios";
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

const NewMember = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Daily New member",
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
        const data = await getDailyNewMember();
        const labels = data.map((item) => item.date).reverse();
        const amounts = data.map((item) => item.member).reverse();
        setChartData({
          labels,
          datasets: [
            {
              label: "Daily New member",
              data: amounts,
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
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
              text: "일 가입자 수",
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

export default NewMember;
