process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    let map = chunk.toString().split('\n').filter(item => item);
    // Write your code here
    const print = (map) => {
        let sum = 0;
        for (let x = 0; x < map.length; x++) {
            console.log(map[x].join(''));
            sum += map[x].filter(i => i === '#').length;
        }
        console.log(sum);
    }

    let changes;
    do {
        changes = 0;
        let newMap = [];
        for (let x = 0; x < map.length; x++) {
            newMap.push(new Array(map[0].length))
            for (let y = 0; y < map[0].length; y++) {
                let occupied = 0;
                if (map[x][y] !== '.') {
                    if (map[x - 1] && map[x-1][y-1] === '#') {
                        occupied++;
                    }
                    if (map[x - 1] && map[x-1][y] === '#') {
                        occupied++;
                    }
                    if (map[x - 1] && map[x-1][y+1] === '#') {
                        occupied++;
                    }
                    if (map[x][y-1] === '#') {
                        occupied++;
                    }
                    if (map[x][y+1] === '#') {
                        occupied++;
                    }
                    if (map[x + 1] && map[x+1][y-1] === '#') {
                        occupied++;
                    }
                    if (map[x + 1] && map[x+1][y] === '#') {
                        occupied++;
                    }
                    if (map[x + 1] && map[x+1][y+1] === '#') {
                        occupied++;
                    }
                }

                if (map[x][y] === 'L' && occupied === 0) {
                    newMap[x][y] = '#';
                    changes++;
                } else if (map[x][y] === '#' && occupied >= 4) {
                    newMap[x][y] = 'L';
                    changes++;
                } else {
                    newMap[x][y] = map[x][y];
                }
            }
        }
        map = newMap;
    } while (changes);

    print(map);
});
