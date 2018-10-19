import React from 'react';
import './market-item.css';

export default props => (
  <div
    className={`MarketItem ${props.active ? 'active' : ''}`}
    onClick={() => props.onClick(props.market)}
  >
    <span>{props.market}</span>
  </div>
);
