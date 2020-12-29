process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const lines = chunk.toString().split('\n').filter(item => item);
    // Write your code here
    const conditions = [
        /([aeiou])/g,
        /(.)\1{1,}/g,
        /(ab|cd|pq|xy)/g,
        /(.).\1{1}/g
    ];

    const hasRepeatingPairs = (str) => {
        for (let i = 0; i <= str.length - 4; i++) {
            for (let j = i + 2; j <= str.length - 2; j++) {
                if (str.substr(i, 2) === str.substr(j, 2)) {
                    return true;
                }
            }
        }
        return false;
    }

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
        if (hasRepeatingPairs(line) && line.match(conditions[3])) {
            count2++;
        }
    });
    console.log(count, count2);
});
