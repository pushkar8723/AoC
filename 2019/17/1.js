process.stdin.resume();
process.stdin.setEncoding('utf8');
const intcode = require('../shared/intcode').default;
const map = new WeakMap();

/**
 * Creates a point
 * 
 * @param {Number} x distance from top 
 * @param {*} y distance from left
 */
function point(x, y) {
    this.x = x;
    this.y = y;
    this.toString = () => {
        return `${x},${y}`;
    }
}

const printMap = () => {
    for (let i = 0; i <= 40; i++) {
        for (let j = 0; j <= 50; j++) {
            // console.log(i, j);
            process.stdout.write(map[p(i, j)]);
        }
        process.stdout.write('\n');
    }
}

const p = (x, y) => new point(x, y);

const getPath = (sp, d) => {
    const q = [{ p: sp, d}];
    const directions = {
        'N': ['W', 'E'],
        'S': ['E', 'W'],
        'E': ['N', 'S'],
        'W': ['S', 'N']
    };
    const move = {
        'N': [-1, 0],
        'S': [1, 0],
        'E': [0, 1],
        'W': [0, -1]
    }
    let moves = 0;
    const path = [];
    while (q.length) {
        const curr = q.splice(0, 1)[0];
        const nextPoint = p(curr.p.x + move[curr.d][0], curr.p.y + move[curr.d][1]);
        const left = p(curr.p.x + move[directions[curr.d][0]][0], curr.p.y + move[directions[curr.d][0]][1]);
        const right = p(curr.p.x + move[directions[curr.d][1]][0], curr.p.y + move[directions[curr.d][1]][1]);
        // console.log(curr.p, map[nextPoint], map[right], map[left]);
        if (map[nextPoint] === '#') {
            q.push({
                p: nextPoint,
                d: curr.d
            });
            moves++;
        } else if (map[right] === '#') {
            path.push(moves);
            path.push('R');
            moves = 1;
            q.push({
                p: right,
                d: directions[curr.d][1]
            });
        } else if (map[left] === '#') {
            path.push(moves);
            path.push('L');
            moves = 1;
            q.push({
                p: left,
                d: directions[curr.d][0]
            });
        }
    }
    path.push(moves);
    return path;
}

const findWindow = (str, start) => {
    let i = start + 1;
    while (
        str[i] !== 'A' && str[i] !== 'B' &&
        str.match(new RegExp(str.substring(start, i), 'g')).length > 1) {
        i++;
    }
    return str.substring(start, i - 1);
} 

const pathToInputStr = (path) => {
    let a = findWindow(path, 0);
    path = path.replace(new RegExp(a, 'g'), 'A,');
    a = a.substring(0, a.length - 1);
    const b = findWindow(path, 2);
    path = path.replace(new RegExp(b, 'g'), 'B');
    const c = findWindow(path, 6);
    path = path.replace(new RegExp(c, 'g'), 'C');
    return `${path}\n${a}\n${b}\n${c}\nn\n`;
}

process.stdin.on('data', function (chunk) {
    const input = chunk.toString().split('\n')[0].split(',').map(item => Number(item));
    // Write your code here
    const machine = new intcode(input.slice(0));
    let output = machine.exec(), i = 0, j = 0, sum = 0;
    while (!output.done) {
        const curr = String.fromCharCode(output.value);
        // process.stdout.write(curr, i, j);
        if (output.value === 10) {
            i++;
            j = 0;
        } else {
            map[p(i, j)] = curr;
            j++;
        }
        output = machine.exec();
    }
    let startPoint;
    for (i = 0; i <= 40; i++) {
        for (j = 0; j <= 50; j++) {
            if (
                map[p(i, j)] === '#' &&
                map[p(i - 1, j)] === '#' &&
                map[p(i + 1, j)] === '#' &&
                map[p(i, j - 1)] === '#' &&
                map[p(i, j + 1)] === '#'
            ) {
                sum  += i * j;
                // map[p(i, j)] = 'O';
            } else if (map[p(i, j)] === '^') {
                startPoint = p(i, j);
            }
        }
    }
    // console.log(map);
    // printMap();
    console.log('Part 1 Answer:', sum);
    const path = getPath(startPoint, 'N').slice(1).join(',');
    const inputStr = pathToInputStr(path);
    const inputNum = inputStr.split('').map((item) => item.charCodeAt(0));
    // console.log(inputNum);
    const newInput = input.slice(0);
    newInput[0] = 2
    machine.reset(newInput);
    output = machine.exec();
    i = 0; j = 0;
    while (!output.done) {
        let curr;
        if (output.value >= 0 && output.value <= 256) {
            curr = String.fromCharCode(output.value);
            // process.stdout.write(curr, i, j);
        } else if (output.value) {
            console.log('Part 2 Answer:', output.value);
        }
        if (output.value === 10) {
            i++;
            j = 0;
        } else {
            map[p(i, j)] = curr;
            j++;
        }
        if (output.inputRequired) {
            output = machine.exec(inputNum.splice(0, 1));
        } else {
            output = machine.exec();
        }
    }
});
