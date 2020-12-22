const { rotateLeft, flipX, flipY, rotateImg, flipImgX, flipImgY, visualize } = require('./utils');
process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const tiles = chunk.toString().split('\n\n').filter(item => item);
    // Write your code here
    const map = new Map();

    tiles.forEach(tile => {
        const lines = tile.split('\n').filter(item => item);
        // Parse ID
        const id = parseInt(lines[0].split(' ')[1]);
        // Remove id line.
        lines.shift();
        // Construct image of the tile.
        const img = lines.map(line => line.split(''));

        // Storing borders in clockwise patterns.
        // This helps during rotation as we can directly
        // swap borders. However, for flip we will have
        // to orient the borders properly.
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
    // Figuring out neighbors of each tile by matching borders.
    // if reverse of border matches, then a flip would be required
    // for reconstructing the image. However, we are not concerned
    // with rotation or fliping of tiles yet.
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

        // Tiles with just 2 neighbors are the corners.
        // Hence we can compute our answer for part 1.
        if (count === 2) {
            ans *= i;
            // We can use any of the corner to start while
            // reconstruction of the image.
            start = i;
        }
    }

    // Part 1
    console.log(ans);

    const opp = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left',
    };

    // Constructing the grid now using simple BFS. Starting from a corner.
    // Rotating and fliping tiles at the same time.
    // The grid will contain just the tile number to be put at the position.
    // However, the tile in the map would be properly oriented after this.
    const gridSize = Math.sqrt(map.size);
    const grid = Array(gridSize).fill(null).map(() => Array(gridSize));
    const visited = new Set();
    const q = [];
    
    // Starting from a corner.
    q.push({ id: start, x: 0, y: 0 });
    visited.add(start);
    while (q.length !== 0) {
        const { id, x, y, parent, parentId } = q.shift();
        const validNeighbors = [];
        // Placing tile in the grid
        grid[x][y] = id;
        
        // Figuring out valid edges for tile in the proper orientation.
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

        // counter to safeguard rotation of tile for more than 4 times.
        let i = 0;
        while (i < 4) {
            const edges = fit.get(id);
            const neighbors = Object.keys(edges);
            const item = map.get(id);
            const parentItem = map.get(parentId);

            // If parent was marked for the current item, then use it as refrence
            // for proper orientation.
            if (parent && edges[parent]) {
                // item's top and parent's bottom border matches then the tile needs
                // to be flipped as we stored the border in clockwise pattern.
                // Similarly for other faces as well.
                // if we flip the tile then we are not counting it in rotation.
                // It is also likely that after this operation, the tile is properly oriented.
                if (parent === 'top') {
                    if (parentItem.borders.bottom === item.borders.top) {
                        flipX(id, map, fit);
                        continue;
                    }
                }
                if (parent === 'bottom') {
                    if (parentItem.borders.top === item.borders.bottom) {
                        flipX(id, map, fit);
                        continue;
                    }
                }
                if (parent === 'left') {
                    if (parentItem.borders.right === item.borders.left) {
                        flipY(id, map, fit);
                        continue;
                    }
                }
                if (parent === 'right') {
                    if (parentItem.borders.left === item.borders.right) {
                        flipY(id, map, fit);
                        continue;
                    }
                }
            }

            // Check if tile is oriented properly.
            if (neighbors.sort().join(',') === validNeighbors.sort().join(',')) {
                // if parent is not present, then this is the first tile.
                if (!parent) {
                    // We assume that first tile is now properly oriented.
                    break;
                } else if (item.borders[parent] === parentItem.borders[opp[parent]].split('').reverse().join('')) {
                    // If parent's contact border matches reverse of item's border,
                    // then the tile is oriented properly as we recorded borders in clockwise direction.
                    break;
                }
            }

            // Proper orientation is still not found. Rotate and keep checking.
            rotateLeft(id, map, fit);
            i++;
        }

        // We rotated 4 times and still didn't reach proper orientation.
        // This should not happen!
        if (i === 4) {
            console.log('error!');
            break;
        }

        // Push neighbors into queue and mark their parent as well.
        // So, that they can align themselves properly with parent.
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

    // We have tile number in grid now and tiles are properly oriented.
    // Removing the borders and creating actual image.
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

    // Counting number of # in the constructed image.
    let hashCount = 0;
    for (let i = 0; i < bigImage.length; i++) {
        for (let j = 0; j < bigImage[i].length; j++) {
            if (bigImage[i][j] === '#') {
                hashCount++;
            }
        }
    }

    // Regex to find the monster.
    const monster = [
        /..................#./,
        /#....##....##....###/,
        /.#..#..#..#..#..#.../,
    ]

    // Checking each area of size 20x3 for monster.
    for (let i = 0; i < 2; i++) {
        if (i === 1) {
            // Lets check after vertical flip.
            bigImage = flipImgX(bigImage);
        }
        for (let j = 0; j < 4; j++) {
            let count = 0;
            const positions = [];
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
                        // A monster found!
                        count++;
                        positions.push({ x, y });
                    }
                }
            }
            // If we found the monster, we have our answer for part 2.
            if (count > 0) {
                console.log(hashCount - (15 * count));
                visualize(bigImage, positions);
            }
            // Hmmm, lets check another orientation.
            bigImage = rotateImg(bigImage);
        }
    }
});
