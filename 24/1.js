process.stdin.resume();
process.stdin.setEncoding('utf8');

const iToXY = (i) => ({
        x: Math.floor(i / 5),
        y: i % 5
    });

const XYtoI = (x, y) => {
    if ((x >= 0 && x < 5) && (y >= 0 && y < 5)) {
        return x * 5 + y;
    }
    return -1;
}

const getNext = (current) => {
    const next = [];
    for (let i = 0; i < current.length; i++) {
        const p = iToXY(i);
        const up = { x: p.x - 1, y: p.y };
        const down = { x: p.x + 1, y: p.y };
        const left = { x: p.x, y: p.y - 1 };
        const right = { x: p.x, y: p.y + 1 };
        const neighbours = [up, down, left, right];
        let bugCount = 0;
        for (const neighbour of neighbours) {
            const bug = current[XYtoI(neighbour.x, neighbour.y)];
            if (bug === '#') {
                bugCount++;
            }
        }
        if (current[i] === '#' && bugCount !== 1) {
            next[i] = '.';
        } else if (current[i] === '.' && (bugCount === 1 || bugCount === 2)) {
            next[i] = '#';
        } else {
            next[i] = current[i];
        }
    }
    return next.join('');
}

process.stdin.on('data', function (chunk) {
    const input = chunk.toString().split('\n').join('');
    // Write your code here
    let next = input;
    const moments = new Set();
    while(true) {
        // console.log(next);
        if (moments.has(next)) {
            break;
        }
        moments.add(next);
        next = getNext(next);
    }
    let biodirversity = 0;
    for (let i = 0; i < next.length; i++) {
        if (next[i] === '#') {
            biodirversity += Math.pow(2, i);
        }
    }
    console.log(biodirversity);
});
