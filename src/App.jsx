import { useState } from 'react'
import './index.css'

function App() {
  const sensorData = {
    temperature: 23.5,
    humidity: 55,
    co2: 400,
    light: 750,
  };
  
  return (
    <div className="app">
      <h1>Sensor Data</h1>
      <div className="sensor-data">
        <p>Temperature: {sensorData.temperature} °C</p>
        <p>Humidity: {sensorData.humidity} %</p>
        <p>CO2: {sensorData.co2} ppm</p>
        <p>Light: {sensorData.light} lux</p>
      </div>
      <h2>Control Panel</h2>
      <div className="control-panel">
        <button>Turn On</button>
        <button>Turn Off</button>
        <button>Set Temperature</button>
        <button>Set Humidity</button>
      </div>
    </div>
  );
  
}

export default App
