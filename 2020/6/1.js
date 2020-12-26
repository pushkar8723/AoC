process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const groups = chunk.toString().split('\n\n').filter(item => item);
    // Write your code here
    // Part 1 - union
    console.log(groups.reduce((acc, group) => {
        const set = new Set();
        const ans = group.replace(/\s/g, '').split('');
        ans.forEach(char => set.add(char));
        return acc + set.size;
    }, 0));

    // Part 2 - intersection
    console.log(groups.reduce((acc, group) => {
        const answers = group.split('\n').filter(item => item);
        let common = answers[0].split('');
        for (let i = 1; i < answers.length; i++) {
            const ans = answers[i].split('');
            common = common.filter(item => ans.includes(item));
        }
        return acc + common.length;
    }, 0));
});
