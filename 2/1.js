process.stdin.resume();
process.stdin.setEncoding('utf8');
const intcode = require('../shared/intcode').default;

process.stdin.on('data', function (chunk) {
    const line = chunk.toString();
    const input = line.split(',').map(item => Number(item));
    const copy = input.slice(0);
    copy[1] = 12;
    copy[2] = 2;
    const machine = new intcode(copy);
    machine.exec();
    console.log(copy[0]);

    for (let i = 0; i <= 99; i++) {
        for (let j = 0; j <= 99; j++) {
            const copy2 = input.slice(0);
            copy2[1] = i;
            copy2[2] = j;
            machine.reset(copy2);
            machine.exec();
            if (copy2[0] === 19690720) {
                console.log(i, j, copy2[0]);
            }
        }
    }
});
