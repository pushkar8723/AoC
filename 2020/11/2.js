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

    const getVisibleSeat = (direction, map, startX, startY) => {
        let deltaX;
        let deltaY;
        let x = startX;
        let y = startY
        if (direction === 1) {
            deltaX = -1;
            deltaY = -1;
        }
        if (direction === 2) {
            deltaX = -1;
            deltaY = 0;
        }
        if (direction === 3) {
            deltaX = -1;
            deltaY = 1;
        }
        if (direction === 4) {
            deltaX = 0;
            deltaY = -1;
        }
        if (direction === 5) {
            deltaX = 0;
            deltaY = 1;
        }
        if (direction === 6) {
            deltaX = 1;
            deltaY = -1;
        }
        if (direction === 7) {
            deltaX = 1;
            deltaY = 0;
        }
        if (direction === 8) {
            deltaX = 1;
            deltaY = 1;
        }
        while (true) {
            x += deltaX;
            y += deltaY;
            if (map[x]) {
                if (!map[x][y]) return '.';
                else if (map[x][y] !== '.') return map[x][y];
            } else {
                return '.';
            }
        }
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
                    if (getVisibleSeat(1, map, x, y) === '#') {
                        occupied++;
                    }
                    if (getVisibleSeat(2, map, x, y) === '#') {
                        occupied++;
                    }
                    if (getVisibleSeat(3, map, x, y) === '#') {
                        occupied++;
                    }
                    if (getVisibleSeat(4, map, x, y) === '#') {
                        occupied++;
                    }
                    if (getVisibleSeat(5, map, x, y) === '#') {
                        occupied++;
                    }
                    if (getVisibleSeat(6, map, x, y) === '#') {
                        occupied++;
                    }
                    if (getVisibleSeat(7, map, x, y) === '#') {
                        occupied++;
                    }
                    if (getVisibleSeat(8, map, x, y) === '#') {
                        occupied++;
                    }
                }

                if (map[x][y] === 'L' && occupied === 0) {
                    newMap[x][y] = '#';
                    changes++;
                } else if (map[x][y] === '#' && occupied >= 5) {
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
