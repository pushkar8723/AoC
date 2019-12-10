process.stdin.resume();
process.stdin.setEncoding('utf8');

const coordinates = [];

const bfs = (map, i, j, log=false) => {
    const queue = [ [i, j] ];
    const visited = new Set();
    const astroids = new Set();
    while (queue.length) {
        const current = queue.splice(0, 1)[0];
        if (current[0] >= 0 && current[0] < map[0].length &&
            current[1] >= 0 && current[1] < map.length) {
                if (!visited.has(current.toString())) {
                    visited.add(current.toString());
                    const x = current[0];
                    const y = current[1];
                    if (x !== i || y !== j) {
                        if (map[y][x] === '#') {
                            const m = (j - y) / (i - x);
                            let id = '';
                            if (i - x < 0) {
                                id += "-";
                            } else {
                                id += "+";
                            }
                            if (j - y < 0) {
                                id += "-";
                            } else {
                                id += "+";
                            }
                            id += m.toString();
                            // console.log(current, m, id);
                            if (log) {
                                const tan = Math.atan2(y - j, x - i);
                                const angle = tan;
                                coordinates.push({
                                    current, m: tan, id
                                });
                            }
                            astroids.add(id);
                        }
                    }
                    queue.push([x - 1, y -1]);
                    queue.push([x, y - 1]);
                    queue.push([x + 1, y - 1]);
                    queue.push([x - 1, y]);
                    queue.push([x + 1, y]);
                    queue.push([x - 1, y + 1]);
                    queue.push([x, y]);
                    queue.push([x + 1, y + 1]);
                }
        }
    }
    return astroids.size;
}

process.stdin.on('data', function (chunk) {
    const input = chunk.toString().split('\n');
    // Write your code here
    let max = 0;
    let maxX, maxY;
    for (let j = 0; j < input.length; j++) {
        for (let i = 0; i < input[j].length; i++) {
            // const i = 3, j = 4;
            let output = 0;
            if (input[j][i] === '#') {
                output = bfs(input, i, j);
            }
            if (max < output) {
                max = output;
                maxX = i;
                maxY = j;
            }
            // process.stdout.write(output.toString());
        }
        // process.stdout.write("\n");
    }
    console.log(max, maxX, maxY);
    bfs(input, maxX, maxY, true);
    coordinates.sort((a, b) => {
        return a.m - b.m;
    });
    let counter = 1, lastM = -1, i = 0;
    while(coordinates.length) {
        const mod = coordinates.length;
        if (coordinates[i % mod].m !== lastM || coordinates.length === 1) {
            const vaporized = coordinates.splice(i % mod, 1)[0];
            console.log(counter++, vaporized.current, vaporized.m);
            lastM = vaporized.m;
        } else {
            i++;
        }
    }
});
