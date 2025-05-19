import React from 'react';
import Card from './components/Card';
import './App.css';

function App() {
  const sensorData = {
    temperature: 23.5,
    humidity: 55,
    co2: 400,
    light: 750,
  };

  return (
    <div className="app-container">
      <h1>Environment Monitor Dashboard</h1>
      
      <div className="card-grid">
        <Card title="Temperature" value={`${sensorData.temperature} °C`} />
        <Card title="Humidity" value={`${sensorData.humidity} %`} />
        <Card title="CO₂" value={`${sensorData.co2} ppm`} />
        <Card title="Light" value={`${sensorData.light} lux`} />
      </div>

      <div className="controls">
        <button className="btn on">Turn ON</button>
        <button className="btn off">Turn OFF</button>
      </div>
    </div>
  );
}

export default App;
