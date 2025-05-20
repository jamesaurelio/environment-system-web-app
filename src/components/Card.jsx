import React from 'react';
import '../styles/Card.css';

function Card({ title, value, isOn }) {
  const lowerTitle = title.toLowerCase();
  const isHumidity = lowerTitle === 'humidity';
  const isTemperature = lowerTitle === 'temperature';
  const isLight = lowerTitle === 'light';

  const numericValue = parseFloat(value); // strip any units

  // Icon & color for temperature
  const tempIcon = numericValue > 30 ? "🔥" : numericValue < 15 ? "🧊" : "🌡️";
  const tempColor = numericValue > 30 ? "#ff4d4f" : numericValue < 15 ? "#00bfff" : "#ffaa00";

  // Icon & color for light level (lux)
  let lightIcon = "🌙"; // moon
  if (numericValue > 800) lightIcon = "🌞";
  else if (numericValue > 400) lightIcon = "🌤️";

  const lightPercent = Math.min((numericValue / 1000) * 100, 100); // clamp at 100

  return (
    <div className={`card ${isOn ? 'card-on' : 'card-off'}`}>
      <h2>{title}</h2>
      <p>{`${value}`}</p>

      {isHumidity && (
        <div className="circular-wrapper">
          <svg viewBox="0 0 36 36" className="circular-chart blue">
            <path className="circle-bg"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            <path className="circle"
              strokeDasharray={`${numericValue}, 100`}
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            <text x="18" y="20.35" className="humidity-icon">💧</text>
          </svg>
        </div>
      )}

      {isTemperature && (
        <div className="circular-wrapper">
          <svg viewBox="0 0 36 36" className="circular-chart thermometer">
            <path className="circle-bg"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            <path className="circle"
              stroke={tempColor}
              strokeDasharray={`${(numericValue / 50) * 100}, 100`}
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            <text x="18" y="20.35" className="humidity-icon">{tempIcon}</text>
          </svg>
        </div>
      )}

      {isLight && (
        <div className="circular-wrapper">
          <svg viewBox="0 0 36 36" className="circular-chart light">
            <path className="circle-bg"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            <path className="circle"
              stroke="#ffcc00"
              strokeDasharray={`${lightPercent}, 100`}
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            <text x="18" y="20.35" className="humidity-icon">{lightIcon}</text>
          </svg>
        </div>
      )}
        {lowerTitle === 'co₂' && (
        <div className="circular-wrapper">
          <svg viewBox="0 0 36 36" className="circular-chart co2">
            <path className="circle-bg"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            <path className="circle"
              stroke={
                numericValue < 600 ? "#00cc66" :
                numericValue <= 1000 ? "#ffaa00" :
                "#ff4d4f"
              }
              strokeDasharray={`${Math.min(numericValue / 1500 * 100, 100)}, 100`}
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            <text x="18" y="20.35" className="humidity-icon">
              {numericValue < 600 ? "🟢" : numericValue <= 1000 ? "🟡" : "🔴"}
            </text>
          </svg>
        </div>
      )}

    </div>
  );
}

export default Card;