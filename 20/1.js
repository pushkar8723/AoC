process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const tiles = chunk.toString().split('\n\n').filter(item => item);
    // Write your code here
    const map = new Map();

    const print = (img) => {
        for (let i = 0; i < img.length; i++) {
            console.log(img[i].join(''));
        }
    }

    tiles.forEach(tile => {
        const lines = tile.split('\n').filter(item => item);
        const id = parseInt(lines[0].split(' ')[1]);
        lines.shift();
        const img = lines.map(line => line.split(''));
        const borders = {};
        borders.top = img[0].join('');
        borders.bottom = [...img[9]].reverse().join('');
        borders.left = '';
        for (let i = 9; i >= 0; i--) {
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
    let start;
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
            start = i;
        }
    }

    console.log(ans);

    const rotateImg = (img) => {
        const size = img.length;
        const newImg = Array(size).fill(null).map(() => Array(size));
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                newImg[i][j] = img[j][size - i - 1];
            }
        }
        return newImg;
    }

    const flipImgX = (img) => {
        const size = img.length;
        const newImg = Array(size).fill(null).map(() => Array(size));
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                newImg[i][j] = img[i][size - j - 1];
            }
        }
        return newImg;
    }

    const flipImgY = (img) => {
        const size = img.length;
        const newImg = Array(size).fill(null).map(() => Array(size));
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                newImg[i][j] = img[size - i - 1][j];
            }
        }
        return newImg;
    }

    const rotateLeft = (id) => {
        const { img, borders } = map.get(id);
        const newImg = rotateImg(img);
        map.set(id, {
            img: newImg,
            borders: {
                left: borders.top,
                top: borders.right,
                right: borders.bottom,
                bottom: borders.left,
            }
        });
        const edges = fit.get(id);
        const newEdges = {};
        if (edges.left) {
            newEdges.bottom = edges.left;
        }
        if (edges.top) {
            newEdges.left = edges.top;
        }
        if (edges.right) {
            newEdges.top = edges.right;
        }
        if (edges.bottom) {
            newEdges.right = edges.bottom;
        }
        fit.set(id, newEdges);
    }

    const flipX = (id) => {
        const { img, borders } = map.get(id);
        const newImg = flipImgX(img);
        map.set(id, {
            img: newImg,
            borders: {
                left: borders.right.split('').reverse().join(''),
                top: borders.top.split('').reverse().join(''),
                right: borders.left.split('').reverse().join(''),
                bottom: borders.bottom.split('').reverse().join(''),
            }
        });
        const edges = fit.get(id);
        const newEdges = {};
        if (edges.left) {
            newEdges.right = edges.left;
        }
        if (edges.right) {
            newEdges.left = edges.right;
        }
        if (edges.top) {
            newEdges.top = edges.top;
        }
        if (edges.bottom) {
            newEdges.bottom = edges.bottom;
        }
        fit.set(id, newEdges);
    }

    const flipY = (id) => {
        const { img, borders } = map.get(id);
        const newImg = flipImgY(img);
        map.set(id, {
            img: newImg,
            borders: {
                left: borders.left.split('').reverse().join(''),
                top: borders.bottom.split('').reverse().join(''),
                right: borders.right.split('').reverse().join(''),
                bottom: borders.top.split('').reverse().join(''),
            }
        });
        const edges = fit.get(id);
        const newEdges = {};
        if (edges.top) {
            newEdges.bottom = edges.top;
        }
        if (edges.bottom) {
            newEdges.top = edges.bottom;
        }
        if (edges.left) {
            newEdges.left = edges.left;
        }
        if (edges.right) {
            newEdges.right = edges.right;
        }
        fit.set(id, newEdges);
    }

    const opp = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left',
    };
    const gridSize = Math.sqrt(map.size);
    const grid = Array(gridSize).fill(null).map(() => Array(gridSize));
    const visited = new Set();
    const q = [];
    q.push({ id: start, x: 0, y: 0 });
    visited.add(start);
    while (q.length !== 0) {
        const { id, x, y, parent, parentId } = q.shift();
        const validNeighbors = [];
        grid[x][y] = id;
        if (x - 1 >= 0) {
            validNeighbors.push('top');
        }
        if (x + 1 < gridSize) {
            validNeighbors.push('bottom');
        }
        if (y - 1 >= 0) {
            validNeighbors.push('left');
        }
        if (y + 1 < gridSize) {
            validNeighbors.push('right');
        }

        let i = 0;
        while (i < 4) {
            const edges = fit.get(id);
            const neighbors = Object.keys(edges);
            const item = map.get(id);
            const parentItem = map.get(parentId);

            if (parent && edges[parent]) {
                if (parent === 'top') {
                    if (parentItem.borders.bottom === item.borders.top) {
                        flipX(id);
                        continue;
                    }
                }
                if (parent === 'bottom') {
                    if (parentItem.borders.top === item.borders.bottom) {
                        flipX(id);
                        continue;
                    }
                }
                if (parent === 'left') {
                    if (parentItem.borders.right === item.borders.left) {
                        flipY(id);
                        continue;
                    }
                }
                if (parent === 'right') {
                    if (parentItem.borders.left === item.borders.right) {
                        flipY(id);
                        continue;
                    }
                }
            }

            if (neighbors.sort().join(',') === validNeighbors.sort().join(',')) {
                if (!parent) {
                    break;
                } else if (item.borders[parent] === parentItem.borders[opp[parent]].split('').reverse().join('')) {
                    break;
                }
            }

            rotateLeft(id);
            i++;
        }

        if (i === 4) {
            console.log('error!');
            break;
        }

        const edges = fit.get(id);
        const neighbors = Object.keys(edges);
        neighbors.forEach(neighbor => {
            if (!visited.has(edges[neighbor])) {
                if (neighbor === 'top') {
                    q.push({ id: edges[neighbor], x: x - 1, y, parent: 'bottom', parentId: id });
                } else if (neighbor === 'left') {
                    q.push({ id: edges[neighbor], x, y: y - 1, parent: 'right', parentId: id });
                } else if (neighbor === 'bottom') {
                    q.push({ id: edges[neighbor], x: x + 1, y: y, parent: 'top', parentId: id });
                } else if (neighbor === 'right') {
                    q.push({ id: edges[neighbor], x, y: y + 1, parent: 'left', parentId: id });
                }
                visited.add(edges[neighbor]);
            }
        });
    }

    let bigImage = Array(gridSize * 8).fill(null).map(() => Array(gridSize * 8));
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            for (let x = 1; x < 9; x++) {
                for (let y = 1; y < 9; y++) {
                    bigImage[i * 8 + (x - 1)][j * 8 + (y - 1)] = map.get(grid[i][j]).img[x][y]
                }
            }
        }
    }

    let hashCount = 0;
    for (let i = 0; i < bigImage.length; i++) {
        for (let j = 0; j < bigImage[i].length; j++) {
            if (bigImage[i][j] === '#') {
                hashCount++;
            }
        }
    }

    const monster = [
        /..................#./,
        /#....##....##....###/,
        /.#..#..#..#..#..#.../,
    ]
    for (let i = 0; i < 3; i++) {
        if (i === 1) {
            bigImage = flipImgX(bigImage);
        } else if (i === 2) {
            bigImage = flipImgX(bigImage);
            bigImage = flipImgY(bigImage);
        }
        for (let j = 0; j < 4; j++) {
            let count = 0;
            for (let x = 0; x < bigImage.length - 3; x++) {
                for (let y = 0; y < bigImage[x].length - 20; y++) {
                    const area = [
                        bigImage[x].slice(y, y + 20).join(''),
                        bigImage[x + 1].slice(y, y + 20).join(''),
                        bigImage[x + 2].slice(y, y + 20).join(''),
                    ]
                    if (
                        area[0].match(monster[0]) &&
                        area[1].match(monster[1]) &&
                        area[2].match(monster[2])
                    ) {
                        count++;
                    }
                }
            }
            bigImage = rotateImg(bigImage);
            if (count > 0) {
                console.log(hashCount - (15 * count));
            }
        }
    }
});
