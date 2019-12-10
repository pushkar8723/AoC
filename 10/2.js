process.stdin.resume();
process.stdin.setEncoding('utf8');

const distSlopes = (input, x1, y1) => {
    const slopes = [];
    for (let y2 = 0; y2 < input.length; y2++) {
        for (let x2 = 0; x2 < input[0].length; x2++) {
            if (input[y2][x2] === '#' && (y2 !== y1 || x2 !== x1)) {
                const m = Math.atan(((y2 - y1) / (x2 - x1)));
                // console.log(x2, y2, m , slopes.find(item => Object.is(item, m)));
                if (slopes.find(item => Object.is(item, m)) === undefined) {
                    slopes.push(m);
                }
            }
        }
    }
    return slopes.length;
}

const getAngle = (rad, deltaX) => {
    let x = rad * 180 / Math.PI;
    if (Object.is(x, 0)) {
        return 90;
    } else if (Object.is(x, -0)) {
        return 270;
    }
    if (deltaX >= 0) {
        return x + 90;
    } else if (deltaX < 0) {
        return x + 270;
    }
}

const getAnglesAndDistance = (input, x1, y1) => {
    const collection = [];
    for (let y2 = 0; y2 < input.length; y2++) {
        for (let x2 = 0; x2 < input[0].length; x2++) {
            if (input[y2][x2] === '#' && (y2 !== y1 || x2 !== x1)) {
                const m = Math.atan(((y2 - y1) / (x2 - x1)));
                collection.push({
                    x: x2,
                    y: y2,
                    a: getAngle(m, x2 - x1).toFixed(3),
                    d: Math.abs(x2 - x1) + Math.abs(y2 - y1)
                });
            }
        }
    }
    return collection;
}

process.stdin.on('data', function (chunk) {
    const input = chunk.toString().split('\n');
    // Write your code here
    let max = 0, maxX, maxY;
    for (let j = 0; j < input.length; j++) {
        for (let i = 0; i < input[0].length; i++) {
            // const i = 2, j = 2;
            let output = 0;
            if (input[j][i] === '#') {
                output = distSlopes(input.slice(0, j + 1), i, j);
                output += distSlopes(input.slice(j + 1), i, -1);
            }
            // console.log(output);
            if (max < output) {
                max = output;
                maxX = i;
                maxY = j;
            }
            process.stdout.write((output.toString() + "    ").slice(0, 4));
        }
        process.stdout.write('\n');
    }
    console.log(max, maxX, maxY);
    const allPoints = getAnglesAndDistance(input, maxX, maxY);
    const angleToDistanceMap = {};
    allPoints.forEach(point => {
        if (angleToDistanceMap[point.a]) {
            angleToDistanceMap[point.a].push(point);
        } else {
            angleToDistanceMap[point.a] = [point];
        }
    });
    Object.keys(angleToDistanceMap).forEach(angle => {
        angleToDistanceMap[angle].sort((a, b) => {
            return a.d - b.d;
        });
    });
    const angles = Object.keys(angleToDistanceMap).sort((a, b) => a - b);
    let counter = 1, i = 0;
    while (counter <= allPoints.length) {
        if (angleToDistanceMap[angles[i]].length) {
            console.log(counter++, angleToDistanceMap[angles[i]].splice(0, 1)[0]);
        }
        i = (i + 1) % angles.length;
    }
});
