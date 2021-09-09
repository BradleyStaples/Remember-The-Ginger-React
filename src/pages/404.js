import React, { useRef } from 'react';
import { Link } from 'gatsby';

import Page from '../components/page';
import StaticCard from '../components/static-card';
import Footer from '../components/footer';
import { deckShuffler, cardSpreader } from '../components/deck-shuffler';

const NotFoundPage = () => {
  const shuffledDeck = useRef();

  if (!shuffledDeck.current) {
    // store the deck in a ref so it only gets shuffled once, not once per render
    shuffledDeck.current = deckShuffler();
    cardSpreader(shuffledDeck.current);
  }

  return (
    <Page title='Not Found | Remember The Ginger'>
      <h1>Remember The Ginger</h1>
      <p>This is not the page you are looking for.</p>
      <div className='deck'>
        {shuffledDeck.current && shuffledDeck.current.map((card, index) => {
          return (
            <StaticCard
              style={card.style}
              key={`static-card-${index}`}
            />
          );
        })}
      </div>
      <p>View the <Link to='/'>game</Link></p>
      <Footer />
    </Page>
  )
};

export default NotFoundPage;
