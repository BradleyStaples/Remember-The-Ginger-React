import React, { useState } from 'react';

import Page from '../components/page';
import Deck from '../components/deck';
import Footer from '../components/footer';

const IndexPage = () => {

  const [isPlaying, setIsPlaying] = useState(false);
  const [buttonLabel, setButtonLabel] = useState('Start');
  const [showOverlay, setShowOverlay] = useState(false);

  const buttonHandler = (event) => {
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

  return (
    <Page title='Remember The Ginger'>
      <h1 className='center'>Remember the Ginger</h1>
      <p className='desc'>
        A simple matching game. Click a card to reveal it's face and suit. Click two cards in a row with the same face and suit to leave them 'face up' as a match. The objective of the game is to make match all of the cards with as few clicks and as little time as possible.
      </p>
      <input type='button' className='button' value={buttonLabel} onClick={buttonHandler} />
      <Deck
        showOverlay={showOverlay}
      />
      <Footer />
    </Page>
  );
};

export default IndexPage;
