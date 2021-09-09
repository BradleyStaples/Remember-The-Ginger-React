// contain within an IIFE to keep namespace clean. It's the nice thing to do!
(function () {
  // card object to hold each card's data
  // @id : # from 1-32
  // @face : 1 char string containing one of the following: AKQJ
  // @suit : 1 char string containing one of the following: ♥♦♣♠
  var Card = function (id, face, suit) {
    this.cardNum = id;
    this.face = face;
    this.suit = suit;
  };

  // jquery event bindings
  var bindings = {
    // bind the start button to start the game
    clickButton: function () {
      // call stackCards to spread the cards out for their initial appearance
      events.stackCards();
      // bind the button
      elements.button.click(function () {
        // when button is first clicked, game starts. show the cardframe and then initialize the game
        elements.cardFrame.show();
        events.init();
        // after the game is started, the button is rebound as a pause/resume button.
        $(this).unbind("click").val("Pause").click(function () {
          // once rebound, all future clicks cause pause() which will either pause or resume
          events.pause();
        })
      })
    },
    // bind the click events for all faceup cards
    clickCard: function () {
      // build the jquery selector from .card plus the default facedown class
      var klass = ".card." + data.classFacedown;
      elements.cardFrame.delegate(klass, "click", function () {
        // all faceup cards clicked pass their jquery selector into flipCardUp()
        events.flipCardUp($(this));
      });
    }
  }

  // game data objects
  var data = {
    // boolean flag to prevent certain actions when another card is animating
    animating: false,
    // class value for both faceup and facedown cards, also used in CSS
    classFacedown: "facedown",
    classFaceup: "faceup",
    // history : an array of cards that have been clicked but not yet matched/flipped back facedown
    // this is constantly added to as well as removed from
    history: [],
    // three counting variables to hold the number of player clicks, matches, and seconds passed in game (while not paused)
    numberOfClicks: 0,
    numberOfMatches: 0,
    numberOfSeconds: 0,
    // boolean flag to determine if game should be paused/resumed when pause/resume button is clicked
    paused: true,
    // timer is just used as an holder for a setInterval to use clearInterval against
    timer: null,
    // deck is function that builds an array of 32 cards in a random order to be used for the game
    deck: function () {
      // template is a string template to be used for each card
      // adds in the standard facedown class plus a placeholder for {{id}} which will be replaced with a number from 1-32
      // used simple string instead of template library as it's the only template usage and didn't want the extra kb for one usage
      var template = '<div class="card ' + data.classFacedown + '" id="card{{id}}"><div class="cardback"></div><div class="cardfront"><span class="face"></span><span class="suit"></span></div></div>',
        // deck will hold each of 16 cards to be created from 4 suits and 4 faces, in order
        deck = [],
        // doubledeck will hold 32 cards (since you need 2 of same card to match), basically 2 * deck
        doubleDeck = [],
        // shuffled deck takes all of the cards from doubleDeck but randomizes the order
        shuffledDeck = [],
        // four playing card faces (Ace,King,Queen,Jack) - e.g., the facecards
        faces = ['A', 'K', 'Q', 'J'],
        // four playing card suits (hearts, diamonds, clubs, spades)
        suits = ['♥', '♦', '♣', '♠'],
        // cache the length of both faces & suits arrays
        flen = faces.length,
        slen = suits.length,
        // cardsToShuffle will hold a number 1-32 as each card is decremented
        cardsToShuffe = 0,
        // index holds an array index, tempCard holds an array value, both used in shuffling
        index = null,
        tempCard = null;
      // go through each face & suit value and combine them into a two character string for 16 unique cards
      for (var f = 0; f < flen; f++) {
        for (var s = 0; s < slen; s++) {
          deck.push(faces[f] + suits[s]);
        }
      }
      // duplicate each of the 16 cards once so there are available matches
      doubleDeck = doubleDeck.concat(deck, deck);
      // cardsToShuffle will start at 32 and decrement downards
      cardsToShuffe = doubleDeck.length;
      // while there are still card strings in doubleDeck
      while (cardsToShuffe > 0) {
        // index equals a randomized number from 0-31, where 31 changes to # of cards minus 1 in each iteration
        index = Math.floor(Math.random() * cardsToShuffe);
        // tempcard holds the 2-digit string value from the array at that index
        // note that splice() removes that array entry from doubleDeck in the process (thus changing array's length)
        tempCard = doubleDeck.splice(index - 1, 1).toString();
        // add the templated card HTML (with new ID replaced with current cardsToShuffle value) in the intial game deck container
        elements.deck.append(template.replace('{{id}}', cardsToShuffe));
        // created a new Card object based off card number and face/suit values
        // and then insert that object directly into the shuffledDeck array
        shuffledDeck.push(new Card(cardsToShuffe, tempCard.substr(0, 1), tempCard.substr(1, 1)));
        // get the new length of the doubleDeck which will be one less due to the splice() call above
        cardsToShuffe = doubleDeck.length;
      }
      // memoize the deck to cache it. this means that the data.deck function will only be created once
      // and all future calls to it will simply return the calcuated shuffleDeck array
      this.deck = shuffledDeck;
      return shuffledDeck;
    }
  }

  // jquery selector caching to prevent requerying dom, most are straightforward
  var elements = {
    button: $(".button"),
    // card takes a parameter to find the specific card
    // @cardID : number from 1-32, corresponds with Card object's cardNum property
    card: function (cardID) {
      return $("#card" + cardID);
    },
    cardFrame: $(".cardframe"),
    clicks: $(".score .clicks"),
    clock: $(".score .time"),
    deck: $(".deck"),
    matches: $(".score .matches"),
    overlay: $(".overlay"),
    stats: $(".score .stats")
  };

  // event type actions, not all are directly player controlled
  var events = {
    // end is called after all matches have been made
    end: function () {
      // clear the timer so no more seconds are added to the stats area
      clearInterval(data.timer);
      // remove the button. game is over, no longer needed.
      // in the future should this be made to 'restart' via refresh or other means?
      elements.button.remove();
      // although none should exist at this point, double try to remove any existing titles and unbind all card click events
      $(".cardframe .card").attr("title", "").unbind("click");
      // calculate the clicks per second and click-to-match ratio and display them
      var stats = ((data.numberOfMatches / data.numberOfClicks) * 100).toFixed(2) + "% click-to-match &nbsp; | &nbsp; ";
      stats += (data.numberOfClicks / data.numberOfSeconds).toFixed(1) + " clicks per second";
      elements.stats.html(stats);
    },
    // flipCardsDown turns the two faceup cards back to facedown
    flipCardsDown: function () {
      // make sure no animations are firing and that there are at least 2 cards in history
      if (!data.animating && data.history.length >= 2) {
        // set animation flag to true to prevent other concurrent actions
        data.animating = true;
        // for 0-1 (first and second array entries), meaning the older two flipped up cards that aren't matched
        for (var i = 0; i <= 1; i++) {
          // pass the cardNum value into elements.card() to get that jquery selector
          // and then remove the faceup class and any red/black color classes (for red/black card suits),
          // re-add the facedown class and reset the title
          elements.card(data.history[i].cardNum)
            .removeClass(data.classFaceup).removeClass("red").removeClass("black")
            .addClass(data.classFacedown).attr("title", "Click to flip");
        }
        // set animation flag to false to prevent action locking
        data.animating = false;
        // set a small timeout (roughly 1/4 the value of the timeout used to call flipCardsDown()
        // to remove the card's suit & text from HTML. this prevents cheat. must use timeout
        // or the numbers disapear before the card finishes turning over to facedown
        setTimeout(events.removeCardText, 250);
      }
    },
    // flipCardUp flips a single card to its faceup side upon a player clicking a card
    // $card is a jquery reference to the snippet of code referencing the card they clicked
    flipCardUp: function ($card) {
      console.log(data.history)
      // get the numeric portion of the card's ID and use it to reference the card's actual object in data.deck
      var cardID = $card.attr("id").toString().replace("card", ""),
        card = utility.getCard(cardID),
        // color is black or red depending on card's suit (checked below)
        color = "black",
        // s is used to show s/es for plural stats and no s/es for singular stats
        s = "";
      // make sure no other animations are happening
      if (!data.animating) {
        // set animation flag to true to prevent other concurrent actions
        data.animating = true;
        // add this card to the data.history array to keep track of it
        // to compare with next card for matching and to flip back facedown if not a match
        data.history.push(card);
        // if suit is a heart or diamond, color should be red instead of black
        if (card.suit === '♥' || card.suit === '♦') { color = "red"; }
        // remove the facedown class and add the faceup + color class, and remove title tooltip telling player to click
        // also insert the card's face & suit value into the HTML so player knows what card this is
        $card.removeClass(data.classFacedown).addClass(data.classFaceup).addClass(color).attr("title", "")
          .find(".face").text(card.face).end()
          .find(".suit").text(card.suit);
        // call the compare function. if two (or more) cards are faceup it will keep track and match cards 2 by 2
        utility.compare();
        // incremement the number of player clicks
        data.numberOfClicks++;
        // check both clisk and matches for single (1) or non single, and add s/es as needed
        // then update to most recent number
        s = (data.numberOfClicks === 1) ? '' : 's';
        elements.clicks.text(data.numberOfClicks + " click" + s);
        s = (data.numberOfMatches === 1) ? '' : 'es';
        elements.matches.text(data.numberOfMatches + " match" + s);
        // set animation flag to false to prevent action locking
        data.animating = false;
      }
    },
    // initialize the game after player clicks 'start' button
    init: function () {
      // cache data.deck's length
      var dlen = data.deck.length;
      // loop through each card in data.deck
      for (var i = 0; i < dlen; i++) {
        // set a title tooltip telling player to click to flip cards
        // and reset the css from stackCards() to no rotation, top, or left values
        // and move from the deck HTML container to the cardFrame HTML container
        elements.card(data.deck[i].cardNum).attr("title", "Click to flip")
          .css({
            "top": 0,
            "left": 0,
            '-moz-transform': 'rotate(0deg)',
            '-webkit-transform': 'rotate(0deg)',
            '-o-transform': 'rotate(0deg)',
            '-ms-transform': 'rotate(0deg)'
          }).appendTo(elements.cardFrame);
      }
      // remove the deck HTML snippet, no longer needed
      elements.deck.removeClass();
      // now that cardFrame is being shown, adjust the width/height & position of overlay to match.
      // note that it's not yet being shown, just setup for when it might be shown later (on pause button click)
      utility.adjustOverlay();
      // bind cards to click event to flip face up
      bindings.clickCard();
      // call pause. this actually 'resumes' the game for the first time
      // changing the wording of the button to say 'pause' for future clicks and starting game clock timer
      events.pause();
    },
    // pause event runs whenever player clicks pause/resume button, and during events.init()
    pause: function () {
      // check to see if game is currently running or paused
      if (data.paused) {
        // if currently paused, resume gameplay (renew timers, hide overlay, change button value)
        data.timer = setInterval(events.updateClock, 1000);
        elements.overlay.hide();
        elements.button.val("Pause");
      } else {
        // if currently active, pause gameplay (halt timers, display overlay, change button value)
        clearInterval(data.timer);
        elements.overlay.fadeTo(200, .75);
        elements.button.val("Resume");
      }
      // set paused to not paused, or not paused to paused (inverts value)
      data.paused = !data.paused;
    },
    // removes card's suit & face values from HTML to prevent cheating
    removeCardText: function () {
      // make sure there are at least two cards in the data.history array
      if (data.history.length >= 2) {
        // iterate a for loop two times. 'i' variable not really used here
        for (var i = 0; i < 2; i++) {
          // remove the suit & face value from this card's HTML, using 0 for index
          // because after the shift() call on next line the next card will still be
          // 0 after the for loop iterates (since the previous 0 has been removed)
          elements.card(data.history[0].cardNum)
            .find(".face").text("").end()
            .find(".suit").text("");
          data.history.shift();
        }
      }
    },
    // display cards in the 'spread hand' style after page load before game is started
    stackCards: function () {
      // cache the number of cards in deck, set up a base position for left values (baseleft, somewhat arbitary)
      // and create variables for future left, top, and degrees values
      var dlen = data.deck.length,
        baseleft = ($(window).width() / 2) - 150,
        left = "",
        top = ""
      deg = "";
      for (var i = 0; i < dlen; i++) {
        // left increases by 5px per card to give them 'spread' out look
        left = baseleft + (5 * i) + "px";
        // each card is angled in a circular arc. starts at -15degrees and then
        // increments by +1 till the last card is at +16 degrees
        deg = (-15 + i) + "deg";
        // the rotation by itself makes the cards look like a diagonal line. using 205 as a base point (arbitary)
        // and some 'clever' math that makes the first cards stick up higher, it makes the layout look more like
        // a real life circular spread of cards
        top = (205 + Math.floor((dlen - i) / 3)) + "px"
        // apply the calculate data to the each card's CSS
        elements.card(data.deck[i].cardNum).css({
          'left': left,
          'top': top,
          '-moz-transform': 'rotate(' + deg + ')',
          '-webkit-transform': 'rotate(' + deg + ')',
          '-o-transform': 'rotate(' + deg + ')',
          '-ms-transform': 'rotate(' + deg + ')'
        });
      }
    },
    // setInterval calls this once per second
    updateClock: function () {
      // called each second of active game play, increments seconds of gameplay
      data.numberOfSeconds++;
      // determine if value = 1 to not show 's' or any other value to show 's' after second(s)
      var s = (data.numberOfSeconds === 1) ? "" : "s";
      // display the updated data
      elements.clock.text(data.numberOfSeconds + " second" + s);
    }
  }

  // utility helper functions, not necessarily based upon an event
  var utility = {
    adjustOverlay: function () {
      // the overlay has basic styles in css/style.css, but javascript is needed to determine position.
      // just to be safe I recalcuate the width/height of 'card frame' as well in case some css styles aren't acurate
      // this overlay will be hidden/shown when game is paused/restarted, respectively
      var cf = elements.cardFrame,
        p = cf.offset();
      elements.overlay.css({
        "width": cf.width() + "px",
        "height": cf.height() + "px",
        "top": p.top + "px",
        "left": p.left + "px"
      });
    },
    // compare the two next cards in the history stack
    compare: function () {
      // make sure at least two cards exist in the history stack. no need to compare if only one
      // card turned up or if they just flipped back over (and thus removed themselves from history)
      if (data.history.length >= 2) {
        // cache the first and second cards from beginning. done this way in case player clicks cards
        // more rapidly than the setTimeout function below, so the 'oldest' two cards that have been
        // flipped over are the ones being compared
        var prev = data.history[0],
          curr = data.history[1];
        // compare both the suit and the face of the two cards to see if they are a match
        if (prev.suit === curr.suit && prev.face === curr.face) {
          // cards are a match. increment # of matches made
          data.numberOfMatches++;
          // unbind the click event for these two cards and remove instructions from title tooltip
          elements.card(prev.cardNum).unbind("click").attr("title", "");
          elements.card(curr.cardNum).unbind("click").attr("title", "");
          // remove these two matched cards from history stack
          data.history.shift();
          data.history.shift();
          // if all cards are matched, end the game. since 1 match is 2 cards divide # of cards by 2
          if (data.numberOfMatches === (data.deck.length / 2)) {
            events.end();
          }
        } else {
          // cards did not match. need to flip them back over, but give player enough time
          // to see what the second card is, so use a timeout. arbitary 1000 (1 second) timeout
          // but if this is modified it might affect a timeout within events.flipCardsDown()
          setTimeout(events.flipCardsDown, 1000);
        }
      }
    },
    // helper function to get the card object based off the Card.cardNum or the id from jquery selector
    // @cardID : number from 1-32, based off jquery Card selector and/or Card.cardNum (same value for corresponding card)
    getCard: function (cardID) {
      // cache the length of the array of cards from the deck
      var dlen = data.deck.length;
      // loop through each card
      for (var i = 0; i < dlen; i++) {
        // since each array value is a card object, compare cardID against the Card.cardNum value
        if (data.deck[i].cardNum == cardID) {
          // return the matching array value which is the card object
          return data.deck[i];
        }
      }
    }
  }
  // prime deck. due to how it's memoized, the first call requires
  // parenthesees but subsequent calls will not. this makes all other calls
  // cleaner with only data.deck[.length] with no () needed
  // after priming the deck, call the function to bind the 'Start' button
  var throwaway = data.deck();
  bindings.clickButton();
})();
