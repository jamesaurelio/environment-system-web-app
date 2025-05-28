const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const allowedOrigins = ["http://localhost:5173"];
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
  sensorData.push(req.body);
  res.status(200).json({ message: "Sensor data saved successfully", data: req.body });
});

// Get all sensor data
app.get("/api/sensorData", (req, res) => {
  res.status(200).json(sensorData);
});

// Start server
app.listen(8081, () => {
  console.log("✅ Server started at: http://localhost:8081");
  console.log("📦 Try the API at: http://localhost:8081/api");
});
