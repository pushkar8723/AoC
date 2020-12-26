process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const lines = chunk.toString().split('\n').filter(item => item);
    // Write your code here
    const map = {};
    lines.forEach(line => {
        const outerRegEx = /(\w+ \w+) bags contain (([(\d+) (\w+ \w+) (bag|bags)(,|\.)]+)|(no other bags\.))/;
        const innerRegEx = /(\d+) (\w+ \w+) (?:bag|bags)/;
        const outerMatch = line.match(outerRegEx);
        const containerColor = outerMatch[1];
        const containerRelation = outerMatch[2];
        if (containerRelation !== 'no other bags.') {
            const str = containerRelation.split(/,|\./).filter(item => item);
            const innerMatch = str.map(item => {
                const match = item.match(innerRegEx);
                return {
                    [match[2]]: parseInt(match[1]),
                };
            });
            innerMatch.forEach(item => {
                map[containerColor] = {
                    ...map[containerColor],
                    ...item,
                };
            })
        } else {
            map[containerColor] = {};
        }
    });
    const nodes = Object.keys(map);

    const containsColor = (source, destination) => {
        let found = false;
        const innerColours = Object.keys(map[source]);
        innerColours.forEach(color => {
            if (color === destination) {
                found = true;
            } else {
                found = found || containsColor(color, destination)
            }
        });
        return found;
    }

    let count = 0;
    for (let i = 0; i < nodes.length; i++) {
        if (containsColor(nodes[i], 'shiny gold')) {
            count++;
        }
    }
    console.log(count);

    const total = (source) => {
        let ans = 1;
        const innerColours = Object.keys(map[source]);
        innerColours.forEach(color => {
            ans += map[source][color] * total(color);
        });
        return ans;
    }
    console.log(total('shiny gold') - 1);
});
