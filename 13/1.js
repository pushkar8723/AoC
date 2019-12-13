process.stdin.resume();
process.stdin.setEncoding('utf8');

let board = {};
let grid = [];
let paddlePosition;
let ballPosition;
const intcode = require('../shared/intcode').default;

const printGrid = async () => {
    process.stdout.write('\033c');
    const tiles =[' ', '#', 'X', '_', 'O'];
    for (let j = 0; j < 24; j++) {
        for (let i = 0; i < 42; i++) {
            process.stdout.write(tiles[board[[i, j].toString()]]);
        }
        process.stdout.write('\n');
    }
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 50);
    });
}

const playgame = async (machine) => {
    let output = machine.exec();
    let score = 0;
    while (true) {
        if (!output.done) {
            if (output.inputRequired) {
                await printGrid();
                let input = paddlePosition - ballPosition;
                if (input > 0) {
                    input = -1;
                } else if (input < 0) {
                    input = 1;
                }
                output = machine.exec([input]);
            }
            const x = output.value, y = machine.exec().value, z = machine.exec().value;
            // console.log(x, y, z);
            if (x === -1) {
                score = z;
                // console.log('Score:', score);
            } else {
                board[[x, y].toString()] = z;
                if (z === 3) {
                    paddlePosition = x;
                } else if (z === 4) {
                    ballPosition = x;
                }
            }
            output = machine.exec();
        } else {
            console.log('Score:', score);
            break;
        }
    }
}

process.stdin.on('data', async function (chunk) {
    const input = chunk.toString().split('\n')[0].split(',').map(item => Number(item));
    // Write your code here
    const machine = new intcode(input.slice(0));
    let output;
    while (true) {
        output = machine.exec();
        if (!output.done) {
            let x, y, v;
            x = output.value;
            y = machine.exec().value;
            v = machine.exec().value;
            grid.push({ x, y, v });
        } else {
            break;
        }
    }
    console.log(grid.filter(tile => tile.v === 2).length);

    const inp = input.slice(0);
    inp[0] = 2;
    machine.reset(inp);
    await playgame(machine);
});
