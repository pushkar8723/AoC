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
    console.log(portals);
});
