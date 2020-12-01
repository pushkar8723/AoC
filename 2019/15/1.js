process.stdin.resume();
process.stdin.setEncoding('utf8');
const intcode = require('../shared/intcode').default;

function point(x, y) {
    this.x = x;
    this.y = y;
    this.toString = () => {
        return `${x},${y}`;
    }
}

const p = (x, y) => new point(x, y);
const map = new WeakMap();
let minX = 0, minY = 0, maxX= 0, maxY = 0, maxD = 0;;

const revealMap = async (internals) => {
    const q = [];
    const directions = [[0, -1], [0, 1], [-1, 0], [1, 0]];
    q.push({
        p: p(0,0),
        internals,
        d: 0
    });
    while(q.length) {
        const current = q.splice(0, 1)[0];
        for (let i = 1; i <= 4; i++) {
            const machine = new intcode();
            machine.setInternals({
                ...current.internals,
                program: [ ...current.internals.program ]
            });
            const output = machine.exec([i]);
            const newPoint = p(current.p.x + directions[i - 1][0], current.p.y + directions[i - 1][1]);
            if (map[newPoint] === undefined) {
                minX = Math.min(minX, newPoint.x);
                minY = Math.min(minY, newPoint.y);
                maxX = Math.max(maxX, newPoint.x);
                maxY = Math.max(maxY, newPoint.y);
                if (output.value === 0) {
                    map[newPoint] = '#';
                } else if (output.value === 1) {
                    map[newPoint] = ' ';
                    q.push({
                        p: newPoint,
                        internals: machine.getInternals(),
                        d: current.d + 1
                    });
                } else if (output.value === 2) {
                    map[newPoint] = 'X';
                    q.push({
                        p: newPoint,
                        internals: machine.getInternals(),
                        d: current.d + 1
                    });
                    console.log("Found X at distance:", current.d + 1, '\nAt position:', newPoint.toString());
                }
            }
        }
        // Comment out the line below to see the
        // anser for first part :P 
        await printMap(true);
    }
}

const fillMap = () => {
    const q = [];
    const directions = [[0, -1], [0, 1], [-1, 0], [1, 0]];
    q.push({
        p: p(-20, 14),
        d: 0
    });
    const visited = new Set();
    while(q.length) {
        const current = q.splice(0, 1)[0];
        visited.add(current.p.toString());
        for (let i = 0; i < 4; i++) {
            const newPoint = p(current.p.x + directions[i][0], current.p.y + directions[i][1]);
            if (!visited.has(newPoint.toString())) {
                if (map[newPoint] !== '#') {
                    q.push({
                        p: newPoint,
                        d: current.d + 1
                    });
                    maxD = Math.max(maxD, current.d + 1);
                }
            }
        }
    }
}

const printMap = async (clear) => {
    if (clear) {
        process.stdout.write('\033c');
    }
    for (let i = minX; i <= maxX; i++) {
        for (let j = minY; j <= maxY; j++) {
            process.stdout.write(map[p(i, j)] || '?');
        }
        process.stdout.write('\n');
    }
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 50);
    });
}

process.stdin.on('data', async function (chunk) {
    const input = chunk.toString().split('\n')[0].split(',').map(item => Number(item));
    // Write your code here
    map[p(0,0)] = '^';
    const machine = new intcode(input.slice(0));
    await revealMap(machine.getInternals());
    await printMap();
    maxD = 0;
    fillMap();
    console.log(maxD);
});
