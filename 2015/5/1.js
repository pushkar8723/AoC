process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const lines = chunk.toString().split('\n').filter(item => item);
    // Write your code here
    const conditions = [
        /([aeiou])/g,
        /(.)\1{1,}/g,
        /(ab|cd|pq|xy)/g,
        /(..).*(\1){1}/g,
        /(.).\1{1}/g
    ];

    let count = 0;
    let count2 = 0;
    lines.forEach(line => {
        if (
            line.match(conditions[0]) && line.match(conditions[0]).length >= 3 &&
            line.match(conditions[1]) && line.match(conditions[1]).length > 0 &&
            !line.match(conditions[2])
        ) {
            count++;
        }
        if (line.match(conditions[3]) && line.match(conditions[4])) {
            count2++;
        }
    });
    console.log(count, count2);
});
