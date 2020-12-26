process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const cups = chunk.toString().split('\n')[0].split('').map(i => parseInt(i));
    // Write your code here
    let curr = 0;
    for (let i = 1; i <= 100; i++) {
        const currVal = cups[curr];
        const pick = cups.splice(curr + 1, 3);
        if (pick.length < 3) {
            pick.push(...cups.splice(0, 3 - pick.length));
        }
        let find = currVal > 1 ? currVal - 1 : 9;
        while (pick.includes(find)) {
            find--;
            if (find <= 0) {
                find = 9;
            }
        }
        const newIdx = cups.indexOf(find);
        // console.log(i, cups.join(','), currVal, pick, find);
        // console.log(pick, find, newIdx);
        cups.splice((newIdx + 1) % cups.length, 0, ...pick);
        curr = (cups.indexOf(currVal) + 1) % cups.length;
        // console.log(cups.join(','), curr, cups[curr]);
    }
    const idx1 = cups.indexOf(1);
    const ans = cups.splice(idx1 + 1);
    ans.push(...cups.slice(0, -1));
    console.log(ans.join(''));
});
