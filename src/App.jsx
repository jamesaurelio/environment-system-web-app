import React, { useState, useEffect } from 'react';
import Card from './components/Card';
import './App.css';
import Logo from './assets/logo.png';
import Graphs from './components/Graphs';

function App() {
  // ===== LOGIN STATE =====
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // ===== DASHBOARD STATE =====
  const [isOn, setIsOn] = useState(false);
  const [dataArray, setDataArray] = useState([]);
  const latestData = dataArray[dataArray.length - 1] || {};

  // ===== LOGIN HANDLER =====
  const validUser = 'KLIMA-X';        // hardcoded username
  const validPass = 'klima123';  // hardcoded password

  // ===== LOGOUT HANDLER =====
  const handleLogout = () => {
    setLoggedIn(false);
    setUsername('');
    setPassword('');
    setError('');
    setIsOn(false);
    setDataArray([]);
    document.body.style.backgroundColor = '#000000'; // reset background
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === validUser && password === validPass) {
      setLoggedIn(true);
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  // Numerical methods for Euler and RK4
  const dt = 1.0;
  let simTime = 0.0;

  let T_eul = 25.0, H_eul = 50.0, C_eul = 300.0, L_eul = 1000.0;
  let T_rk4 = 25.0, H_rk4 = 50.0, C_rk4 = 300.0, L_rk4 = 1000.0;

  const rk4Step = (f, y, t, h) => {
    const k1 = h * f(y, t);
    const k2 = h * f(y + 0.5 * k1, t + 0.5 * h);
    const k3 = h * f(y + 0.5 * k2, t + 0.5 * h);
    const k4 = h * f(y + k3, t + h);
    return (k1 + 2 * k2 + 2 * k3 + k4) / 6.0;
  };

  const external_factor = (t) => {
    return t >= 2.0 ? 1.0 : 0.0;
  };

  const dTdt = (T, t) => {
    const k = 0.1;
    const ambient = 25.0;
    return -k * (T - ambient) + external_factor(t);
  };

  const dHdt = (H) => {
    return -0.05 * (H - 50);
  };

  const dCO2dt = (C, t) => {
    return -0.2 * (C - 300);
  };

  const dLightdt = (L) => {
    return 0.01 * (50000 - L);
  };


  // ===== DATA FETCHING =====
  useEffect(() => {
    if (!loggedIn) return; // only fetch if logged in

    const fetchData = () => {
      fetch("http://localhost:8081/api/sensorData")
        .then(res => res.json())
        .then(json => {
          const newData = json.length ? json[json.length - 1] : null;
          if (newData) {
            setDataArray(prev => {
              if (prev.length === 0 || newData.timestamp !== prev[prev.length - 1].timestamp) {
                const updated = [...prev, newData];

                T_eul += dt * dTdt(T_eul, simTime);
                H_eul += dt * dHdt(H_eul);
                C_eul += dt * dCO2dt(C_eul);
                L_eul += dt * dLightdt(L_eul);

                T_rk4 += rk4Step(dTdt, T_rk4, simTime, dt);
                H_rk4 += rk4Step(dHdt, H_rk4, simTime, dt);
                C_rk4 += rk4Step(dCO2dt, C_rk4, simTime, dt);
                L_rk4 += rk4Step(dLightdt, L_rk4, simTime, dt);

                simTime += dt;
                // Add computed values to the new data
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  T_eul,
                  H_eul,
                  C_eul,
                  L_eul,
                  T_rk4,
                  H_rk4,
                  C_rk4,
                  L_rk4,
                };
                return updated.slice(-5);
              }
              return prev;
            });
          }
        })
        .catch(err => console.error(err));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [loggedIn]);

  // ===== TOGGLE HANDLER =====
  const handleToggle = () => {
    setIsOn(prev => {
      const newState = !prev;
      document.body.style.backgroundColor = newState ? '#8fd9fb' : '#000000';
      console.log(`Switch is now ${newState ? 'ON' : 'OFF'}`);

      sendControlSignal(newState ? 'ON' : 'OFF');

      if (!prev) {
        sendSensorData(latestData);
      }

      return newState;
    });
  };

  // ===== SEND SENSOR DATA =====
  const sendSensorData = async (data) => {
    try {
      const response = await fetch('http://localhost:8081/api/sensorData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to send sensor data');
      console.log('Sensor data sent successfully');
    } catch (error) {
      console.error('Error sending sensor data:', error);
    }
  };

  // ===== SEND CONTROL SIGNAL =====
  const sendControlSignal = async (state) => {
    try {
      const response = await fetch('http://localhost:8081/api/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state }),
      });
      if (!response.ok) throw new Error('Failed to send control state');
      console.log('Control state sent successfully');
    } catch (error) {
      console.error('Error sending control state:', error);
    }
  };

  // ===== RENDER LOGIN FORM IF NOT LOGGED IN =====
if (!loggedIn) {
  return (
    <div className="login-wrapper">
      <div className="logo-wrapper">
        <img src={Logo} alt="KLIMA-X Logo" className="login-logo" />
      </div>
      <div className="login-container">
        <h2>Login to KLIMA-X Dashboard</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label><br />
            <input
              type="text"
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              placeholder="Enter username"
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label><br />
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
}

  // ===== RENDER DASHBOARD IF LOGGED IN =====
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
          <button
            onClick={handleLogout}
            className="logout-button"
            title="Logout"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for OFF state */}
      <div className={`off-overlay ${isOn ? 'off-hidden' : ''}`}>
        <img src={Logo} alt="KLIMA-X Logo" className="off-logo" />
      </div>

      {/* Main content */}
      <div className="app-container">
        <div className="card-grid">
          <Card title="Temperature" value={`${Number(latestData.temperature).toFixed(2)} °C`} isOn={isOn} />
          <Card title="Humidity" value={`${Number(latestData.humidity).toFixed(2)} %`} isOn={isOn} />
          <Card title="CO₂" value={`${latestData.co2} ppm`} isOn={isOn} />
          <Card title="Light" value={`${Number(latestData.light).toFixed(2)} lux`} isOn={isOn} />
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h2>🌡️ Temperature 🌡️</h2>
        <Graphs title="Temperature" data={dataArray} sensorKey="temperature" eulKey="T_eul" rk4Key="T_rk4" />
        <h2>💧 Humidity 💧</h2>
        <Graphs title="Humidity" data={dataArray} sensorKey="humidity" eulKey="H_eul" rk4Key="H_rk4" />
        <h2>🟢 Carbon Dioxide 🟢</h2>
        <Graphs title="CO₂" data={dataArray} sensorKey="co2" eulKey="C_eul" rk4Key="C_rk4" />
        <h2>🌞 Light 🌞</h2>
        <Graphs title="Light" data={dataArray} sensorKey="light" eulKey="L_eul" rk4Key="L_rk4" />
      </div>
    </>
  );
}

export default App;
