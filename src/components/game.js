import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';

import Card from './card';
import StaticCard from './static-card';
import Scoring from './scoring';
import useInterval from './use-interval';
import { deckShuffler, cardSpreader } from './deck-shuffler';

const Deck = () => {
  const shuffledDeck = useRef();
  const secondsCounter = useRef();

  if (!shuffledDeck.current) {
    // store the deck in a ref so it only gets shuffled once, not once per render
    shuffledDeck.current = deckShuffler();
    cardSpreader(shuffledDeck.current);
  }

  const [gameStarted, setGameStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [buttonLabel, setButtonLabel] = useState('Start');
  const [showOverlay, setShowOverlay] = useState(false);
  const [numClicks, setNumClicks] = useState(0);
  const [numSeconds, setNumSeconds] = useState(0);
  const [numMatches, setNumMatches] = useState(0);
  const [endStats, setEndStats] = useState('');
  const [cardHistory, setCardHistory] = useState([]);

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

  useEffect(() => {
    if (numMatches === (shuffledDeck.current.length / 2)) {
      // game is over, all matches found
      setIsPlaying(false);
      setButtonLabel('Game Over');
    }
  }, [numMatches]);

  useEffect(() => {
    if (cardHistory.length === 2) {
      // compare new card to existing card for a match
      let oldCard = cardHistory[0];
      let newCard = cardHistory[1];
      if (oldCard.suit === newCard.suit && oldCard.face === newCard.face) {
        setNumMatches(numMatches => numMatches + 1);
      } else {
        // not a match, flip cards back down
        // TODO: this is hacky and I don't like it. game.js should maybe manage faceup state of all cards?
        setTimeout(() => {
          oldCard.setIsFaceup(false);
          newCard.setIsFaceup(false);
        }, 1500);
      }
      //
      // reset history
      setCardHistory([]);
    }
  }, [cardHistory]);

  const clickIncrementor = () => {
    setNumClicks(numClicks + 1);
  };

  const updateCardHistory = (card) => {
    if (cardHistory.length <= 1) {
      setCardHistory(cardHistory => cardHistory.concat(card));
    }
  };

  const buttonHandler = (event) => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    if (isPlaying) {
      // about to pause, set label to resume
      setButtonLabel('Resume');
      setShowOverlay(true);
    } else {
      // about to resume, set label to pause
      setButtonLabel('Pause');
      setShowOverlay(false);
    }
    setIsPlaying(isPlaying => !isPlaying);
  };

  secondsCounter.current = useInterval(() => {
    setNumSeconds(numSeconds => numSeconds + 1);
  }, isPlaying ? 1000 : null);

  const cardFrameClasses = classnames({
    cardframe: true,
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
      <input type='button' className='button' value={buttonLabel} onClick={buttonHandler} disabled={buttonLabel === 'Game Over'} />
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
              updateCardHistory={updateCardHistory}
            />
          );
        })}
        <div className={overlayClasses}></div>
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
    </div>
  );
};

export default Deck;
