process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const adapters = chunk.toString().split('\n').filter(item => item)
        .map(item => parseInt(item)).sort((a, b) => a - b);
    // Write your code here
    let curr = 0;
    let diff1 = 0;
    let diff3 = 1;
    const diffs = [];
    for (let i = 0; i < adapters.length; i++) {
        if (adapters[i] - curr === 1) {
            // console.log (1, adapters[i]);
            diff1++;
            diffs.push(1);
        } else if (adapters[i] - curr === 3) {
            // console.log (3, adapters[i]);
            diff3++;
            diffs.push(3);
        }
        curr = adapters[i];
    }
    console.log(diff1 * diff3);

    adapters.push(adapters[adapters.length - 1] + 3);
    adapters.unshift(0);
    const numRoutes = new Array(adapters.length);
    numRoutes[adapters[adapters.length - 1]] = 1;

    for (let i = adapters.length - 2; i >= 0; i--) {
        numRoutes[adapters[i]] = 0;
        for (let j = i + 1; j < adapters.length && adapters[j] - adapters[i] <= 3; j++) {
            numRoutes[adapters[i]] += numRoutes[adapters[j]];
        }
    }

    console.log(numRoutes[0]);
});
