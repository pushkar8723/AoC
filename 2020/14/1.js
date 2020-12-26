process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const lines = chunk.toString().split('\n').filter(item => item);
    // Write your code here
    const mem = {};
    let mask;

    const setValue = (loc, value) => {
        let memVal = 0;
        let revMask = mask.split('').reverse();
        for (let i = 0; i < mask.length; i++) {
            if (revMask[i] !== 'X') {
                memVal += parseInt(revMask[i]) * (2 ** i);
            } else {
                memVal += (value % 2) * (2 ** i);
            }
            value = Math.floor(value / 2);
        }
        mem[loc] = memVal;
    }

    lines.forEach(line => {
        const splits = line.split(' = ');
        const action = splits[0];
        const value = splits[1];
        if (action === 'mask') {
            mask = value;
        } else {
            const loc = parseInt(action.replace(/\D/g, ''));
            setValue(loc, value);
            // console.log(mem[loc]);
        }
    });

    const locations = Object.keys(mem);
    let sum = 0;
    locations.forEach(loc => {
        sum += mem[loc];
    });
    console.log(sum);
});
