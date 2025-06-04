import React from "react";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// Dummy data
const zScoreData = [
  { x: 1, z: -1.2 },
  { x: 2, z: -0.5 },
  { x: 3, z: 0.1 },
  { x: 4, z: 0.8 },
  { x: 5, z: 1.5 },
];

const eulerData = [
  { x: 0, y: 1 },
  { x: 1, y: 1.5 },
  { x: 2, y: 2.1 },
  { x: 3, y: 2.8 },
  { x: 4, y: 3.6 },
];

const rk4Data = [
  { x: 0, y: 1 },
  { x: 1, y: 1.6 },
  { x: 2, y: 2.4 },
  { x: 3, y: 3.3 },
  { x: 4, y: 4.2 },
];

const Graph = ({ title, data, dataKey }) => (
  <div style={{ margin: "24px 0" }}>
    <h3 style={{ textAlign: "center", color: "#fff" }}>{title}</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="x" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={dataKey} stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const Graphs = () => (
  <div style={{ padding: "24px" }}>
    <Graph title="Z-Score Over Time" data={zScoreData} dataKey="z" />
    <Graph title="Euler Method" data={eulerData} dataKey="y" />
    <Graph title="Runge-Kutta 4 (RK4)" data={rk4Data} dataKey="y" />
  </div>
);

export default Graphs;