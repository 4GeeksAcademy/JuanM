import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
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

const Main = () => {
  const [historyData, setHistoryData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [model, setModel] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [futureDays, setFutureDays] = useState(7);
  const [error, setError] = useState(null);
  
  // Cargar datos históricos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://miniature-xylophone-56p4j4jj4p7h74pj-3001.app.github.dev/api/history');
        const data = await response.json();
        setHistoryData(data.history || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error al cargar los datos históricos');
      }
    };
    
    fetchData();
  }, []);

  // Preparar datos para el modelo
  const prepareData = (data) => {
    const prices = data.map(item => parseFloat(item.price));
    const dates = data.map(item => item.date);
    
    // Normalizar los precios entre 0 y 1
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const normalizedPrices = prices.map(price => (price - minPrice) / (maxPrice - minPrice));
    
    return {
      prices,
      dates,
      normalizedPrices,
      minPrice,
      maxPrice
    };
  };

  // Crear y entrenar el modelo
  const trainModel = async () => {
    if (historyData.length === 0) {
      setError('No hay datos disponibles para entrenar');
      return;
    }
    
    setIsTraining(true);
    setError(null);
    
    try {
      const { normalizedPrices, minPrice, maxPrice } = prepareData(historyData);
      
      // Crear secuencias para el modelo
      const createSequences = (data, windowSize) => {
        const sequences = [];
        const labels = [];
        
        for (let i = windowSize; i < data.length; i++) {
          sequences.push(data.slice(i - windowSize, i));
          labels.push(data[i]);
        }
        
        return { sequences, labels };
      };
      
      const windowSize = 10;
      const { sequences, labels } = createSequences(normalizedPrices, windowSize);
      
      // Convertir a tensores con la forma correcta
      const xs = tf.tensor3d(
        sequences.map(seq => seq.map(val => [val])), // Asegurar estructura [][][]
        [sequences.length, windowSize, 1]
      );
      
      const ys = tf.tensor2d(labels, [labels.length, 1]);
      
      // Crear modelo secuencial
      const model = tf.sequential();
      
      model.add(tf.layers.lstm({
        units: 50,
        returnSequences: false,
        inputShape: [windowSize, 1]
      }));
      
      model.add(tf.layers.dense({ units: 1 }));
      
      model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'meanSquaredError'
      });
      
      // Entrenar el modelo
      await model.fit(xs, ys, {
        epochs: 50,
        batchSize: 32,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
          }
        }
      });
      
      setModel(model);
      
      // Hacer predicciones iniciales
      makePredictions(model, normalizedPrices, windowSize, minPrice, maxPrice);
    } catch (err) {
      console.error('Error during model training:', err);
      setError('Error durante el entrenamiento del modelo');
    } finally {
      setIsTraining(false);
    }
  };
  
  // Hacer predicciones futuras
  const makePredictions = (model, normalizedData, windowSize, minPrice, maxPrice) => {
    try {
      // Usar los últimos 'windowSize' puntos para la primera predicción
      let input = normalizedData.slice(-windowSize);
      let futurePredictions = [];
      
      for (let i = 0; i < futureDays; i++) {
        const tensorInput = tf.tensor3d(
          [input.map(val => [val])], // Asegurar estructura [][][]
          [1, windowSize, 1]
        );
        
        const prediction = model.predict(tensorInput);
        const predictedValue = prediction.dataSync()[0];
        
        // Agregar la predicción y actualizar el input
        futurePredictions.push(predictedValue);
        input = [...input.slice(1), predictedValue];
        
        // Liberar memoria del tensor
        tensorInput.dispose();
        prediction.dispose();
      }
      
      // Desnormalizar las predicciones
      const denormalized = futurePredictions.map(
        val => val * (maxPrice - minPrice) + minPrice
      );
      
      setPredictions(denormalized);
    } catch (err) {
      console.error('Error during prediction:', err);
      setError('Error al hacer predicciones');
    }
  };
  
  const handlePredict = () => {
    if (!model) {
      setError('Primero debes entrenar el modelo');
      return;
    }
    
    const { normalizedPrices, minPrice, maxPrice } = prepareData(historyData);
    makePredictions(model, normalizedPrices, 10, minPrice, maxPrice);
  };

  const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.dataset.label}: $${context.raw.toFixed(2)}`;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: false,
      ticks: {
        callback: function(value) {
          return `$${value}`;
        }
      }
    }
  }
};
  
  // Datos para el gráfico
  // const chartData = {
  //   labels: [
  //     ...historyData.map(item => item.date),
  //     ...Array.from({ length: futureDays }, (_, i) => `Día futuro ${i + 1}`)
  //   ],
  //   datasets: [
  //     {
  //       label: 'Precio histórico de Bitcoin',
  //       data: [...historyData.map(item => parseFloat(item.price)), ...Array(futureDays).fill(null)],
  //       borderColor: 'rgb(75, 192, 192)',
  //       tension: 0.1
  //     },
  //     {
  //       label: 'Predicciones',
  //       data: [...Array(historyData.length).fill(null), ...predictions],
  //       borderColor: 'rgb(255, 99, 132)',
  //       tension: 0.1,
  //       borderDash: [5, 5]
  //     }
  //   ]
  // };

  const chartData = {
  labels: [
    ...historyData.map((item, index) => `Día ${index + 1}`),
    ...Array.from({ length: futureDays }, (_, i) => `Pred ${i + 1}`)
  ],
  datasets: [
    {
      label: 'Precio histórico de Bitcoin',
      data: [...historyData.map(item => parseFloat(item.price)), ...Array(futureDays).fill(null)],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      tension: 0.4,
      pointRadius: 3
    },
    {
      label: 'Predicciones futuras',
      data: [...Array(historyData.length).fill(null), ...predictions],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderDash: [6, 6],
      tension: 0.1,
      pointRadius: 4
    }
  ]
};
  
  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Predicción de Precios de Bitcoin</h1>
      
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={trainModel} disabled={isTraining || historyData.length === 0}>
          {isTraining ? 'Entrenando...' : 'Entrenar Modelo'}
        </button>
        
        <div style={{ marginTop: '10px' }}>
          <label>Días a predecir: </label>
          <input 
            type="number" 
            value={futureDays} 
            onChange={(e) => setFutureDays(parseInt(e.target.value))}
            min="1"
            max="30"
          />
          <button onClick={handlePredict} disabled={!model}>
            Predecir
          </button>
        </div>
      </div>
      
      <div style={{ height: '500px' }}>
        <Line 
          data={chartData}
          options={chartOptions}
        />
      </div>
      
      {predictions.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Próximas predicciones:</h3>
          <ul>
            {predictions.map((price, index) => (
              <li key={index}>
                Día {index + 1}: ${price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Main;