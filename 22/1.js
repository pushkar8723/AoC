process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const decks = chunk.toString().split('\n\n').filter(item => item);
    // Write your code here
    const player1 = decks[0].split('\n').filter(item => item).map(i => parseInt(i));
    player1.shift();
    const player2 = decks[1].split('\n').filter(item => item).map(i => parseInt(i));
    player2.shift();
    // console.log(player1, player2);
    while (player1.length !== 0 && player2.length !== 0) {
        const p1 = player1.shift();
        const p2 = player2.shift();
        if (p1 > p2) {
            player1.push(p1);
            player1.push(p2);
        } else {
            player2.push(p2);
            player2.push(p1);
        }
    }

    let winner;
    if (player1.length !== 0) {
        winner = player1;
    } else {
        winner = player2;
    }

    let sum = 0;
    for (let i = winner.length; i > 0; i--) {
        sum += winner[winner.length - i] * i;
    }
    console.log(sum);
});
