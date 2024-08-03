//need a specific enum for face cards?
interface ICard {
    name: string;
    value: number;
    suit: Suit; 
    color: CardColor;

}
enum Suit {
    clubs,
    diamonds,
    hearts,
    spades
}

enum CardColor {
    black, 
    red
}

const Deck: ICard[] = [
    // Clubs
    { name: '2', value: 2, suit: Suit.clubs, color: CardColor.black },
    { name: '3', value: 3, suit: Suit.clubs, color: CardColor.black },
    { name: '4', value: 4, suit: Suit.clubs, color: CardColor.black },
    { name: '5', value: 5, suit: Suit.clubs, color: CardColor.black },
    { name: '6', value: 6, suit: Suit.clubs, color: CardColor.black },
    { name: '7', value: 7, suit: Suit.clubs, color: CardColor.black },
    { name: '8', value: 8, suit: Suit.clubs, color: CardColor.black },
    { name: '9', value: 9, suit: Suit.clubs, color: CardColor.black },
    { name: '10', value: 10, suit: Suit.clubs, color: CardColor.black },
    { name: 'J', value: 11, suit: Suit.clubs, color: CardColor.black },
    { name: 'Q', value: 12, suit: Suit.clubs, color: CardColor.black },
    { name: 'K', value: 13, suit: Suit.clubs, color: CardColor.black },
    { name: 'A', value: 14, suit: Suit.clubs, color: CardColor.black },

    // Diamonds
    { name: '2', value: 2, suit: Suit.diamonds, color: CardColor.red },
    { name: '3', value: 3, suit: Suit.diamonds, color: CardColor.red },
    { name: '4', value: 4, suit: Suit.diamonds, color: CardColor.red },
    { name: '5', value: 5, suit: Suit.diamonds, color: CardColor.red },
    { name: '6', value: 6, suit: Suit.diamonds, color: CardColor.red },
    { name: '7', value: 7, suit: Suit.diamonds, color: CardColor.red },
    { name: '8', value: 8, suit: Suit.diamonds, color: CardColor.red },
    { name: '9', value: 9, suit: Suit.diamonds, color: CardColor.red },
    { name: '10', value: 10, suit: Suit.diamonds, color: CardColor.red },
    { name: 'J', value: 11, suit: Suit.diamonds, color: CardColor.red },
    { name: 'Q', value: 12, suit: Suit.diamonds, color: CardColor.red },
    { name: 'K', value: 13, suit: Suit.diamonds, color: CardColor.red },
    { name: 'A', value: 14, suit: Suit.diamonds, color: CardColor.red },

    // Hearts
    { name: '2', value: 2, suit: Suit.hearts, color: CardColor.red },
    { name: '3', value: 3, suit: Suit.hearts, color: CardColor.red },
    { name: '4', value: 4, suit: Suit.hearts, color: CardColor.red },
    { name: '5', value: 5, suit: Suit.hearts, color: CardColor.red },
    { name: '6', value: 6, suit: Suit.hearts, color: CardColor.red },
    { name: '7', value: 7, suit: Suit.hearts, color: CardColor.red },
    { name: '8', value: 8, suit: Suit.hearts, color: CardColor.red },
    { name: '9', value: 9, suit: Suit.hearts, color: CardColor.red },
    { name: '10', value: 10, suit: Suit.hearts, color: CardColor.red },
    { name: 'J', value: 11, suit: Suit.hearts, color: CardColor.red },
    { name: 'Q', value: 12, suit: Suit.hearts, color: CardColor.red },
    { name: 'K', value: 13, suit: Suit.hearts, color: CardColor.red },
    { name: 'A', value: 14, suit: Suit.hearts, color: CardColor.red },

    // Spades
    { name: '2', value: 2, suit: Suit.spades, color: CardColor.black },
    { name: '3', value: 3, suit: Suit.spades, color: CardColor.black },
    { name: '4', value: 4, suit: Suit.spades, color: CardColor.black },
    { name: '5', value: 5, suit: Suit.spades, color: CardColor.black },
    { name: '6', value: 6, suit: Suit.spades, color: CardColor.black },
    { name: '7', value: 7, suit: Suit.spades, color: CardColor.black },
    { name: '8', value: 8, suit: Suit.spades, color: CardColor.black },
    { name: '9', value: 9, suit: Suit.spades, color: CardColor.black },
    { name: '10', value: 10, suit: Suit.spades, color: CardColor.black },
    { name: 'J', value: 11, suit: Suit.spades, color: CardColor.black },
    { name: 'Q', value: 12, suit: Suit.spades, color: CardColor.black },
    { name: 'K', value: 13, suit: Suit.spades, color: CardColor.black },
    { name: 'A', value: 14, suit: Suit.spades, color: CardColor.black }
];

function shuffleDeck(deck: ICard[]): ICard[] {
    let shuffledDeck = [...deck];
    for (let i = shuffledDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
    }
    return shuffledDeck;
}
function distributeCards(deck: ICard[], numUsers: number): ICard[][] {
    const shuffledDeck = shuffleDeck(deck);
    const hands: ICard[][] = Array.from({ length: numUsers }, () => []);

    for (let i = 0; i < shuffledDeck.length; i++) {
        hands[i % numUsers].push(shuffledDeck[i]);
    }

    return hands;
}
