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

const emptyLevel = '............?............';

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

const getNeighbours = (grid, level, i) => {
    const current = grid[level];
    const p = iToXY(i);
    const up = XYtoI(p.x - 1, p.y);
    const down = XYtoI(p.x + 1, p.y);
    const left = XYtoI(p.x, p.y - 1);
    const right = XYtoI(p.x, p.y + 1);
    const neighbours = [];

    levelUp = grid[level - 1] || emptyLevel;
    levelDown = grid[level + 1] || emptyLevel;
    if (current[up] === undefined) {
        // Add middle second row element from level above.
        neighbours.push(levelUp[XYtoI(1, 2)]);
    } else if (current[up] === '?') {
        // Add all last row element from level below.
        neighbours.push(levelDown[XYtoI(4, 0)]);
        neighbours.push(levelDown[XYtoI(4, 1)]);
        neighbours.push(levelDown[XYtoI(4, 2)]);
        neighbours.push(levelDown[XYtoI(4, 3)]);
        neighbours.push(levelDown[XYtoI(4, 4)]);
    } else {
        neighbours.push(current[up]);
    }
    
    if (current[down] === undefined) {
        // Add middle fourth row element from level above.
        neighbours.push(levelUp[XYtoI(3, 2)]);
    } else if (current[down] === '?') {
        // Add all first row element from level below.
        neighbours.push(levelDown[XYtoI(0, 0)]);
        neighbours.push(levelDown[XYtoI(0, 1)]);
        neighbours.push(levelDown[XYtoI(0, 2)]);
        neighbours.push(levelDown[XYtoI(0, 3)]);
        neighbours.push(levelDown[XYtoI(0, 4)]);
    } else {
        neighbours.push(current[down]);
    }

    if (current[left] === undefined) {
        // Add middle second column element from level above.
        neighbours.push(levelUp[XYtoI(2, 1)]);
    } else if (current[left] === '?') {
        // Add all last column element from level below.
        neighbours.push(levelDown[XYtoI(0, 4)]);
        neighbours.push(levelDown[XYtoI(1, 4)]);
        neighbours.push(levelDown[XYtoI(2, 4)]);
        neighbours.push(levelDown[XYtoI(3, 4)]);
        neighbours.push(levelDown[XYtoI(4, 4)]);
    } else {
        neighbours.push(current[left]);
    }

    if (current[right] === undefined) {
        // Add middle fourth column element from level above.
        neighbours.push(levelUp[XYtoI(2, 3)]);
    } else if (current[right] === '?') {
        // Add all first column element from level below.
        neighbours.push(levelDown[XYtoI(0, 0)]);
        neighbours.push(levelDown[XYtoI(1, 0)]);
        neighbours.push(levelDown[XYtoI(2, 0)]);
        neighbours.push(levelDown[XYtoI(3, 0)]);
        neighbours.push(levelDown[XYtoI(4, 0)]);
    } else {
        neighbours.push(current[right]);
    }

    return neighbours;
}

const requireLevelUp = (grid, level) => {
    const current = grid[level];
    for (let i = 0; i < current.length; i++) {
        const p = iToXY(i);
        if (current[i] === '#') {
            if (p.x === 0 || p.x === 4 || p.y === 0 || p.y === 4) {
                return true;
            }
        }
    }
    return false;
}

const requireLevelDown = (grid, level) => {
    const current = grid[level];
    const p = { x: 2, y: 2 };
    const up = { x: p.x - 1, y: p.y };
    const down = { x: p.x + 1, y: p.y };
    const left = { x: p.x, y: p.y - 1 };
    const right = { x: p.x, y: p.y + 1 };
    const neighbours = [up, down, left, right];
    for (const neighbour of neighbours) {
        if (current[XYtoI(neighbour.x, neighbour.y)] === '#') {
            return true;
        }
    }
    return false;
}

const getNextRecursive = (grid) => {
    const nextGrid = {};
    const levels = Object.keys(grid).map(item => Number(item)).sort((a, b) => a - b);
    if (requireLevelUp(grid, levels[0])) {
        grid[levels[0] - 1] = emptyLevel;
    }
    if (requireLevelDown(grid, levels.slice(-1)[0])) {
        grid[levels.slice(-1)[0] + 1] = emptyLevel;
    }
    Object.keys(grid).map(item => Number(item)).forEach(level => {
        const next = [];
        const current = grid[level];
        for (let i = 0; i < current.length; i++) {
            const neighbours = getNeighbours(grid, level, i);
            // console.log(neighbours, current[i], i);
            let bugCount = 0;
            for (const neighbour of neighbours) {
                if (neighbour === '#') {
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
        nextGrid[level] = next.join('');
    });
    return nextGrid;
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
    const part2Input = input.split('');
    part2Input[12] = '?'
    let grid = {
        '0': part2Input.join('')
    };

    // grid = {
    //     '0': '##.#..#....#?.#.#.#..#..#',
    //     '1': '######.#.##.?.##...##...#',
    //     '2': '#...##...##.?.##...##...#',
    //     '3': '............?............',
    //     '-1': '.#.#.##..##.?#..##.......',
    //     '-2': '.......#....?............'
    // };
    // console.log(getNextRecursive(grid));
    for (let i = 0; i < 200; i++) {
        grid = getNextRecursive(grid);
    }
    bugCount = 0;
    Object.keys(grid).forEach(level => {
        const current = grid[level];
        for (let i = 0; i < current.length; i++) {
            if (current[i] === '#') {
                bugCount++;
            }
        }
    });
    console.log(bugCount);
});
