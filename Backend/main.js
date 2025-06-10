const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require('dotenv');

dotenv.config();

const allowedOrigins = [
  'https://jamesaurelio.github.io',
  process.env.WEB_APP_URL];
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(bodyParser.json());

// In-memory storage
let sensorData = [];
let deviceState = "OFF"; // Initial state

// Set device ON/OFF state
app.post("/api/control", (req, res) => {
  const { state } = req.body;
  if (state !== "ON" && state !== "OFF") {
    return res.status(400).json({ error: "Invalid state" });
  }
  deviceState = state;
  console.log(`🔧 Device state updated to: ${deviceState}`);
  res.status(200).json({ message: "Device state updated", state: deviceState });
});

// Get current ON/OFF state (for ESP32 or frontend)
app.get("/api/control", (req, res) => {
  res.status(200).json({ state: deviceState });
});

// NEW: Combined API for latest status
app.get("/api/status", (req, res) => {
  const latestData = sensorData.length > 0 ? sensorData[sensorData.length - 1] : null;
  res.status(200).json({
    deviceState,
    latestSensorData: latestData,
  });
});

// Handle sensor data 
app.post("/api/sensorData", (req, res) => {
  const dataWithTimestamp = {
    ...req.body,
    timestamp: new Date().toISOString()
  };

  sensorData.push(dataWithTimestamp);

  res.status(200).json({
    message: "Sensor data saved successfully",
    data: dataWithTimestamp
  });
});


// Get all sensor data
app.get("/api/sensorData", (req, res) => {
  res.status(200).json(sensorData);
});

const PORT = process.env.API_PORT || 8081;

// Start server
app.listen(PORT, () => {
  console.log(`🌐 Server is running on ${process.env.SERVER_URL}`);
  console.log(`💻 Check data at ${process.env.SERVER_URL}/api/sensorData`);
  console.log(`⚙️  Check status and control at ${process.env.SERVER_URL}/api/control & ${process.env.SERVER_URL}/api/status`);
});
