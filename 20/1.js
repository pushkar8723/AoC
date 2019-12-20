process.stdin.resume();
process.stdin.setEncoding('utf8');

let maxX, maxY;
const { map, p } = require('../shared/map');
const portals = {};

const mapAllPortals = () => {
    for (let i = 0; i < maxX; i++) {
        for (let j = 0; j < maxY; j++) {
            const curr = p(i, j);
            if (map[curr].length === 2) {
                if (portals[map[curr]]) {
                    portals[map[curr]].push(curr);
                } else {
                    portals[map[curr]] = [curr];
                }
            }
        }
    }
}

const getPortalKey = (portal, p) => {
    return (p.x === 0 || p.y === 0 || p.x === maxX - 1 || p.y === maxY - 1)
        ? `${portal}B`
        : `${portal}O`;
}

const bfs = (sp) => {
    const q = [{
        p: sp,
        d: 0
    }];
    const dists = {};
    const visited = new Set();
    while(q.length) {
        const curr = q.splice(0, 1)[0];
        visited.add(curr.p.toString());
        if (map[curr.p].length === 2 && curr.p !== sp) {
            dists[getPortalKey(map[curr.p], curr.p)] = curr.d;
        }

        const up = p(curr.p.x - 1, curr.p.y);
        const down = p(curr.p.x + 1, curr.p.y);
        const left = p(curr.p.x, curr.p.y - 1);
        const right = p(curr.p.x, curr.p.y + 1);
        const moves = [up, down, left, right];

        for (const move of moves) {
            if (
                map[move] !== ' ' && map[move] !== undefined &&
                map[move] !== '#' && !visited.has(move.toString())
            ) {
                q.push({
                    p: move,
                    d: curr.d + 1
                });
            }
        }
    }
    return dists;
}

const graph = {};

const getOtherEnd = (portal) => {
    if (portal.substring(0, 2) === 'AA' || portal.substring(0, 2) === 'ZZ') {
        return portal;
    }
    return `${portal.substring(0, 2)}${portal.substring(2) === 'B' ? 'O' : 'B'}`;
}

const getMinDistance = (start, end, visited = []) => {
    const edges = graph[start];
    let minDistance = Infinity;
    visited.push(start);
    Object.keys(edges).forEach(edge => {
        if (!visited.includes(edge)) {
            if (edge === end) {
                if (edges[edge] < minDistance) {
                    minDistance = edges[edge];
                }
            } else {
                const distance = edges[edge] + getMinDistance(getOtherEnd(edge), end, [...visited, edge]) + 1;
                if (distance < minDistance) {
                    minDistance = distance;
                }
            }
        }
    });
    return minDistance;
}

const isValidEdge = (e, level) => {
    // console.log(e.substring(0, 2));
    if (e.substring(0, 2) !== 'AA' && e.substring(0, 2) !== 'ZZ') {
        return true;
    } else {
        if (level === 0) {
            return true;
        }
    }
    return false;
}

const getMinDistance2 = (start, end) => {
    const q = [{
        p: start,
        level: 0,
        d: 0
    }];
    const visited = new Set();
    while(q.length) {
        const curr = q.splice(0, 1)[0];
        // console.log(curr);
        visited.add(`${curr.p}${curr.level}`);
        const edges = graph[curr.p];
        Object.keys(edges).forEach(edge => {
            if (isValidEdge(edge, curr.level) && !visited.has(`${edge}${curr.level}`)) {
                if (edge === end && curr.level === 0) {
                    console.log(curr.d + edges[edge]);
                    process.exit();
                } else {
                    const nextLevel = edge.substring(2) === 'B' ? curr.level - 1 : curr.level + 1;
                    if (nextLevel >= 0) {
                        q.push({
                            p: getOtherEnd(edge),
                            level: nextLevel,
                            d: curr.d + edges[edge] + 1
                        });
                    }
                }
            }
        });
    }
}

process.stdin.on('data', function (chunk) {
    const lines = chunk.toString().slice(0, -1).split('\n');
    // Write your code here
    maxX = lines.length - 4;
    maxY = lines[0].length - 4;
    for (let i = 2; i < lines.length - 2; i++) {
        for (let j = 2; j < lines[i].length - 2; j++) {
            const topLeft = p(i - 1, j - 1);
            const topRight = p(i - 1, j + 1);
            const bottomLeft = p(i + 1, j - 1);
            const bottomRight = p(i + 1, j + 1);
            if (lines[i][j] === '.') {
                if (lines[topLeft.x][topLeft.y] === ' ' && lines[topRight.x][topRight.y] === ' ') {
                    map[p(i - 2, j - 2)] = `${lines[i - 2][j]}${lines[i - 1][j]}`;
                } else if (lines[topLeft.x][topLeft.y] === ' ' && lines[bottomLeft.x][bottomLeft.y] === ' ') {
                    map[p(i - 2, j - 2)] = `${lines[i][j - 2]}${lines[i][j - 1]}`;
                } else if (lines[bottomLeft.x][bottomLeft.y] === ' ' && lines[bottomRight.x][bottomRight.y] === ' ') {
                    map[p(i - 2, j - 2)] = `${lines[i + 1][j]}${lines[i + 2][j]}`;
                } else if (lines[bottomRight.x][bottomRight.y] === ' ' && lines[topRight.x][topRight.y] === ' ') {
                    map[p(i - 2, j - 2)] = `${lines[i][j + 1]}${lines[i][j + 2]}`;
                } else {
                    map[p(i - 2, j - 2)] = lines[i][j];
                }
            } else if (lines[i][j] >= 'A' && lines[i][j] <= 'Z') {
                map[p(i - 2, j - 2)] = ' ';
            } else {
                map[p(i - 2, j - 2)] = lines[i][j];
            }
        }
    }

    // for (let i = 0; i < maxX; i++) {
    //     for (let j = 0; j < maxY; j++) {
    //         process.stdout.write(map[p(i, j)]);
    //     }
    //     process.stdout.write('\n');
    // }
    mapAllPortals();
    const ps = Object.keys(portals);
    ps.forEach(p => {
        portals[p].forEach(point => {
            graph[getPortalKey(p, point)] = bfs(point);
        });
    });
    // console.log(graph);
    console.log(getMinDistance('AAB', 'ZZB'));
    getMinDistance2('AAB', 'ZZB');
});
