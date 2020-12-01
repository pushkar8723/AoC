process.stdin.resume();
process.stdin.setEncoding('utf8');
const intcode = require('../shared/intcode').default;

process.stdin.on('data', function (chunk) {
    const line = chunk.toString();
    const input = line.split(',').map(item => Number(item));
    const machine = new intcode(input.slice(0));

    // Part 1
    let output = machine.exec([1]);
    while(!output.done) {
        console.log(output.value);
        output = machine.exec();
    }

    // Part 2
    machine.reset(input.slice(0));
    output = machine.exec([5]);
    while(!output.done) {
        console.log(output.value);
        output = machine.exec();
    }
});

