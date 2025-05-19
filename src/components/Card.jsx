import React from 'react';
import '../styles/Card.css';

function Card({ title, value }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{value}</p>
    </div>
  );
}

export default Card;
