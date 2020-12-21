process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const tiles = chunk.toString().split('\n\n').filter(item => item);
    // Write your code here
    const map = new Map();
    tiles.forEach(tile => {
        const lines = tile.split('\n');
        const id = parseInt(lines[0].split(' ')[1]);
        lines.shift();
        const img = lines.map(line => line.split(''));
        const borders = {};
        borders.top = img[0].join('');
        borders.bottom = img[9].join('');
        borders.left = '';
        for (let i = 0; i < 10; i++) {
            borders.left += img[i][0];
        }
        borders.right = '';
        for (let i = 0; i < 10; i++) {
            borders.right += img[i][9];
        }
        map.set(id, { borders, img });
    });

    const fit = new Map();

    let ans = 1;
    for (let i of map.keys()) {
        let count = 0;
        fit.set(i, {});
        for (let j of map.keys()) {
            if (i !== j) {
                for (let key1 of Object.keys(map.get(i).borders)) {
                    for (let key2 of Object.keys(map.get(j).borders)) {
                        if (map.get(i).borders[key1] === map.get(j).borders[key2]) {
                            fit.set(i, {
                                ...fit.get(i),
                                [key1]: j
                            });
                            count++;
                        } else if (map.get(i).borders[key1] === map.get(j).borders[key2].split("").reverse().join("")) {
                            fit.set(i, {
                                ...fit.get(i),
                                [key1]: j
                            });
                            count++;
                        }
                    }
                }
            }
        }

        if (count === 2) {
            ans *= i;
        }
    }

    console.log(ans);


});
