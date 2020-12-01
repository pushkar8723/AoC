process.stdin.resume();
process.stdin.setEncoding('utf8');

const map = new WeakMap();
function point(x, y) {
    this.x = x;
    this.y = y;
    this.toString = () => {
        return `${x},${y}`;
    }
}
const p = (x, y) => new point(x, y);

let keyCount = 0;
let memo = {};
const state = (sp, keys) => `${sp.toString()}:${keys.sort().join('')}`;

const findPath = (sp, keys = [], kc, ignoreDoors = false) => {
    // console.log(d, keys.join(''))
    if (memo[state(sp, keys)]) {
        // console.log('reused!', sp.toString(), keys.join());
        return memo[state(sp, keys)];
    }
    const q = [{
        p: sp,
        d: 0,
        k: [...keys]
    }];
    const visited = new Set();
    let shortestPath = Infinity;
    while (q.length) {
        const c = q.splice(0, 1)[0];
        visited.add(c.p.toString());
        const down = p(c.p.x + 1, c.p.y);
        const right = p(c.p.x, c.p.y + 1);
        const up = p(c.p.x - 1, c.p.y);
        const left = p(c.p.x, c.p.y - 1);
        const moves = [up, down, left, right];

        if (map[c.p] >= 'a' && map[c.p] <= 'z' && !c.k.includes(map[c.p])) {
            c.k.push(map[c.p]);
            if (c.k.length === kc) {
                if (c.d < shortestPath) {
                    shortestPath = c.d;
                }
            } else {
                // console.log(c.p.toString(), c.d, [...c.k].join(''));
                const subPath = findPath(c.p, [...c.k], kc, ignoreDoors);
                if (subPath + c.d < shortestPath) {
                    shortestPath = subPath + c.d;
                }
            }
        }

        for (const move of moves) {
            if (map[move] !== '#' && map[move] !== undefined && !visited.has(move.toString())) {
                if (!ignoreDoors && (map[move] >= 'A' && map[move] <= 'Z')) {
                    if (c.k.includes(map[move].toLowerCase())) {
                        q.push({
                            p: move,
                            d: c.d + 1,
                            k: [...c.k]
                        });
                    }
                } else {
                    q.push({
                        p: move,
                        d: c.d + 1,
                        k: [...c.k]
                    });
                }
            }
        }
    }
    memo[state(sp, keys)] = shortestPath;
    // console.log('saved!', sp.toString(), keys.join());
    return shortestPath;
}

const getAllKeys = (sp) => {
    const q = [sp];
    const visited = new Set();
    const keys = [];
    while(q.length) {
        const c = q.splice(0, 1)[0];
        visited.add(c.toString());

        if (map[c] >= 'a' && map[c] <= 'z') {
            keys.push(map[c]);
        }

        const down = p(c.x + 1, c.y);
        const right = p(c.x, c.y + 1);
        const up = p(c.x - 1, c.y);
        const left = p(c.x, c.y - 1);
        const moves = [up, down, left, right];
        for (const move of moves) {
            if (map[move] !== '#' && map[move] !== undefined && !visited.has(move.toString())) {
                q.push(move)
            }
        }
    }
    return keys;
}

process.stdin.on('data', function (chunk) {
    const lines = chunk.toString().split('\n');
    // Write your code here
    let startPoint;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].length) {
            for (let j = 0; j < lines[i].length; j++) {
                map[p(i, j)] = lines[i][j];
                if (map[p(i, j)] === '@') {
                    startPoint = p(i, j);
                } else if (map[p(i, j)] >= 'a' && map[p(i, j)] <= 'z') {
                    keyCount++;
                }
            }
        }
    }
    console.log(findPath(startPoint, [], keyCount));

    map[p(startPoint.x - 1, startPoint.y - 1)] = '@';
    map[p(startPoint.x - 1, startPoint.y)] = '#';
    map[p(startPoint.x - 1, startPoint.y + 1)] = '@';
    map[p(startPoint.x, startPoint.y - 1)] = '#';
    map[p(startPoint.x, startPoint.y)] = '#';
    map[p(startPoint.x, startPoint.y + 1)] = '#';
    map[p(startPoint.x + 1, startPoint.y - 1)] = '@';
    map[p(startPoint.x + 1, startPoint.y)] = '#';
    map[p(startPoint.x + 1, startPoint.y + 1)] = '@';
    
    memo = {};
    const p1 = p(startPoint.x - 1, startPoint.y - 1);
    const k1 = getAllKeys(p1)
    const m1 = findPath(p1, [], k1.length, true);
    const p2 = p(startPoint.x - 1, startPoint.y + 1);
    const k2 = getAllKeys(p2)
    const m2 = findPath(p2, [], k2.length, true);
    const p3 = p(startPoint.x + 1, startPoint.y - 1);
    const k3 = getAllKeys(p3)
    const m3 = findPath(p3, [], k3.length, true);
    const p4 = p(startPoint.x + 1, startPoint.y + 1);
    const k4 = getAllKeys(p4)
    const m4 = findPath(p4, [], k4.length, true);
    console.log(m1 + m2 + m3 + m4);
});
