process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const masses = chunk.toString().split("\n").map(item => Number(item));
    let sum = 0;
    masses.forEach(mass => {
        sum += Math.floor(mass / 3) - 2;
    });
    console.log(sum);

    sum = 0;
    masses.forEach(mass => {
        while(true) {
            const reqFuel = Math.floor(mass / 3) - 2;
            if (reqFuel > 0) {
                sum += reqFuel;
                mass = reqFuel;
            } else {
                break;
            }
        }
    });
    console.log(sum);
});
