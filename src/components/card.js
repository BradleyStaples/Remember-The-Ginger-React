import React from 'react';

const Card = ({face, suit, style}) => {
  return (
    <div className='card facedown' style={style}>
      <div className='cardback'></div>
      <div className='cardfront'>
        <span className='face'></span>
        <span className='suit'></span>
      </div>
    </div>
  );
};

export default Card;
