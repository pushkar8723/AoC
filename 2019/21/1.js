process.stdin.resume();
process.stdin.setEncoding('utf8');

const intcode = require('../shared/intcode').default;
const { asciiConv } = require('../shared/ascii');

process.stdin.on('data', function (chunk) {
    const input = chunk.toString().split('\n')[0].split(',').map(item => Number(item));
    // Write your code here
    const machine = new intcode(input.slice(0));
    let output = machine.exec();
    const sprintScript = asciiConv(
        `NOT A T
        NOT B J
        OR T J
        NOT C T
        OR T J
        AND D J
        WALK
        `);
    while (!output.done) {
        if (output.inputRequired) {
            output = machine.exec(sprintScript.splice(0, 1));
        } else {
            if (output.value >= 0 && output.value < 256) {
                process.stdout.write(String.fromCharCode(output.value));
            } else {
                console.log(output.value);
            }
            output = machine.exec();
        }
    }
    const sprintScript2 = asciiConv(
        `OR A J
        AND B J
        AND C J
        NOT J J
        AND D J
        OR E T
        OR H T
        AND T J
        RUN
        `);
    machine.reset(input.slice(0));
    output = machine.exec();
    while (!output.done) {
        if (output.inputRequired) {
            output = machine.exec(sprintScript2.splice(0, 1));
        } else {
            if (output.value >= 0 && output.value < 256) {
                process.stdout.write(String.fromCharCode(output.value));
            } else {
                console.log(output.value);
            }
            output = machine.exec();
        }
    }
});
