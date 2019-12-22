const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/input.txt');

const data = fs.readFileSync(filePath, { encoding: 'utf8' });

const lines = data.match(/[^\r\n]+/g);

const CARD_COUNT = 10007;

class Deck {
    constructor (cardCount) {
        this.cards = [];

        for (let i = 0; i < cardCount; i++) {
            this.cards[i] = i;
        }
    }

    dealIntoNewStack() {
        this.cards = this.cards.reverse();
    }

    dealWithIncrement(inc) {
        let newDeck = Array(this.cards.length);

        for (let i = 0, len = this.cards.length; i < len; i++) {
            newDeck[(i * inc) % len] = this.cards[i];
        }

        this.cards = newDeck;
    }

    cut(amount) {
        if (amount > 0) {
            let cutCards = this.cards.splice(0, amount);

            this.cards = this.cards.concat(cutCards);
        } else if (amount < 0) {
            let cutCards = this.cards.splice(this.cards.length - Math.abs(amount));

            this.cards = cutCards.concat(this.cards);
        }
    }
}

let deck = new Deck(CARD_COUNT);

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    if (line == 'deal into new stack') {
        deck.dealIntoNewStack();
        continue;
    }

    let incrementMatch = /deal with increment (\d+)/.exec(line);

    if (incrementMatch) {
        deck.dealWithIncrement(parseInt(incrementMatch[1]));
        continue;
    }

    let cutMatch = /cut (-?\d+)/.exec(line);

    if (cutMatch) {
        deck.cut(parseInt(cutMatch[1]));
    }
}

console.log(deck.cards.indexOf(2019));
