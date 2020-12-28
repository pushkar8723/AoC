const crypto = require('crypto');

process.stdin.resume();
process.stdin.setEncoding('utf8');

const md5 = (data) => {
    return crypto.createHash('md5').update(data).digest('hex');
}

process.stdin.on('data', function (chunk) {
    const data = chunk.toString().split('\n').filter(item => item)[0];
    // Write your code here
    console.log(data);
    let i = 1;
    const find = (startWith) => {
        for (; true; i++) {
            const hash = md5(`${data}${i}`);
            if (hash.startsWith(startWith)) {
                break;
            }
            // console.log(i);
        }
        return i;
    }
    console.log(find('00000'));
    console.log(find('000000'));
});
