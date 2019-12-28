process.stdin.resume();
process.stdin.setEncoding('utf8');

const intcode = require('../shared/intcode').default;
const { asciiConv } = require('../shared/ascii');

const oppDirections = {
    'north': 'south',
    'south': 'north',
    'east': 'west',
    'west': 'east'
};

const processTillNextInput = (machine, input) => {
    let output = machine.exec(input ? asciiConv(`${input}\n`) : null);
    let str = '';
    const retObj = {
        area: null,
        directions: [],
        items: []
    };
    while(!output.done && !output.inputRequired) {
        if (output.value) {
            str += String.fromCharCode(output.value);
            output = machine.exec();
        }
    }
    const lines = str.split('\n').filter(item => item);
    // console.log(lines);
    retObj.area = lines[0];
    let i = 3;
    while(lines[i] && lines[i].startsWith('-')) {
        retObj.directions.push(lines[i].substring(2));
        i++;
    }
    i++;
    while(lines[i] && lines[i].startsWith('-')) {
        retObj.items.push(lines[i].substring(2));
        i++;
    }

    return retObj;
}

const keep = [
    'spool of cat6', 'mug', 'asterisk', 'monolith',
    'sand', 'prime number', 'tambourine', 'festive hat'
];

const dfs = (machine, input) => {
    const node = processTillNextInput(machine, input);
    node.items.forEach(item => {
        if (keep.includes(item)) {
            processTillNextInput(machine, `take ${item}`);
            console.log('Picked:', item);
        }
    });
    node.directions.forEach(dir =>  {
        if (dir !== oppDirections[input]) {
            dfs(machine, dir);
            processTillNextInput(machine, oppDirections[dir]);
        }
    });
    return node;
}

const bfs = (internals, startNode, endPoint) => {
    const q = [{
        node: startNode,
        parentDirection: null,
        internals,
    }];
    while (q.length) {
        const current = q.splice(0, 1)[0];
        if (current.node.area === endPoint) {
            return {
                internals: current.internals,
                dir: current.node.directions.filter(dir => {
                    return dir !== current.parentDirection
                })
            };
        }
        current.node.directions.forEach(dir => {
            if (dir !== current.parentDirection) {
                const machine = new intcode([]);
                machine.setInternals(current.internals);
                const node = processTillNextInput(machine, dir);
                q.push({
                    node,
                    parentDirection: oppDirections[dir],
                    internals: machine.getInternals()
                });
            }
        })
    }
}

const tryCombination = (i, kept=[], internals, dir) => {
    if (i !== 8) {
        const newObj = [ ...kept, keep[i] ];
        tryCombination(i + 1, newObj, internals, dir);
        tryCombination(i + 1, [...kept], internals, dir);
    } else {
        const newMachine = new intcode([]);
        newMachine.setInternals(internals);
        let input = '';
        for (const curr of keep) {
            if (!kept.includes(curr)) {
                input += `drop ${curr}\n`
            }
        }
        input += `${dir}\n`;
        // console.log(input, kept, i);
        let asciiInput = asciiConv(input);
        let output = {};
        let str = '';
        while (!output.done) {
            if (output.inputRequired) {
                if (asciiInput.length) {
                    output = newMachine.exec(asciiInput.splice(0, 1));
                } else {
                    break;
                }
            } else {
                // process.stdout.write(String.fromCharCode(output.value));
                str += String.fromCharCode(output.value);
                output = newMachine.exec();
            }
        }
        if (output.done) {
            console.log('\nCorrect Obj:', kept);
            console.log(str.split('\n').filter(item => item).slice(-3).join('\n'));
            process.exit();
        }
    }
}

process.stdin.on('data', function (chunk) {
    const input = chunk.toString().split('\n')[0].split(',').map(item => Number(item));
    // Write your code here
    const machine = new intcode(input.slice(0));
    const startNode = dfs(machine);
    const securityNode = bfs(machine.getInternals(), startNode, '== Security Checkpoint ==');
    tryCombination(0, [], securityNode.internals, securityNode.dir[0]);
});
