import React from 'react';
import './Card.scss';

class Card extends React.PureComponent {
  render() {
    return (
      <div className='card' id='card'>
        {this.props.children}
      </div>
    )
  }
}

export default Card;
