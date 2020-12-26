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
    let point = [0, 0];
    let waypoint = [-1, 10];
    lines.forEach(line => {
        const d = line.slice(0, 1);
        const u = parseInt(line.slice(1));
        if (directions[d]) {
            waypoint[0] += (directions[d][0] * u);
            waypoint[1] += (directions[d][1] * u);
        } else if (d === 'F') {
            point[0] += (waypoint[0] * u);
            point[1] += (waypoint[1] * u);
        } else if (d === 'L') {
            for (let i = 0; i < u / 90; i++) {
                const temp = waypoint[1] * -1;
                waypoint[1] = waypoint[0];
                waypoint[0] = temp;
            }
        } else {
            for (let i = 0; i < u / 90; i++) {
                const temp = waypoint[1];
                waypoint[1] = waypoint[0] * -1;
                waypoint[0] = temp;
            }
        }
        // console.log(d, u, point, waypoint);
    });
    console.log(Math.abs(point[0]) + Math.abs(point[1]));
});
