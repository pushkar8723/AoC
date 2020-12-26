process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const lines = chunk.toString().split('\n').filter(item => item);
    // Write your code here
    const mem = {};
    let mask;

    const getDecimalValue = (addr) => {
        const bits = addr.split('').map(bit => parseInt(bit));
        let value = 0;
        for (let i = 0; i < bits.length; i++) {
            value += bits[i] * (2 ** i);
        }
        return value;
    }

    const setValue = (loc, value) => {
        let addrs = [''];
        let revMask = mask.split('').reverse();
        for (let i = 0; i < revMask.length; i++) {
            const currBit = loc % 2;
            let newAddr = [];
            if (revMask[i] === 'X') {
                addrs.forEach(addr => {
                    newAddr.push(`${addr}0`);
                    newAddr.push(`${addr}1`);
                });
            } else {
                addrs.forEach(addr => {
                    const bit = currBit || parseInt(revMask[i]);
                    newAddr.push(`${addr}${bit}`);
                });
            }
            addrs = newAddr;
            loc = Math.floor(loc / 2);
        }
        addrs.forEach(addr => {
            mem[getDecimalValue(addr)] = value;
        });
    }

    lines.forEach(line => {
        const splits = line.split(' = ');
        const action = splits[0];
        const value = splits[1];
        if (action === 'mask') {
            mask = value;
        } else {
            const loc = parseInt(action.replace(/\D/g, ''));
            setValue(loc, parseInt(value));
        }
    });

    const locations = Object.keys(mem);
    let sum = 0;
    locations.forEach(loc => {
        sum += mem[loc];
    });
    console.log(sum);
});
