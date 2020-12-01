process.stdin.resume();
process.stdin.setEncoding('utf8');
const intcode = require('../shared/intcode').default;

process.stdin.on('data', function (chunk) {
    const input = chunk.toString().split('\n')[0].split(',').map(item => Number(item));
    // Write your code here
    // Part 1
    const machine = new intcode([...input]);
    let output = machine.exec([1]);
    while (!output.done) {
        console.log(output.value);
        output = machine.exec();
    }

    // Part 2
    machine.reset([...input]);
    output = machine.exec([2]);
    while (!output.done) {
        console.log(output.value);
        output = machine.exec();
    }
});
