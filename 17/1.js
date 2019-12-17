process.stdin.resume();
process.stdin.setEncoding('utf8');
const intcode = require('../shared/intcode').default;
const map = new WeakMap();

/**
 * Creates a point
 * 
 * @param {Number} x distance from top 
 * @param {*} y distance from left
 */
function point(x, y) {
    this.x = x;
    this.y = y;
    this.toString = () => {
        return `${x},${y}`;
    }
}

const printMap = () => {
    for (let i = 0; i <= 40; i++) {
        for (let j = 0; j <= 50; j++) {
            // console.log(i, j);
            process.stdout.write(map[p(i, j)]);
        }
        process.stdout.write('\n');
    }
}

const p = (x, y) => new point(x, y);

process.stdin.on('data', function (chunk) {
    const input = chunk.toString().split('\n')[0].split(',').map(item => Number(item));
    // Write your code here
    const machine = new intcode(input.slice(0));
    let output = machine.exec(), i = 0, j = 0, sum = 0;
    while (!output.done) {
        const curr = String.fromCharCode(output.value);
        // process.stdout.write(curr, i, j);
        if (output.value === 10) {
            i++;
            j = 0;
        } else {
            map[p(i, j)] = curr;
            j++;
        }
        output = machine.exec();
    }
    for (i = 0; i <= 40; i++) {
        for (j = 0; j <= 50; j++) {
            if (
                map[p(i, j)] === '#' &&
                map[p(i - 1, j)] === '#' &&
                map[p(i + 1, j)] === '#' &&
                map[p(i, j - 1)] === '#' &&
                map[p(i, j + 1)] === '#'
            ) {
                sum  += i * j;
                // map[p(i, j)] = 'O';
            }
        }
    }
    // console.log(map);
    // printMap();
    console.log(sum);
});
