process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const lines = chunk.toString().split('\n\n').filter(item => item);
    // Write your code here
    const items = lines.map(line => line.split(/\s/).map(word => word.split(':')));
    let count = 0;
    let count2 = 0;
    items.forEach(item => {
        if (item.length > 7 || (item.length === 7 && !item.map(map => map[0]).includes('cid'))) {
            count++;
            let valid = true;
            item.forEach(map => {
                // byr (Birth Year) - four digits; at least 1920 and at most 2002.
                if (map[0] === 'byr') {
                    const year = parseInt(map[1]);
                    valid &= year >= 1920 && year <= 2002;
                }

                // iyr (Issue Year) - four digits; at least 2010 and at most 2020.
                if (map[0] === 'iyr') {
                    const year = parseInt(map[1]);
                    valid &= year >= 2010 && year <= 2020;
                }

                // eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
                if (map[0] === 'eyr') {
                    const year = parseInt(map[1]);
                    valid &= year >= 2020 && year <= 2030;
                }

                // hgt (Height) - a number followed by either cm or in:
                // If cm, the number must be at least 150 and at most 193.
                // If in, the number must be at least 59 and at most 76.
                if (map[0] === 'hgt') {
                    const value = parseInt(map[1].slice(0, -2));
                    const unit = map[1].slice(-2);
                    if (unit === 'cm') {
                        valid &= value >= 150 && value <= 193;
                    } else {
                        valid &= value >= 59 && value <= 76;
                    }
                }

                // hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
                if (map[0] === 'hcl') {
                    valid &= Boolean(map[1].match(/#[0-9a-f]{6}/));
                }

                // ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
                if (map[0] === 'ecl') {
                    valid &= Boolean(map[1].match(/amb|blu|brn|gry|grn|hzl|oth/));
                }

                // pid (Passport ID) - a nine-digit number, including leading zeroes.
                if (map[0] === 'pid') {
                    valid &= map[1].length === 9;
                }
            });
            if (valid) {
                count2++;
            }
        }
    });

    // Part 1
    console.log(count);

    // Part 2
    console.log(count2);
});
