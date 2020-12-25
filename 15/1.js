process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const input = chunk.toString().split(',').map(item => parseInt(item));
    // Write your code here

    let i;
    const lastSpoken = new Map();
    for (i = 1; i < input.length; i++) {
        lastSpoken.set(input[i - 1], i);
    }

    let spoken = input.slice(-1)[0];

    for (; i < 30000000; i++) {
        // Part 1
        if (i === 2020) {
            console.log(spoken);
        }

        let next;
        if (lastSpoken.has(spoken)) {
            next = i - lastSpoken.get(spoken);
        } else {
            next = 0;
        }
        lastSpoken.set(spoken, i);
        spoken = next;
    }

    // Part 2;
    console.log(spoken);
});
