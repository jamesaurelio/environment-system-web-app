import React, { useState } from 'react';
import Card from './components/Card';
import './App.css';
import Logo from './assets/logo.png';

function App() {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn(prev => {
      const newState = !prev;
      const body = document.body;
      body.style.backgroundColor = newState ? '#8fd9fb' : '#282c34';
      console.log(`Switch is now ${newState ? 'ON' : 'OFF'}`);
      return newState;
    });
  };

  const sensorData = {
    temperature: 30,
    humidity: 55,
    co2: 400,
    light: 750,
  };

  return (
    <>
      <div className="header">
        <div className="logo-container">
          <img src={Logo} alt="Logo" className={`logo ${isOn ? 'logo-on' : 'logo-off'}`} />
        </div>
        <div className="title-container">
          <h1 className={`title ${isOn ? 'title-on' : 'title-off'}`}>KLIMA-X Monitoring Dashboard</h1>
        </div>
        <div className="switch-container">
          <label className="switch">
            <input type="checkbox" checked={isOn} onChange={handleToggle} />
            <span className="slider round"></span>
          </label>
          <span className="switch-label">{isOn ? 'ON' : 'OFF'}</span>
        </div>
      </div>

      <div className="app-container">

        <div className="card-grid">
          <Card title="Temperature" value={`${sensorData.temperature} °C`} isOn={isOn} />
          <Card title="Humidity" value={`${sensorData.humidity} %`} isOn={isOn} />
          <Card title="CO₂" value={`${sensorData.co2} ppm`} isOn={isOn} />
          <Card title="Light" value={`${sensorData.light} lux`} isOn={isOn} />
        </div>
      </div>
    </>
  );
}

export default App;