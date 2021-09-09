import React, { useState } from 'react';
import classnames from 'classnames';

const Card = ({ face, suit, color, style, isPlaying, clickIncrementor}) => {

  const [isFaceup, setIsFaceup] = useState(false);

  const flipCard = (event) => {
    if (!isPlaying || isFaceup) {
      event.preventDefault();
      return false;
    }
    setIsFaceup(isFaceup => !isFaceup);
    clickIncrementor();
  };

  const cardClasses = classnames({
    card: true,
    facedown: !isFaceup,
    faceup: isFaceup,
    black: color === 'black',
    red: color === 'red'
  });

  return (
    <div className={cardClasses} style={style} onClick={flipCard}>
      <div className='cardback'></div>
      <div className='cardfront'>
        <span className='face'>
          {isFaceup &&
            <span>{face}</span>
          }
        </span>
        <span className='suit'>
          {isFaceup &&
            <span>{suit}</span>
          }
        </span>
      </div>
    </div>
  );
};

export default Card;
