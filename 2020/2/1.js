process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const lines = chunk.toString().split('\n').filter(item => item);
    // Write your code here
    let valid1 = 0;
    let valid2 = 0;
    lines.forEach(line => {
        const input = line.split(/[-:\s]+/);
        const min = parseInt(input[0]);
        const max = parseInt(input[1]);
        const reqChar = input[2];
        const password = input[3];
        const count = password.split('').filter(item => item === reqChar).length;

        // Part 1
        if (count >= min && count <= max) {
            valid1++;
        }

        // Part 2
        if (password.charAt(min - 1) === reqChar && password.charAt(max - 1) !== reqChar) {
            valid2++;
        } else if (password.charAt(min - 1) !== reqChar && password.charAt(max - 1) === reqChar) {
            valid2++;
        }
    });
    console.log(valid1);
    console.log(valid2);
});
