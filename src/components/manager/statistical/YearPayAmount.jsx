import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getYearlyPayAmount } from "../../../api/statisticalAxios";
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

const YearPayAmount = () => {
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
        const data = await getYearlyPayAmount();
        const labels = data.map((item) => item.year + "년");
        const amounts = data.map((item) => item.amount);
        setChartData({
          labels,
          datasets: [
            {
              label: "Yearly Pay Amount",
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
              text: "연 매출 통계",
            },
          },
        }}
      />
    </div>
  );
};

export default YearPayAmount;
