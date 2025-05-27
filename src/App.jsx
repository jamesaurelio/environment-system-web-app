import React, { useState, useEffect } from 'react';
import Card from './components/Card';
import './App.css';
import Logo from './assets/logo.png';

function App() {
  const [isOn, setIsOn] = useState(false);

  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:8081/api/formdata")
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
    document.body.style.backgroundColor = newState ? '#8fd9fb' : '#282c34';
    console.log(`Switch is now ${newState ? 'ON' : 'OFF'}`);

    if (!prev) {
      sendSensorData(data);  // use latest data from state
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
      console.error('Error sending sensor data:', error);
    }
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
          <Card title="Temperature" value={`${Number(data.temperature).toFixed(2)} °C`} isOn={isOn} />
          <Card title="Humidity" value={`${data.humidity} %`} isOn={isOn} />
          <Card title="CO₂" value={`${data.co2} ppm`} isOn={isOn} />
          <Card title="Light" value={`${Number(data.light).toFixed(2)} lux`} isOn={isOn} />
        </div>
      </div>
    </>
  );
}

export default App;
