import React, { useState } from 'react';
import Card from './components/Card';
import './App.css';
import Logo from './assets/leaf.jpg';
import axios from 'axios';
import { useEffect } from 'react';

function App() {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
  setIsOn(prev => {
    const newState = !prev;
    const body = document.body;
    body.style.backgroundColor = newState ? '#8fd9fb' : '#282c34';
    console.log(`Switch is now ${newState ? 'ON' : 'OFF'}`);
    // Send data to backend when toggled ON
    if (!prev) {
      sendSensorData(sensorData);
    }
    return newState;
  });
};

const sendSensorData = async (data) => {
  try {
    const response = await fetch('http://localhost:8081/api/formdata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to send sensor data');
    }
    console.log('Sensor data sent successfully');
  } catch (error) {
    console.error(error);
  }
};
  const sensorData = {
    temperature: 30,
    humidity: 55,
    co2: 400,
    light: 750,
  };

  return (
    <div className="app-container">
      <div className="header">
        <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo"/>
        </div>
        <div className="title-container">
          <h1>Environment Monitor Dashboard</h1>
        </div>
      </div>

      <div className="card-grid">
        <Card title="Temperature" value={`${sensorData.temperature} °C`} isOn={isOn} />
        <Card title="Humidity" value={`${sensorData.humidity} %`} isOn={isOn} />
        <Card title="CO₂" value={`${sensorData.co2} ppm`} isOn={isOn} />
        <Card title="Light" value={`${sensorData.light} lux`} isOn={isOn} />
      </div>

      <div className="switch-container">
        <label className="switch">
          <input type="checkbox" checked={isOn} onChange={handleToggle} />
          <span className="slider round"></span>
        </label>
        <span className="switch-label">{isOn ? 'ON' : 'OFF'}</span>
      </div>
    </div>
  );
}

export default App;