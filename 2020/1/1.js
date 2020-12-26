process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const lines = chunk.toString().split('\n');
    // Write your code here
    const nums = lines.filter(item => item).map(num => parseInt(num)).sort((a, b) => a - b);
    let i = 0;
    let j = nums.length - 1;
    while (i < j && nums[i] + nums[j] !== 2020) {
        if (nums[i] + nums[j] > 2020) {
            j--;
        } else {
            i++;
        }
    }
    console.log(nums[i], nums[j]);
    console.log(nums[i] * nums[j]);

    let k;
    for (k = 1; k < nums.length - 2; k++) {
        i = 0;
        j = nums.length - 1;
        while (i < k && j > k && nums[i] + nums[j] + nums[k] !== 2020) {
            if (nums[i] + nums[j] + nums[k] > 2020) {
                j--;
            } else {
                i++;
            }
        }
        if (nums[i] + nums[j] + nums[k] === 2020) {
            break;
        }
    }
    console.log(nums[i], nums[j], nums[k])
    console.log(nums[i] * nums[j] * nums[k]);
});
