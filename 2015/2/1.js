process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const lines = chunk.toString().split('\n').filter(item => item);
    // Write your code here
    let sum = 0;
    let ribbonSum = 0;
    lines.forEach(line => {
        const dim = line.split('x').map(i => parseInt(i)).sort((a, b) => a - b);
        const area = 2 * (dim[0]*dim[1] + dim[1]*dim[2] + dim[2]*dim[0]) + dim[0]*dim[1]
        sum += area;
        ribbonSum += (2 * (dim[0] + dim[1]) + dim[0]*dim[1]*dim[2]);
    });
    console.log(sum);
    console.log(ribbonSum);
});
