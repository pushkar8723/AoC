process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const groups = chunk.toString().split('\n\n').filter(item => item);
    // Write your code here
    const fields = groups[0].split('\n').filter(item => item);
    const ticket = groups[1].split('\n')[1].split(',').map(i => parseInt(i));
    const nearbyTicktes = groups[2].split('\n').filter(item => item);

    let valid = [];
    let fieldRange = {};
    fields.forEach(field => {
        const name = field.split(':')[0];
        const matches = field.match(/(\d+)/g);
        valid.push([parseInt(matches[0]), parseInt(matches[1])]);
        valid.push([parseInt(matches[2]), parseInt(matches[3])]);
        fieldRange[name] = [
            [parseInt(matches[0]), parseInt(matches[1])],
            [parseInt(matches[2]), parseInt(matches[3])]
        ]
    });
    valid = valid.sort((a, b) => {
        if (a[0] < b[0]) {
            return -1;
        } else if (a[0] > b[0]) {
            return 1;
        } else {
            return a[1] - b[1];
        }
    });

    const isValid = (num) => {
        for (let i = 0; i < valid.length; i++) {
            if (num >= valid[i][0] && num <= valid[i][1]) {
                return true;
            }
        }
        return false;
    }

    let errorRate = 0;
    const validTickets = [];
    nearbyTicktes.shift();
    nearbyTicktes.forEach(ticket => {
        const numbers = ticket.split(',').map(i => parseInt(i));
        let valid = true;
        numbers.forEach(num => {
            if (!isValid(num)) {
                errorRate += num;
                valid = false;
            }
        });
        if (valid) {
            validTickets.push(numbers);
        }
    });

    console.log(errorRate);

    const fieldNames = Object.keys(fieldRange);
    let probable = [];
    for (let i = 0; i < fieldNames.length; i++) {
        probable.push([fieldNames[i], []]);
        for (let j = 0; j < validTickets[0].length; j++) {
            let valid = true;
            for (let k = 0; k < validTickets.length && valid; k++) {
                if (!(
                    (validTickets[k][j] >= fieldRange[fieldNames[i]][0][0] && validTickets[k][j] <= fieldRange[fieldNames[i]][0][1]) ||
                    (validTickets[k][j] >= fieldRange[fieldNames[i]][1][0] && validTickets[k][j] <= fieldRange[fieldNames[i]][1][1]) 
                )) {
                    valid = false;
                }
            }
            
            if (valid) {
                probable[i][1].push(j);
            }
        }
    }
    probable = probable.sort((a, b) => a[1].length - b[1].length);

    const fieldIndex = {};
    fieldIndex[probable[0][0]] = probable[0][1][0]
    for (let i = 1; i < probable.length; i++) {
        fieldIndex[probable[i][0]] = probable[i][1].filter(item => !probable[i - 1][1].includes(item))[0];
    }
    console.log(
        ticket[fieldIndex['departure location']] *
        ticket[fieldIndex['departure station']] *
        ticket[fieldIndex['departure platform']] *
        ticket[fieldIndex['departure track']] *
        ticket[fieldIndex['departure date']] *
        ticket[fieldIndex['departure time']]
    );
});
