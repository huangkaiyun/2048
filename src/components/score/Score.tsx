import React from 'react';
import './Score.css';

export const Score = ({ label, value }: { label: string; value: number }) => (
  <div className="score">
    <div className="label">{label}</div>
    <div className="value">{value}</div>
  </div>
);
