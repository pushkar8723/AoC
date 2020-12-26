process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const nums = chunk.toString().split('\n').filter(item => item).map(item => parseInt(item));
    // Write your code here
    const size = 25;
    let reqNum;
    for (let i = size; i < nums.length; i++) {
        let j;
        let k;
        let found = false;
        for (j = i - size; j < i; j++) {
            for(k = j + 1; k < i; k++) {
                if (nums[j] + nums[k] === nums[i]) {
                    found = true;
                }
            }
        }
        if (!found) {
            reqNum = nums[i];
        }
    }
    console.log(reqNum);
    
    const prefixSum = [];
    let sum = 0;
    for (let i = 0; i < nums.length; i++) {
        sum += nums[i];
        prefixSum.push(sum);
    }

    let l = 0;
    let h = 1;
    while (prefixSum[h] - prefixSum[l] !== reqNum) {
        const currSum = prefixSum[h] - prefixSum[l];
        if (currSum < reqNum) {
            h++;
        } else {
            l++;
        }
    }
    let min = Math.min(...nums.slice(l + 1, h));
    let max = Math.max(...nums.slice(l + 1, h));
    console.log(min + max);
});
