process.stdin.resume();
process.stdin.setEncoding('utf8');

const { powmod } = require('../shared/math');

let totalCards;

const dealIntoNewStack = (pos) => {
    return totalCards - pos - 1;
}

const dealWithIcrement = (pos, n) => {
    return pos * n % totalCards;
}

const cut = (pos, n) => {
    if (n > 0) {
        if (pos >= n) {
            return pos - n;
        } else {
            return totalCards - n + pos;
        }
    } else {
        if (totalCards + n <= pos) {
            return pos - totalCards - n;
        } else {
            return pos - n;
        }
    }
}

const applyShuffle = (lines, position) => {
    lines.forEach(line => {
        if (line.length > 0) {
            if (line.startsWith('deal with increment')) {
                const n = Number(line.split(' ').slice(-1)[0]);
                // console.log('1', line, n);
                position = dealWithIcrement(position, n);
            } else if (line.startsWith('cut')) {
                const n = Number(line.split(' ').slice(-1)[0]);
                // console.log('2', line, n);
                position = cut(position, n);
            } else if (line === 'deal into new stack') {
                // console.log('3', line);
                position = dealIntoNewStack(position);
            } else {
                throw 'WTF!';
            }
            // console.log(line, cards);
        }
    });
    return position;
}

const revDealIntoNewStack = (pos) => {
    return totalCards - pos - 1;
}

const revCut = (pos, n) => {
    // console.log(pos, n, totalCards - n, pos);
    if (n < 0) {
        if (pos < n * -1) {
            return totalCards + n + pos;
        } else {
            return pos + n;
        }
    } else {
        if (totalCards - n <= pos) {
            return pos - totalCards + n;
        } else {
            return pos + n;
        }
    }
}

const revDealWithIcrement = (pos, n) => {
    const modInv = powmod(n, totalCards - 2, totalCards);
    return (modInv * pos) % totalCards;
}

const revShuffle = (lines, position) => {
    lines.reverse().forEach(line => {
        if (line.length > 0) {
            if (line.startsWith('deal with increment')) {
                const n = Number(line.split(' ').slice(-1)[0]);
                // console.log('1', line, n);
                position = revDealWithIcrement(position, n);
            } else if (line.startsWith('cut')) {
                const n = Number(line.split(' ').slice(-1)[0]);
                // console.log('2', line, n);
                position = revCut(position, n);
            } else if (line === 'deal into new stack') {
                // console.log('3', line);
                position = revDealIntoNewStack(position);
            } else {
                throw 'WTF!';
            }
            // console.log(line, cards);
        }
    });
    return position;
}

process.stdin.on('data', function (chunk) {
    const lines = chunk.toString().split('\n');
    // Write your code here
    // for (let i = 0; i < cards.length; i++) {
    //     cards[i] = i;
    // }
    totalCards = 10007;
    console.log(applyShuffle(lines, 2019));
    console.log(revShuffle(lines, 7395));
    // totalCards = 119315717514047;
    // let position = 2020;
    // let i = 0;
    // while (true) {
    //     position = revShuffle(lines, position);
    //     i++;
    //     if (position === 2020) {
    //         break;
    //     }
    // }
    // const times = 101741582076661 % i;
    // for (let i = 0; i < times; i++) {
    //     position = revShuffle(lines, position);
    // }
    // console.log(position);
});
