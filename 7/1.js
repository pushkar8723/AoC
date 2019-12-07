process.stdin.resume();
process.stdin.setEncoding('utf8');

const intcode = require('../shared/intcode.js').default;

const permute = (phases, l = 0) => {
    let results = [];
    const r = phases.length;
    if (l === r - 1) {
        results.push(phases);
    } else {
        for (let i = l; i < r; i++) {
            let temp = phases[l];
            phases[l] = phases[i];
            phases[i] = temp;

            results = results.concat(permute(phases.slice(0), l+1));

            temp = phases[l];
            phases[l] = phases[i];
            phases[i] = temp;
        }
    }
    return results;
}

process.stdin.on('data', function (chunk) {
    const line = chunk.toString();
    const input = line.split(",").map(item => Number(item));
    
    // Part 1
    const allPhases = permute([0, 1, 2, 3, 4]);
    let max = 0;
    allPhases.forEach(phase => {
        let signal = 0;
        for (let i = 0; i < 5; i++) {
            const amp = new intcode(input);
            signal = amp.exec([phase[i], signal]).value;
        }
        if (max < signal) {
            max = signal;
        }
    });
    console.log(max);

    // Part 2
    const feedbackPhases = permute([5, 6, 7, 8, 9]);
    max = 0;
    feedbackPhases.forEach(phase => {
        let signal = 0;
        const amp = [
            new intcode(input),
            new intcode(input),
            new intcode(input),
            new intcode(input),
            new intcode(input)
        ];
        for (let i = 0; i < 5; i++) {
            signal = amp[i].exec([phase[i], signal]).value;
        }
        let done = false;
        while(!done) {
            let intermidiateSignal = signal;
            for (let i = 0; i < 5; i++) {
                const opt = amp[i].exec([intermidiateSignal]);
                if (opt.done) {
                    done = opt.done;
                    break;
                } else {
                    intermidiateSignal = opt.value;
                }
            }
            if (!done) {
                signal = intermidiateSignal;
            }
        }
        if (max < signal) {
            max = signal;
        }
    })
    console.log(max);
});
