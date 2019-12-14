process.stdin.resume();
process.stdin.setEncoding('utf8');

const reactions = {};
let needed = {};
let producing = {}

const findOreCount = (name) => {
    const count = Math.ceil(
        Math.max(0, needed[name] - (producing[name] || 0)) / reactions[name].quantity
    );
    if (producing[name]) {
        producing[name] += count * reactions[name].quantity;
    } else {
        producing[name] = count * reactions[name].quantity;
    }

    const deps = Object.keys(reactions[name].dependencies);
    deps.forEach(dep  => {
        if (needed[dep]) {
            needed[dep] += count * reactions[name].dependencies[dep];
        } else {
            needed[dep] = count * reactions[name].dependencies[dep];
        }
        if (dep !== 'ORE') {
            findOreCount(dep);
        }
    })
}

process.stdin.on('data', function (chunk) {
    const lines = chunk.toString().split('\n');
    // Write your code here
    lines.forEach(line => {
        if (line.length) {
            const parts = line.split(' => ');
            const lhs = parts[0].split(', ');
            const rhs = parts[1].split(' ');
            const outElem = rhs[1];
            reactions[outElem] = {
                quantity: Number(rhs[0]),
                dependencies: {}
            }
            lhs.forEach(item => {
                const part = item.split(' ');
                reactions[outElem].dependencies[part[1]] = Number(part[0]);
            });
        }
    });

    needed['FUEL'] = 1;
    findOreCount('FUEL');
    console.log(needed['ORE']);

    let counter = 1;
    let min, max;
    while(true) {
        needed = {};
        producing = {};
        needed['FUEL'] = counter;
        findOreCount('FUEL');
        // console.log(needed['ORE']);
        if (needed['ORE'] < 1000000000000) {
            min = counter;
            counter *= 2;
        } else if (needed['ORE'] > 1000000000) {
            max = counter;
            counter = Math.floor((min + max)/2);
        }
        console.log(min, max);
        if (min === max) {
            break;
        }
    }
});
