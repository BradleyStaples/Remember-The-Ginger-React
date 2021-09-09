import React from 'react';
import classnames from 'classnames';

import Card from './card';
import Scoring from './scoring';
import useWindowSize from './use-window-size';

import { deckShuffler, cardSpreader } from './deck-shuffler';

const Deck = ({ showOverlay }) => {

  let [windowWidth] = useWindowSize();

  let shuffledDeck = deckShuffler();
  cardSpreader(shuffledDeck, windowWidth);

  const overlayClasses = classnames({
    overlay: true,
    hidden: !showOverlay
  });

  return (
    <div>
      <div className='cardframe clearfix'></div>
      <div className='deck'>
        {shuffledDeck.map((card, index) => {
          return (
            <Card
              face={card.face}
              suit={card.suit}
              style={card.style}
              key={`card${index}`}
            />
          );
        })}
      </div>
      <Scoring
      />
      <div className={overlayClasses}></div>
    </div>
  );
};

export default Deck;
