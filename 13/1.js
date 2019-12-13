process.stdin.resume();
process.stdin.setEncoding('utf8');

const intcode = require('../shared/intcode').default;



const playgame = (machine, nextInput, internals, initScore) => {
    machine.setInternals(internals);
    let output = machine.exec([ nextInput ]);
    let score = 0;
    while (true) {
        if (!output.done) {
            if (output.inputRequired) {
                const internals = machine.getInternals();
                score = Math.max(
                    playgame(machine, 0, internals, Math.max(initScore, score)),
                    // playgame(machine, 1, internals, Math.max(initScore, score)),
                    // playgame(machine, -1, internals, Math.max(initScore, score))
                );
            } else {
                const x = output.value, y = machine.exec().value, z = machine.exec().value;
                if (x === -1) {
                    score = z;
                    if (score < initScore) {
                        return -1;
                    }
                    console.log('MID:', score);
                } else {
                    console.log(x, y, z);
                }
            }
            output = machine.exec();
        } else {
            console.log('END:', score);
            return score;
        }
    }
}

process.stdin.on('data', function (chunk) {
    const input = chunk.toString().split('\n')[0].split(',').map(item => Number(item));
    // Write your code here
    const machine = new intcode(input.slice(0));
    let output;
    let grid = [];
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
    const internals = machine.getInternals();
    console.log(Math.max(
        playgame(machine, 0, internals, 0),
        // playgame(machine, 1, internals, 0),
        // playgame(machine, -1, internals, 0)
    ));
});
