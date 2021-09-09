import React, { useState } from 'react';
import classnames from 'classnames';

const Card = ({ face, suit, color, isPlaying, clickIncrementor}) => {

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
    <button className='cardButton' onClick={flipCard}>
      <div className={cardClasses}>
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
    </button>
  );
};

export default Card;
