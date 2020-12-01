process.stdin.resume();
process.stdin.setEncoding('utf8');
const intcode = require('../shared/intcode').default;

process.stdin.on('data', function (chunk) {
    const input = chunk.toString().split('\n')[0].split(',').map(item => Number(item));
    // Write your code here
    const robot = new intcode(input.slice(0));
    const direction = {
        'N': ['W', 'E'],
        'S': ['E', 'W'],
        'W': ['S', 'N'],
        'E': ['N', 'S']
    };
    const moves = {
        'N': [0, -1],
        'S': [0, 1],
        'W': [-1, 0],
        'E': [1, 0]
    }
    let i = 0, j = 0, d = 'N', output;
    let pannels = {};
    while(true) {
        const currentColour = pannels[[i, j].toString()] || 0;
        // console.log(i, j, currentColour);
        output = robot.exec([currentColour]);
        if (!output.done) {
            pannels[[i, j].toString()] = output.value;
            output = robot.exec();
            d = direction[d][output.value];
            i += moves[d][0];
            j += moves[d][1];
        } else {
            break;
        }
    }
    // console.log(pannels);
    console.log(Object.keys(pannels).length);

    const robot2 = new intcode(input.slice(0));
    i = 0, j = 0, d = 'N', output;
    let minX = 0, minY = 0, maxX = 0, maxY = 0;
    pannels = {
        '0,0': 1
    };
    while(true) {
        const currentColour = pannels[[i, j].toString()] || 0;
        // console.log(i, j, currentColour);
        output = robot2.exec([currentColour]);
        if (!output.done) {
            pannels[[i, j].toString()] = output.value;
            output = robot2.exec();
            d = direction[d][output.value];
            i += moves[d][0];
            j += moves[d][1];
            minX = Math.min(i, minX);
            minY = Math.min(j, minY);
            maxX = Math.max(i, maxX);
            maxY = Math.max(j, maxY);
        } else {
            break;
        }
    }
    for (j = minY; j <= maxY; j++) {
        for (i = minX; i <= maxX; i++) {
            process.stdout.write(pannels[[i,j].toString()]  === 1? '#' : ' ');
        }
        process.stdout.write('\n');
    }
});
