const crt = require('nodejs-chinese-remainder');
const bignum = require('bignum');

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const lines = chunk.toString().split('\n').filter(item => item);
    // Write your code here
    const timestamp = parseInt(lines[0]);
    const buses = lines[1].split(',').filter(item => item !== 'x').map(item => parseInt(item));
    let min = Infinity;
    let busId;
    buses.forEach(bus => {
        const earliest = Math.floor(timestamp / bus) * bus + bus;
        // console.log(earliest);
        if (earliest < min) {
            min = earliest;
            busId = bus;
        }
    });
    console.log((min - timestamp) * busId);

    const n = [];
    const a = [];
    lines[1].split(',').forEach((bus, index) => {
        if (bus !== 'x') {
            n.push(bignum(bus));
            a.push(bignum((parseInt(bus) - index).toString()));
        }
    });

    // console.log(n.map(i => i.toString()), a.map(i => i.toString()));
    console.log(crt(a, n).toString());
});
