process.stdin.resume();
process.stdin.setEncoding('utf8');

const parseLine = (line) => {
    const posStr = line.match(/[^<>]+/)[0].split(',');
    const x = Number(posStr[0].split('=')[1]);
    const y = Number(posStr[1].split('=')[1]);
    const z = Number(posStr[2].split('=')[1]);
    return { x, y, z };
}

const gcd = (a, b) => { 
    if (b === 0) 
        return a; 
    return gcd(b, a % b);  
      
}

const lcm = (a, b) => {
    return (a * b) / gcd(a, b);
}

process.stdin.on('data', function (chunk) {
    const lines = chunk.toString().split('\n');
    // Write your code here
    let positions = [];
    let velocity = [
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 0, z: 0 }
    ]
    lines.forEach(line => line.length && positions.push(parseLine(line)));
    for (let i = 0; i < 1000; i++) {
        const delta = [];
        for (let j = 0; j < 4; j++) {
            const change = { x: 0, y: 0, z: 0 };
            for (let k = 0; k < 4; k++) {
                if (k !== j) {
                    if (positions[j].x > positions[k].x) { 
                        change.x--;
                    } else if (positions[j].x < positions[k].x) {
                        change.x++;
                    }
                    if (positions[j].y > positions[k].y) { 
                        change.y--;
                    } else if (positions[j].y < positions[k].y) {
                        change.y++;
                    }
                    if (positions[j].z > positions[k].z) { 
                        change.z--;
                    } else if (positions[j].z < positions[k].z) {
                        change.z++;
                    }
                }
            }
            delta.push(change);
        }
        for (let j = 0; j < 4; j++) {
            velocity[j].x += delta[j].x;
            velocity[j].y += delta[j].y;
            velocity[j].z += delta[j].z;
            positions[j].x += velocity[j].x;
            positions[j].y += velocity[j].y;
            positions[j].z += velocity[j].z;
        }
    }
    let totalEnergy = 0;
    for (let j = 0; j < 4; j++) {
        totalEnergy += (Math.abs(positions[j].x) + Math.abs(positions[j].y) + Math.abs(positions[j].z)) * 
                        (Math.abs(velocity[j].x) + Math.abs(velocity[j].y) + Math.abs(velocity[j].z))
    }
    console.log(totalEnergy, positions);

    positions = [];
    velocity = [
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 0, z: 0 }
    ]
    lines.forEach(line => line.length && positions.push(parseLine(line)));
    initialP = {
        x: positions.map(item => item.x),
        y: positions.map(item => item.y),
        z: positions.map(item => item.z)
    }
    initialV = {
        x: [0, 0, 0, 0],
        y: [0, 0, 0, 0],
        z: [0, 0, 0, 0]
    }
    const periods = {};
    let counter = 1;
    while (true) {
        const delta = [];
        for (let j = 0; j < 4; j++) {
            const change = { x: 0, y: 0, z: 0 };
            for (let k = 0; k < 4; k++) {
                if (k !== j) {
                    if (positions[j].x > positions[k].x) { 
                        change.x--;
                    } else if (positions[j].x < positions[k].x) {
                        change.x++;
                    }
                    if (positions[j].y > positions[k].y) { 
                        change.y--;
                    } else if (positions[j].y < positions[k].y) {
                        change.y++;
                    }
                    if (positions[j].z > positions[k].z) { 
                        change.z--;
                    } else if (positions[j].z < positions[k].z) {
                        change.z++;
                    }
                }
            }
            delta.push(change);
        }
        for (let j = 0; j < 4; j++) {
            velocity[j].x += delta[j].x;
            velocity[j].y += delta[j].y;
            velocity[j].z += delta[j].z;
            positions[j].x += velocity[j].x;
            positions[j].y += velocity[j].y;
            positions[j].z += velocity[j].z;
        }
        const currentP = {
            x: positions.map(item => item.x),
            y: positions.map(item => item.y),
            z: positions.map(item => item.z)
        };
        const currentV = {
            x: velocity.map(item => item.x),
            y: velocity.map(item => item.y),
            z: velocity.map(item => item.z)
        };
        if (!periods.x && currentP.x.toString() === initialP.x.toString() &&
            currentV.x.toString() === initialV.x.toString()) {
            periods.x = counter;
        }

        if (!periods.y && currentP.y.toString() === initialP.y.toString() &&
            currentV.y.toString() === initialV.y.toString()) {
            periods.y = counter;
        }

        if (!periods.z && currentP.z.toString() === initialP.z.toString() &&
            currentV.z.toString() === initialV.z.toString()) {
            periods.z = counter;
        }

        if (periods.x && periods.y && periods.z) {
            break;
        }
        counter++;
    }
    console.log(periods);
    console.log(lcm(lcm(periods.x, periods.y), periods.z ));
});
