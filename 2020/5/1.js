process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const lines = chunk.toString().split('\n').filter(item => item);
    // Write your code here
    let max = 0;
    let seats = [];
    lines.forEach(line => {
        const rows = line.slice(0, 7).split('').reverse();
        const cols = line.slice(-3).split('').reverse();
        const rowNo = rows.reduce((acc, bit, index) => {
            return acc + (bit === 'B' ? 1 : 0) * (2 ** index);
        }, 0);
        const colNo = cols.reduce((acc, bit, index) => {
            return acc + (bit === 'R' ? 1 : 0) * (2 ** index);
        }, 0);
        const val = rowNo * 8 + colNo;
        if (max < val) {
            max = val;
        }
        seats.push(val);
    });
    // Part 1
    console.log(max);
    
    // Part 2
    console.log(seats);
    const sorted = seats.sort((a, b) => a - b);
    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i] + 1 !== sorted[i + 1]) {
            console.log(sorted[i] + 1);
            return;
        }
    }
});
