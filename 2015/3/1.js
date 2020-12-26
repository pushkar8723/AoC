process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const chars = chunk.toString().split('\n').filter(item => item)[0].split('');
    // Write your code here
    const map = new Map();
    map.set('0,0', true);
    const santa = (chars, map) => {
        let x = 0;
        let y = 0;
        chars.forEach(char => {
            if (char === '^') x--;
            else if (char === 'v') x++;
            else if (char === '>') y++;
            else y--;
            map.set(`${x},${y}`, true);
        });
    }
    santa(chars, map);
    console.log(map.size);
    const map2 = new Map();
    map2.set('0,0', true);
    santa(chars.filter((char, index) => index % 2 === 0), map2);
    santa(chars.filter((char, index) => index % 2 === 1), map2);
    console.log(map2.size);
});
