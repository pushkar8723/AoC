process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const line = chunk.toString().split('\n').filter(item => item)[0].split('');
    // Write your code here
    console.log(line.reduce((acc, char) => char === '(' ? acc + 1 : acc - 1, 0));
    let floor = 0;
    console.log(line.findIndex(char => {
        floor += (char === '(' ? 1 : -1);
        return floor === -1; 
    }) + 1);
});
