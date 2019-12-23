process.stdin.resume();
process.stdin.setEncoding('utf8');

const intcode = require('../shared/intcode').default;

process.stdin.on('data', function (chunk) {
    const input = chunk.toString().split('\n')[0].split(',').map(item => Number(item));
    // Write your code here
    const machines = [];
    let nat = {};
    for (let i = 0; i < 50; i++) {
        machines[i] = {
            m: new intcode(input.slice(0)),
            q: [],
            o: null,
            i: i
        };
        machines[i].o = machines[i].m.exec([i]);
    }
    let firstY;
    let lastY;
    while(true) {
        for (const machine of machines) {
            if (machine.o.value) {
                const addr = machine.o.value;
                const x = machine.m.exec().value;
                const y = machine.m.exec().value;
                // console.log(addr, x, y);
                if (addr !== 255) {
                    machines[addr].q.push({ x, y });
                } else {
                    nat = { x, y };
                    if (!firstY) {
                        firstY = y;
                        console.log(firstY);
                    }
                }
                machine.o = machine.m.exec();
            } else if (machine.o.inputRequired) {
                if (machine.q.length) {
                    const c = machine.q.splice(0, 1)[0];
                    machine.o = machine.m.exec([c.x, c.y]);
                } else {
                    machine.o = machine.m.exec([-1]);
                }
            }
        }
        let idle = true;
        for(let i = 0; i < 50 && idle; i++) {
            if (!machines[i].o.inputRequired || machines[i].q.length !== 0) {
                idle = false
            }
        }
        if (idle) {
            machines[0].q.push(nat);
            if (nat.y === lastY) {
                console.log(nat.y);
                process.exit();
            }
            lastY = nat.y;
        }
    }
});
