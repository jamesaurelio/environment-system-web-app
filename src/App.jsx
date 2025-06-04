import React, { useState, useEffect } from 'react';
import Card from './components/Card';
import './App.css';
import Logo from './assets/logo.png';
import Graphs from './components/Graphs';

function App() {
  const [isOn, setIsOn] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:8081/api/sensorData")
        .then(res => res.json())
        .then(json => setData(json.length ? json[json.length - 1] : {}))
        .catch(err => console.error(err));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleToggle = () => {
    setIsOn(prev => {
      const newState = !prev;
      document.body.style.backgroundColor = newState ? '#8fd9fb' : '#000000';
      console.log(`Switch is now ${newState ? 'ON' : 'OFF'}`);

      sendControlSignal(newState ? 'ON' : 'OFF');

      if (!prev) {
        sendSensorData(data);  // use latest data from state
      }

      return newState;
    });
  };

  const sendSensorData = async (data) => {
    try {
      const response = await fetch('http://localhost:8081/api/sensorData', {
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
      console.error('Error sending sensor data:', error);
    }
  };

  const sendControlSignal = async (state) => {
    try {
      const response = await fetch('http://localhost:8081/api/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state }), // { state: 'ON' or 'OFF' }
      });

      if (!response.ok) throw new Error('Failed to send control state');
      console.log('Control state sent successfully');
    } catch (error) {
      console.error('Error sending control state:', error);
    }
  };

  return (
    <>
      {/* Always visible header */}
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

      {/* Overlay for OFF state */}
      <div className={`off-overlay ${isOn ? 'off-hidden' : ''}`}>
        <img src={Logo} alt="KLIMA-X Logo" className="off-logo" />
      </div>

      {/* Main content */}
      <div className="app-container">
        <div className="card-grid">
          <Card title="Temperature" value={`${Number(data.temperature).toFixed(2)} °C`} isOn={isOn} />
          <Card title="Humidity" value={`${Number(data.humidity).toFixed(2)} %`} isOn={isOn} />
          <Card title="CO₂" value={`${data.co2} ppm`} isOn={isOn} />
          <Card title="Light" value={`${Number(data.light).toFixed(2)} lux`} isOn={isOn} />
        </div>
      </div>

      <div style={{textAlign: 'center'}}>
        <h2>🌡️ Temperature 🌡️</h2>
        <Graphs title="Temperature" eul={`${Number(data.T_eul)}`} rk4={`${Number(data.T_rk4)}`} isOn={isOn}/>
        <h2>💧 Humidity 💧</h2>
        <Graphs title="Humidity" eul={`${Number(data.H_eul)}`} rk4={`${Number(data.H_rk4)}`} isOn={isOn}/>
        <h2>🟢 Carbon Dioxide 🟢</h2>
        <Graphs title="CO2" eul={`${Number(data.C_eul)}`} rk4={`${Number(data.C_rk4)}`} isOn={isOn}/>
        <h2>🌞 Light 🌞</h2>
        <Graphs title="Light" eul={`${Number(data.L_eul)}`} rk4={`${Number(data.L_rk4)}`} isOn={isOn}/>
      </div>
    </>

  );
}

export default App;