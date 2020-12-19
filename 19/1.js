process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const input = chunk.toString().split('\n\n').filter(item => item);
    // Write your code here
    const rules = input[0].split('\n');
    const messages = input[1].split('\n');

    const map = new Map();
    const solved = new Map();
    rules.forEach(rule => {
        const parts = rule.split(': ');
        const idx = parseInt(parts[0]);
        const sub = parts[1];
        map.set(idx, sub.replace(/"/g, ''));
    });

    const solve = (idx) => {
        if (solved.has(idx)) {
            return map.get(idx);
        }

        // console.log(idx, map.get(idx));
        const inp = map.get(idx).split(' ');
        if (inp[0] === 'a' || inp[0] === 'b') {
            solved.set(idx, true);
            map.set(idx, inp);
            return inp;
        } else {
            let regEx = '(';
            inp.forEach(i => {
                if( i === '|') {
                    regEx += '|';
                } else {
                    regEx += solve(parseInt(i));
                }
            });
            regEx+=')';
            solved.set(idx, true);
            map.set(idx, regEx);
            return regEx;
        }
    }

    const reqRegEx = solve(0);
    let count = 0;
    messages.forEach(msg => {
        if (Boolean(msg.match(new RegExp(`^${reqRegEx}$`)))) {
            count++;
        }
    });
    console.log(count);

    map.set(8, '42 | 42 42 | 42 42 42 | 42 42 42 42 | 42 42 42 42 42 | 42 42 42 42 42 42 | 42 42 42 42 42 42 42');
    map.set(11, '42 31 | 42 42 31 31 | 42 42 42 31 31 31 | 42 42 42 42 31 31 31 31 | 42 42 42 42 42 31 31 31 31 31 | 42 42 42 42 42 42 31 31 31 31 31 31');
    map.set(0, '8 11');
    solved.delete(0);
    solved.delete(8);
    solved.delete(11);
    const reqRegEx2 = solve(0);

    let p2 = 0;
    messages.forEach(msg => {
        if (Boolean(msg.match(new RegExp(`^${reqRegEx2}$`)))) {
            p2++;
        }
    });
    console.log(p2);
});
