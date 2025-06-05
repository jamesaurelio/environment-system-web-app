import React from "react";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const Graph = ({ data, eulKey, rk4Key }) => (
  <div style={{ margin: "24px 24px" }}>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(tick) => {
            const date = new Date(tick);
            const h = String(date.getHours()).padStart(2, '0');
            const m = String(date.getMinutes()).padStart(2, '0');
            const s = String(date.getSeconds()).padStart(2, '0');
            return `${h}:${m}:${s}`;
          }}
        />
        <YAxis />
        <Tooltip
          labelFormatter={(label) => {
            const date = new Date(label);
            const h = String(date.getHours()).padStart(2, '0');
            const m = String(date.getMinutes()).padStart(2, '0');
            const s = String(date.getSeconds()).padStart(2, '0');
            return `${h}:${m}:${s}`;
          }}
        />

        <Legend />
        <Line type="monotone" dataKey={eulKey} stroke="#006400" name="Euler" />
        <Line type="monotone" dataKey={rk4Key} stroke="#4b0076" name="RK4" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default Graph;
