import React from 'react';
import './Card.scss';

const Card = props =>
  <div className='card' id='card' onKeyDown={props.onKeyDown} tabIndex={props.tabIndex}>
    {props.children}
  </div>;

export default Card;
