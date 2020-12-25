process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const lines = chunk.toString().split('\n').filter(item => item);
    // Write your code here

    const traverse = (right, down) => {
        let i = 0;
        let j = 0;
        let count = 0;
        while (i < lines.length) {
            if (lines[i].charAt(j) === '#') {
                count++;
            }
            j = (j + right) % lines[0].length;
            i +=  down;
        }
        return count;
    }

    // Part 1
    console.log(traverse(3, 1));

    // Part 2
    console.log(traverse(1, 1) * traverse(3, 1) * traverse(5, 1) * traverse(7, 1) * traverse(1, 2));
});
