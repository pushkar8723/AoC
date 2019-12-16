process.stdin.resume();
process.stdin.setEncoding('utf8');

const calcPhase = (input, phase) => {
    output = '';
    for (let i = 1; i <= input.length; i++) {
        let sum = 0;
        for (let j = 1; j <= input.length; j++) {
            let currPhase = (Math.ceil((j + 1) / i) % phase.length) - 1;
            currPhase = (currPhase === -1 ? phase.length - 1 : currPhase);
            sum += input[j - 1] * phase[currPhase];
            // process.stdout.write(` + ${input[j - 1]}*${phase[currPhase]}`);
        }
        output += sum.toString().slice(-1);
        // process.stdout.write('\n');
    }
    return output;
}

const calcLastSum = (input) => {
    let sum = 0;
    let output = '';
    for (let i = 0; i < input.length; i++) {
        sum += input[i];
        output += Number(sum % 10);
    }
    // console.log(output);
    return output;
}

process.stdin.on('data', function (chunk) {
    const input = chunk.toString().split('\n')[0];
    // Write your code here
    const phase = [ 0, 1, 0, -1];
    let nextInput = input;
    for (let i = 0; i < 100; i++) {
        nextInput = calcPhase(nextInput.split('').map(item => Number(item)), phase);
        // console.log(i, nextInput);
    }
    console.log(nextInput.slice(0, 8))

    let part2Input = '';
    for (let i = 0; i < 10000; i++) {
        part2Input += input;
    }
    part2Input = part2Input.slice(Number(part2Input.slice(0,7)));
    part2Input = part2Input.split('').reverse().join('');
    nextInput = part2Input;
    for(let i = 0; i < 100; i++) {
        nextInput = calcLastSum(nextInput.split('').map(item => Number(item)));
    }
    console.log(nextInput.split('').reverse().join('').slice(0, 8));
});
