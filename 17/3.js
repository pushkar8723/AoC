process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const lines = chunk.toString().split('\n').filter(item => item);
    // Write your code here
    const runGameOfLife = (dimensions, inputDimensions, gridSize, input, simulationCycles) => {
        let map = new Map();
        let curr = map; 
        for (let i = dimensions; i > inputDimensions + 1; i--) {
            curr.set(0, new Map());
            curr = curr.get(0);
        }
        curr.set(0, input);

        const getItem = (...units) => {
            let curr = map;
            while (true) {
                const next = units.shift();
                if (units.length) {
                    if (curr.has(next)) {
                        curr = curr.get(next);
                    } else {
                        return '.';
                    }
                } else {
                    return curr.get(next) || '.';
                }
            }
        }

        const getActiveNeighborsCount = (coordinates, p) => {
            if (p.length < coordinates.length) {
                let count = 0;
                for (let i = -1; i <= 1; i++) {
                    count += getActiveNeighborsCount(coordinates, [...p, coordinates[p.length] + i]);
                }
                return count;
            } else {
                let same = true;
                for (let i = 0; i < coordinates.length && same; i++) {
                    if (coordinates[i] !== p[i]) {
                        same = false;
                    }
                }
                if (!same) {
                    if (getItem(...p) === '#') {
                        return 1;
                    } else {
                        return 0;
                    }
                } else {
                    return 0;
                }
            }
        }

        const constructMap = (newMap, currentDimention, cycle, coordinates) => {
            if (currentDimention > 1) {
                if (currentDimention > inputDimensions) {
                    for (let p = -1 * cycle; p <= cycle; p++) {
                        newMap.set(p, new Map());
                        constructMap(newMap.get(p), currentDimention - 1, cycle, [...coordinates, p]);
                    }
                } else {
                    for (let p = -1 * cycle; p < gridSize + cycle; p++) {
                        newMap.set(p, new Map());
                        constructMap(newMap.get(p), currentDimention - 1, cycle, [...coordinates, p]);
                    }
                }
            } else {
                for (let x = -1 * cycle; x < gridSize + cycle; x++) {
                    let current = getItem(...coordinates, x);
                    let count = getActiveNeighborsCount([...coordinates, x], []);

                    if (current === '#') {
                        if (count === 2 || count === 3) {
                            newMap.set(x, '#');
                        } else {
                            newMap.set(x, '.');
                        }
                    }
                    if (current === '.') {
                        if (count === 3) {
                            newMap.set(x, '#');
                        } else {
                            newMap.set(x, '.');
                        }
                    }
                }
            }
        }

        const countActive = (map) => {
            let count = 0;
            for (let key of map.keys()) {
                if (typeof map.get(key) === 'object') {
                    count += countActive(map.get(key));
                } else {
                    count += map.get(key) === '#' ? 1 : 0;
                }
            }
            return count;
        }

        for (let cycle = 1; cycle <= simulationCycles; cycle++) {
            let newMap = new Map();
            constructMap(newMap, dimensions, cycle, []);
            map = newMap;
        }

        return countActive(map);
    }

    let map = new Map();
    const dim = lines.length;
    for (let y = 0; y < dim; y++) {
        map.set(y, new Map());
        for (let x = 0; x < dim; x++) {
            map.get(y).set(x, lines[y].charAt(x));
        }
    }

    console.log(runGameOfLife(3, 2, lines.length, map, 6));
    console.log(runGameOfLife(4, 2, lines.length, map, 6));
});
