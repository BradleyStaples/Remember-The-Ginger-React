const deckShuffler = () => {
  const faces = ['A', 'K', 'Q', 'J'];
  const suits = ['♥', '♦', '♣', '♠'];
  const colors = {
    '♥': 'red',
    '♦': 'red',
    '♣': 'black',
    '♠': 'black'
  };
  const deck = [];

  faces.forEach((face) => {
    suits.forEach((suit) => {
      deck.push(`${face}${suit}`);
    });
  });

  const doubleDeck = [].concat(deck, deck);
  const shuffledDeck = [];

  while (doubleDeck.length > 0) {
    let index = Math.floor(Math.random() * doubleDeck.length);
    let tempCard = doubleDeck.splice(index - 1, 1).toString();
    let face = tempCard.substr(0, 1);
    let suit = tempCard.substr(1, 1);

    shuffledDeck.push({
      face,
      suit,
      color: colors[suit]
    });
  }

  return shuffledDeck;
};

const cardSpreader = (shuffledDeck) => {

  shuffledDeck.forEach((card, index) => {
    let left = (5 * index) + 'px';
    let deg = (-15 + index) + 'deg';
    let style = {
      left,
      transform: `rotate(${deg})`
    };
    card.style = style;
  });
};

export {
  deckShuffler,
  cardSpreader
};
