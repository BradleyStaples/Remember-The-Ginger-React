import React from 'react';

const StaticCard = ({style}) => {
  return (
    <div className='card facedown' style={style}>
      <div className='cardback'></div>
    </div>
  );
};

export default StaticCard;
