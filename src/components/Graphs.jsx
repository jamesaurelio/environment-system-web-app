import React from "react";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const Graph = ({ title, data, eulKey, rk4Key }) => (
  <div style={{ margin: "24px 0" }}>
    <h3 style={{ textAlign: "center", color: "#fff" }}>{title}</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis 
          dataKey="timestamp"
          tickFormatter={(tick) => {
            const date = new Date(tick);
            return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
          }}
        />
        <YAxis />
        <Tooltip 
          labelFormatter={(label) => {
            const date = new Date(label);
            return date.toLocaleTimeString();
          }}
        />
        <Legend />
        <Line type="monotone" dataKey={eulKey} stroke="#8884d8" name="Euler" />
        <Line type="monotone" dataKey={rk4Key} stroke="#82ca9d" name="RK4" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default Graph;
