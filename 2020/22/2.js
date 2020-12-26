process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const decks = chunk.toString().split('\n\n').filter(item => item);
    // Write your code here
    const player1 = decks[0].split('\n').filter(item => item).map(i => parseInt(i));
    player1.shift();
    const player2 = decks[1].split('\n').filter(item => item).map(i => parseInt(i));
    player2.shift();

    let game = 1;
    const playGame = (player1, player2) => {
        const seenDecks = new Set();
        // const currGame = game;
        while (player1.length !== 0 && player2.length !== 0) {
            const currDeck = `${player1.join(',')};${player2.join(',')}`;
            // console.log(game, currDeck);
            if (seenDecks.has(currDeck)) {
                return { win: 1, winner: player1 };
            } else {
                seenDecks.add(currDeck);
            }
            const p1 = player1.shift();
            const p2 = player2.shift();
            if (player1.length >= p1 && player2.length >= p2) {
                game++;
                const { win } = playGame(player1.slice(0, p1), player2.slice(0, p2));
                if (win === 1) {
                    player1.push(p1);
                    player1.push(p2);
                } else {
                    player2.push(p2);
                    player2.push(p1);
                }
            } else {
                if (p1 > p2) {
                    player1.push(p1);
                    player1.push(p2);
                } else {
                    player2.push(p2);
                    player2.push(p1);
                }
            }
            // console.log(currGame, `${player1.join(',')};${player2.join(',')}`);
        }

        if (player1.length !== 0) {
            return { win: 1, deck: player1};
        } else {
            return { win: 2, deck: player2};;
        }
    }

    const { deck } = playGame(player1, player2);
    let sum = 0;
    for (let i = deck.length; i > 0; i--) {
        sum += deck[deck.length - i] * i;
    }
    console.log(sum);
});
