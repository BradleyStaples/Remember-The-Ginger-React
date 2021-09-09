import React from 'react';
import classnames from 'classnames';

const Scoring = ({ gameStarted, numClicks, numMatches, numSeconds, endStats}) => {

  const clicks = () => {
    if (!gameStarted) {
      return null;
    }
    if (numClicks === 1) {
      return '1 click';
    }
    return `${numClicks} clicks`;
  };

  const matches = () => {
    if (!gameStarted) {
      return null;
    }
    if (numMatches === 1) {
      return '1 match';
    }
    return `${numMatches} matches`;
  };

  const seconds = () => {
    if (!gameStarted) {
      return null;
    }
    if (numSeconds === 1) {
      return '1 second';
    }
    return `${numSeconds} seconds`;
  };

  const scoreClasses = classnames({
    score: true,
    hidden: !gameStarted
  });

  return (
    <div className={scoreClasses}>
      <span className='clicks'>{clicks()}</span>
      <span className='matches'>{matches()}</span>
      <span className='time'>{seconds()}</span>
      <span className='stats'>{endStats}</span>
    </div>
  );
};

export default Scoring;
