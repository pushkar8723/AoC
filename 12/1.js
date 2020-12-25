process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const lines = chunk.toString().split('\n').filter(item => item);
    // Write your code here
    const directions = {
        N: [-1, 0],
        S: [1, 0],
        E: [0, 1],
        W: [0, -1],
    }
    const left = {
        N: ['W', 'S', 'E'],
        W: ['S', 'E', 'N'],
        S: ['E', 'N', 'W'],
        E: ['N', 'W', 'S'],
    }
    const right = {
        N: ['E', 'S', 'W'],
        E: ['S', 'W', 'N'],
        S: ['W', 'N', 'E'],
        W: ['N', 'E', 'S'],
    }
    let currDirection = 'E';
    let point = [0, 0];
    lines.forEach(line => {
        const d = line.slice(0, 1);
        const u = parseInt(line.slice(1));
        if (directions[d]) {
            point[0] += (directions[d][0] * u);
            point[1] += (directions[d][1] * u);
        } else if (d === 'F') {
            point[0] += (directions[currDirection][0] * u);
            point[1] += (directions[currDirection][1] * u);
        } else if (d === 'L') {
            currDirection = left[currDirection][(u / 90) - 1];
        } else {
            currDirection = right[currDirection][(u / 90) - 1];
        }
        // console.log(d, u, point, currDirection);
    });
    console.log(Math.abs(point[0]) + Math.abs(point[1]));
});
