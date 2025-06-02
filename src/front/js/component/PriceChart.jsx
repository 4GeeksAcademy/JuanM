
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function PriceChart({ data, currency }) {
  if (!data || data.length === 0) {
    return <div>No data available for chart</div>;
  }

  // Ordenar los datos por fecha (del más antiguo al más reciente)
  const sortedData = [...data].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const chartData = {
    labels: sortedData.map(item => new Date(item.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: `${currency} Price`,
        data: sortedData.map(item => item.price),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Historical and Predicted ${currency} Prices`
      }
    },
    scales: {
      x: {
        ticks: {
          // Opcional: para mejor visualización de fechas
          autoSkip: true,
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
}

export default PriceChart;




