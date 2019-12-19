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
let shortestPath = Infinity;

const findPath = (sp, d=0, keys = []) => {
    console.log(d, keys.join(''))
    const q = [{
        p: sp,
        d: d,
        k: [...keys]
    }];
    const visited = new Set();
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
            if (c.k.length === keyCount) {
                if (c.d < shortestPath) {
                    shortestPath = c.d;
                }
            } else {
                console.log(c.p, c.d, [...c.k]);
                findPath(c.p, c.d, [...c.k]);
            }
        }

        for (const move of moves) {
            if (map[move] !== '#' && map[move] !== undefined && !visited.has(move.toString())) {
                if (map[move] >= 'A' && map[move] <= 'Z') {
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
    findPath(startPoint);
    console.log(shortestPath);
});
