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

const keys = {};

const getAllPoints = (sp) => {
    const q = [sp];
    const visited = new Set();
    while (q.length) {
        const c = q.splice(0, 1)[0];
        visited.add(c.toString());
        if ((map[c] >= 'A' && map[c] <= 'Z') || (map[c] >= 'a' && map[c] <= 'z') || map[c] === '@') {
            keys[map[c]] = c;
        }
        const down = p(c.x + 1, c.y);
        const right = p(c.x, c.y + 1);
        const up = p(c.x - 1, c.y);
        const left = p(c.x, c.y - 1);
        if (map[down] !== '#' && map[down] !== undefined && !visited.has(down.toString())) {
            q.push(down);
        }
        if (map[right] !== '#' && map[right] !== undefined && !visited.has(right.toString())) {
            q.push(right);
        }
        if (map[up] !== '#' && map[up] !== undefined && !visited.has(up.toString())) {
            q.push(up);
        }
        if (map[left] !== '#' && map[left] !== undefined && !visited.has(left.toString())) {
            q.push(left);
        }
    }
}

const getDistance = (a, b) => {
    const q = [{
        p: a,
        d: 0
    }];
    const visited = new Set();
    while (q.length) {
        const c = q.splice(0, 1)[0];
        visited.add(c.p.toString())
        if (c.p.toString() === b.toString()) {
            return c.d;
        }
        const down = p(c.p.x + 1, c.p.y);
        const right = p(c.p.x, c.p.y + 1);
        const up = p(c.p.x - 1, c.p.y);
        const left = p(c.p.x, c.p.y - 1);
        if (map[up] !== '#' && map[up] !== undefined && !visited.has(up.toString())) {
            q.push({
                p: up,
                d: c.d+1
            });
        }
        if (map[down] !== '#' && map[down] !== undefined && !visited.has(down.toString())) {
            q.push({
                p: down,
                d: c.d+1
            });
        }
        if (map[left] !== '#' && map[left] !== undefined && !visited.has(left.toString())) {
            q.push({
                p: left,
                d: c.d+1
            });
        }
        if (map[right] !== '#' && map[right] !== undefined && !visited.has(right.toString())) {
            q.push({
                p: right,
                d: c.d+1
            });
        }
    }
}

const allDist = {};

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
                }
            }
        }
    }
    // console.log(startPoint);
    getAllPoints(startPoint);
    const allKeys = Object.keys(keys);
    for (let i = 0; i < allKeys.length; i++) {
        for (let j = i + 1; j < allKeys.length; j++) {
            const distance = getDistance(keys[allKeys[i]], keys[allKeys[j]]);
            allDist[`${allKeys[i]}${allKeys[j]}`] = distance;
            allDist[`${allKeys[j]}${allKeys[i]}`] = distance;
        }
    }
    console.log(keys);
    console.log(allDist);
});
