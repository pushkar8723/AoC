process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const lines = chunk.toString().split('\n').filter(item => item);
    // Write your code here
    
    const eval = (tokens, precedence = false) => {
        let stack = [];
        // console.log(tokens);
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] === '(') {
                let count = 1;
                let j = i + 1;
                while (count) {
                    if (tokens[j] === '(') {
                        count++;
                    } else if (tokens[j] === ')') {
                        count--;
                    }
                    j++;
                }
                stack.push(eval(tokens.slice(i+1, j - 1), precedence));
                i = j - 1;
            } else if (['+', '*'].includes(tokens[i])) {
                stack.push(tokens[i]);
            } else {
                stack.push(parseInt(tokens[i]));
            }
        }

        if (precedence) {
            for (let i = stack.length - 2; i >= 0; i--) {
                if (stack[i] === '+') {
                    stack.splice(i - 1, 3, stack[i - 1] + stack[i + 1]);
                }
            }
        }

        let ans = stack[0];
        for (let i = 1; i < stack.length; i++) {
            if (typeof stack[i] === 'number') {
                if (stack[i-1] === '+') {
                    ans += stack[i];
                } else if (stack[i-1] === '*') {
                    ans *= stack[i];
                }
            }
        }
        return ans;
    }

    let sumP1 = 0;
    let sumP2 = 0;
    lines.forEach(line => {
        const tokens = line.replace(/\(/g, '( ').replace(/\)/g, ' )').split(' ').filter(item => item);
        sumP1 += eval(tokens);
        sumP2 += eval(tokens, true);
    });
    console.log(sumP1);
    console.log(sumP2);
});
