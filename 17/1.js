process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const lines = chunk.toString().split('\n').filter(item => item);
    // Write your code here
    let map = new Map();
    map.set(0, new Map());
    const dim = lines.length;
    for (let y = 0; y < dim; y++) {
        map.get(0).set(y, new Map());
        for (let x = 0; x < dim; x++) {
            map.get(0).get(y).set(x, lines[y].charAt(x));
        }
    }

    const getItem = (x, y, z) => {
        if (map.has(z)) {
            if (map.get(z).has(y)) {
                if (map.get(z).get(y).has(x)) {
                    return map.get(z).get(y).get(x);
                }
            }
        }
        return '.';
    }

    for (let cycle = 1; cycle <= 6; cycle++) {
        let newMap = new Map();
        for (let z = -1 * cycle; z <= cycle; z++) {
            newMap.set(z, new Map());
            for (let y = -1 * cycle; y < dim + cycle; y++) {
                newMap.get(z).set(y, new Map());
                for (let x = -1 * cycle; x < dim + cycle; x++) {
                    let count = 0;
                    let current = getItem(x, y, z);
                    for (let i = z - 1; i <= z + 1; i++) {
                        for (let j = y - 1; j <= y + 1; j++) {
                            for (let k = x - 1; k <= x + 1; k++) {
                                if (i !== z || j !== y || k !== x) {
                                    if (getItem(k, j, i) === '#') {
                                        count++;
                                    }
                                }
                            }
                        }
                    }
                    /**
                     * If a cube is active and exactly 2 or 3 of its neighbors are also active, the cube remains active.
                     * Otherwise, the cube becomes inactive.
                     * 
                     * If a cube is inactive but exactly 3 of its neighbors are active, the cube becomes active.
                     * Otherwise, the cube remains inactive.
                     */
                    // console.log([x, y, z], count, current);
                    if (current === '#') {
                        if (count === 2 || count === 3) {
                            newMap.get(z).get(y).set(x, '#');
                        } else {
                            newMap.get(z).get(y).set(x, '.');
                        }
                    }
                    if (current === '.') {
                        if (count === 3) {
                            newMap.get(z).get(y).set(x, '#');
                        } else {
                            newMap.get(z).get(y).set(x, '.');
                        }
                    }
                }
            }
        }
        map = newMap;
    }
    
    let count = 0;
    for (let z of map.keys()) {
        for (let y of map.get(z).keys()) {
            for (let x of map.get(z).get(y).keys()) {
                if (getItem(x, y, z) === '#') {
                    count++;
                }
            }
        }
    }
    console.log(count);
});
