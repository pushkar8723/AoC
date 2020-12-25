process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const nums = chunk.toString().split('\n').filter(item => item).map(i => parseInt(i));
    // Write your code here
    const getLoopSize = (num) => {
        let i = 0;
        let val = 1;
        let subjectNum = 7;
        while (num !== val) {
            val *= subjectNum;
            val %= 20201227;
            i++;
            // console.log(i, val);
        }
        return i;
    }

    const transform = (subjectNum, n) => {
        let val = 1;
        for (let i = 0; i < n; i++) {
            val *= subjectNum;
            val %= 20201227;
        }
        return val;
    }

    const a = getLoopSize(nums[0]);
    const b = getLoopSize(nums[1]);
    console.log(a, b);
    console.log(transform(nums[0], b));
});
