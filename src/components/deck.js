import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';

import Card from './card';
import StaticCard from './static-card';
import Scoring from './scoring';
import useInterval from './use-interval';
import { deckShuffler, cardSpreader } from './deck-shuffler';

const Deck = ({ gameStarted, isPlaying, showOverlay }) => {
  const shuffledDeck = useRef();
  const secondsCounter = useRef();

  if (!shuffledDeck.current) {
    // store the deck in a ref so it only gets shuffled once, not once per render
    shuffledDeck.current = deckShuffler();
    cardSpreader(shuffledDeck.current);
  }

  const [numClicks, setNumClicks] = useState(0);
  const [numSeconds, setNumSeconds] = useState(0);
  const [numMatches, setNumMatches] = useState(0);
  const [endStats, setEndStats] = useState('');

  useEffect(() => {
    if (!isPlaying) {
      clearInterval(secondsCounter.current);
      secondsCounter.current = null;
    }
  }, [isPlaying]);

  useEffect(() => {
    let ctm = ((numMatches / numClicks) * 100).toFixed(2);
    if (isNaN(ctm) && numClicks === 0) {
      ctm = 0.00;
    }
    let cps = (numClicks / numSeconds).toFixed(2);
    if (isNaN(cps) && numSeconds === 0) {
      cps = 0.00;
    }
    let template = `${ctm}% click-to-match ratio | ${cps} clicks per second`;
    setEndStats(template);
  }, [numClicks, numSeconds, numMatches]);

  const clickIncrementor = () => {
    setNumClicks(numClicks + 1);
  };

  secondsCounter.current = useInterval(() => {
    setNumSeconds(numSeconds => numSeconds + 1);
  }, isPlaying ? 1000 : null);

  const cardFrameClasses = classnames({
    cardframe: true,
    clearfix: true,
    hidden: !gameStarted
  });

  const deckClasses = classnames({
    deck: true,
    hidden: gameStarted
  });

  const overlayClasses = classnames({
    overlay: true,
    hidden: !showOverlay
  });

  return (
    <div>
      <div className={cardFrameClasses}>
        {shuffledDeck.current && shuffledDeck.current.map((card, index) => {
          return (
            <Card
              face={card.face}
              suit={card.suit}
              color={card.color}
              key={`card-${index}`}
              isPlaying={isPlaying}
              clickIncrementor={clickIncrementor}
            />
          );
        })}
      </div>
      <div className={deckClasses}>
        {shuffledDeck.current && shuffledDeck.current.map((card, index) => {
          return (
            <StaticCard
              style={card.style}
              key={`static-card-${index}`}
            />
          );
        })}
      </div>
      <Scoring
        gameStarted={gameStarted}
        numClicks={numClicks}
        numMatches={numMatches}
        numSeconds={numSeconds}
        endStats={endStats}
      />
      <div className={overlayClasses}></div>
    </div>
  );
};

export default Deck;
