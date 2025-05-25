const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");




const allowedOrigins = ["http://localhost:5173"];
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(bodyParser.json());

// Sample in-memory database (instead of MongoDB)
let formData = [];

// Handle form submission
app.post("/api/formdata", (req, res) => {
  formData.push(req.body);
  res.status(200).json({ message: "Form data saved successfully", data: req.body });
});

// Get form data
app.get("/api/formdata", (req, res) => {
  res.status(200).json(formData);
});

// Start server
app.listen(8081, () => {
  console.log("✅ Server started at: http://localhost:8081");
  console.log("📦 Try the API at: http://localhost:8081/api");
});