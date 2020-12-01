process.stdin.resume();
process.stdin.setEncoding('utf8');

const intcode = require('../shared/intcode').default;
let input;
const getValue = (x, y) => {
    const machine = new intcode(input.slice(0));
    const output = machine.exec([x, y]);
    return output.value;
}
process.stdin.on('data', function (chunk) {
    input = chunk.toString().split('\n')[0].split(',').map(item => Number(item));
    // Write your code here
    let count = 0, x, y;
    for (let j = 0; j < 50; j++) {
        for(let i = 0; i < 50; i++) {
            const curr = getValue(i, j);
            count += curr;
            if (curr) {
                x = i;
                y = j;
            }
        }
    }
    console.log(count);
    while (true) {
        // console.log(x, y, getValue(x - 99, y + 99))
        if (getValue(x - 99, y + 99) === 1) {
            break;
        }
        y++;
        while(getValue(x + 1, y) === 1) {
            x++;
        }
    }
    console.log(x - 99, y, getValue(x - 99, y));
    // console.log(x, y, getValue(x, y));
    // console.log(x - 99, y + 99, getValue(x - 99, y + 99));
    // console.log(x, y + 99, getValue(x, y + 99));
    // for (let i = x - 150; i <= x + 50; i++) {
    //     for (let j = y - 50; j <= y + 150; j++) {
    //         if ((i >= x - 99 && i <= x) && (j >= y && j <= y + 99)) {
    //             process.stdout.write((getValue(i, j) + 2).toString());
    //         } else {
    //             process.stdout.write(getValue(i, j).toString());
    //         }
    //     }
    //     process.stdout.write('\n');
    // }
});

