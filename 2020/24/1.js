process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const lines = chunk.toString().split('\n').filter(item => item);
    // Write your code here
    const traverse = (path) => {
        let direction = {
            s: 0, n: 0, e: 0, w: 0,
        }
        if (!path) {
            return direction;
        }
        if (path.slice(0, 2) === 'sw') {
            direction = traverse(path.slice(2));
            direction.s += 1;
            direction.w += 1;
        } else if (path.slice(0, 2) === 'se') {
            direction = traverse(path.slice(2));
            direction.s += 1;
            direction.e += 1;
        } else if (path.slice(0, 2) === 'nw') {
            direction = traverse(path.slice(2));
            direction.n += 1;
            direction.w += 1;
        } else if (path.slice(0, 2) === 'ne') {
            direction = traverse(path.slice(2));
            direction.n += 1;
            direction.e += 1;
        } else if (path.slice(0, 1) === 'e') {
            direction = traverse(path.slice(1));
            direction.e += 2;
        } else if (path.slice(0, 1) === 'w') {
            direction = traverse(path.slice(1));
            direction.w += 2;
        }
        return direction;
    }

    const minimizeDir = (direction) => {
        const dir = { ...direction };
        if (dir.s >= dir.n) {
            dir.s -= dir.n;
            dir.n = 0;
        } else {
            dir.n -= dir.s;
            dir.s = 0;
        }
        if (dir.e >= dir.w) {
            dir.e -= dir.w;
            dir.w = 0;
        } else {
            dir.w -= dir.e;
            dir.e = 0;
        }
        return dir;
    }

    const flipTile = ({ n, e, w, s}, map) => {
        const key = `${n},${e},${w},${s}`;
        if (map.has(key)) {
            map.set(key, !map.get(key))
        } else {
            map.set(key, true);
        }
    };
    
    const countBlackTile = (map) => {
        let count = 0;
        for (let key of map.keys()) {
            if (map.get(key)) {
                count++;
            }
        }
        return count;
    }

    const isBlack = ({ n, e, w, s}, map) => {
        const key = `${n},${e},${w},${s}`;
        if (map.has(key)) {
            return map.get(key);
        }
        return false;
    }
    
    const setWhiteIfNotPresent = ({ n, e, w, s}, map) => {
        const key = `${n},${e},${w},${s}`;
        if (!map.has(key)) {
            map.set(key, false);
        }
    }

    const setNeighbors = (key, map) => {
        const [n, e, w, s] = key.split(',').map(i => parseInt(i));
        if (map.get(key)) {
            setWhiteIfNotPresent(minimizeDir({ n: n+1, e: e+1, w, s }), map);
            setWhiteIfNotPresent(minimizeDir({ n: n+1, e: e, w: w+1, s }), map);
            setWhiteIfNotPresent(minimizeDir({ n: n, e: e+1, w, s: s+1 }), map);
            setWhiteIfNotPresent(minimizeDir({ n: n, e: e+1, w, s: s+1 }), map);
            setWhiteIfNotPresent(minimizeDir({ n: n, e, w: w+2, s }), map);
            setWhiteIfNotPresent(minimizeDir({ n, e: e+2, w, s }), map);
        }
    }

    let map = new Map();
    lines.forEach(path => {
        const dir = minimizeDir(traverse(path));
        flipTile(dir, map);
    });
    
    console.log(countBlackTile(map));

    for (let i = 0; i < 100; i++) {
        for (let key of map.keys()) {
            setNeighbors(key, map);
        }
        let newMap = new Map();
        for (let key of map.keys()) {
            const [n, e, w, s] = key.split(',').map(i => parseInt(i));
            let blackNeighbors = 0;
            const currentKey = `${n},${e},${w},${s}`;
            const current = isBlack({ n, e, w, s }, map);
            if (isBlack(minimizeDir({ n: n+1, e: e+1, w, s }), map)) {
                blackNeighbors++;
            }
            if (isBlack(minimizeDir({ n: n+1, e, w: w+1, s }), map)) {
                blackNeighbors++;
            }
            if (isBlack(minimizeDir({ n, e: e+1, w, s: s+1 }), map)) {
                blackNeighbors++;
            }
            if (isBlack(minimizeDir({ n, e, w: w+1, s: s+1 }), map)) {
                blackNeighbors++;
            }
            if (isBlack(minimizeDir({ n, e: e+2, w, s }), map)) {
                blackNeighbors++;
            }
            if (isBlack(minimizeDir({ n, e, w: w+2, s }), map)) {
                blackNeighbors++;
            }
            if (current) {
                if (blackNeighbors === 0 || blackNeighbors > 2) {
                    newMap.set(currentKey, false);
                } else {
                    newMap.set(currentKey, true);
                }
            } else {
                if (blackNeighbors === 2) {
                    newMap.set(currentKey, true);
                } else {
                    newMap.set(currentKey, false);
                }
            }
        }
        map = newMap;
    }
    console.log(countBlackTile(map));
});
