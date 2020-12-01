const reader = require('readline-sync');
const fs = require('fs');
const path = require('path');
const intcode = require('../shared/intcode').default;
const { asciiConv } = require('../shared/ascii');

const program = fs.readFileSync(path.resolve('input.txt'), 'utf8').split(',').map(item => Number(item));
const machine = new intcode(program.slice(0));

const pathwa = [
    'east',
    'north',
    'north',
    'take spool of cat6',
    'south',
    'east',
    'take mug',
    'north',
    'north',
    'west',
    'take asterisk',
    'south',
    'take monolith',
    'north',
    'east',
    'south',
    'east',
    'take sand',
    'south',
    'west',
    'take prime number',
    'east',
    'north',
    'east',
    'south',
    'take tambourine',
    'west',
    'take festive hat',
    'north',
    'inv'
];

let output = machine.exec();
while(!output.done) {
    if (output.inputRequired) {
        const next = pathwa.splice(0, 1)[0];
        if (next) {
            const input = `${next}\n`;
            output = machine.exec(asciiConv(input));
        } else {
            break;
        }
    } else {
        process.stdout.write(String.fromCharCode(output.value));
        output = machine.exec();
    }
}

const internals = machine.getInternals();

/**
 * Items in your inventory:
    - prime number
    - spool of cat6
    - festive hat
    - monolith
    - mug
    - asterisk
    - sand
    - tambourine
 */
const obj = [
    'spool of cat6', 'mug', 'asterisk', 'monolith',
    'sand', 'prime number', 'tambourine', 'festive hat'
];

const tryCombination = (i, kept=[]) => {
    if (i !== 8) {
        const newObj = [ ...kept, obj[i] ];
        tryCombination(i + 1, newObj);
        tryCombination(i + 1, [...kept]);
    } else {
        const newMachine = new intcode([]);
        newMachine.setInternals(JSON.parse(JSON.stringify(internals)));
        let input = '';
        for (const curr of obj) {
            if (!kept.includes(curr)) {
                input += `drop ${curr}\n`
            }
        }
        input += 'west\n';
        console.log(input, kept, i);
        let asciiInput = asciiConv(input);
        while (!output.done) {
            if (output.inputRequired) {
                if (asciiInput.length) {
                    output = newMachine.exec(asciiInput.splice(0, 1));
                } else {
                    break;
                }
            } else {
                process.stdout.write(String.fromCharCode(output.value));
                output = newMachine.exec();
            }
        }
        if (output.done) {
            console.log('\nCorrect Obj:', kept);
            process.exit();
        }
    }
}

tryCombination(0);