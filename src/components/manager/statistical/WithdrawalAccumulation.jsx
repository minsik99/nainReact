import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getWithdrawalAccumulation } from "../../../api/statisticalAxios";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WithdrawalAccumulation = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "WithdrawalAccumulation",
        data: [],
        backgroundColor: "rgba(54, 162, 235, 0.2)", // 파란색 배경
        borderColor: "rgba(54, 162, 235, 1)", // 파란색 테두리
        borderWidth: 1,
        fill: false, // 채우기 여부
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWithdrawalAccumulation();
        const labels = data.map((item) => item.date);
        const amounts = data.map((item) => item.withdrawal);
        setChartData({
          labels,
          datasets: [
            {
              label: "WithdrawalAccumulation",
              data: amounts,
              backgroundColor: "rgba(54, 162, 235, 0.2)", // 파란색 배경
              borderColor: "rgba(54, 162, 235, 1)", // 파란색 테두리
              borderWidth: 1,
              fill: false, // 채우기 여부
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
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "누적 탈퇴자 수",
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

export default WithdrawalAccumulation;
