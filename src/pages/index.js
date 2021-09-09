import React from 'react';

import Page from '../components/page';
import Game from '../components/game';
import Footer from '../components/footer';

const IndexPage = () => {

  return (
    <Page title='Remember The Ginger'>
      <h1 className='center'>Remember the Ginger</h1>
      <p className='desc'>
        A simple matching game. Click a card to reveal it's face and suit. Click two cards in a row with the same face and suit to leave them 'face up' as a match. The objective of the game is to make match all of the cards with as few clicks and as little time as possible.
      </p>
      <Game />
      <Footer />
    </Page>
  );
};

export default IndexPage;
