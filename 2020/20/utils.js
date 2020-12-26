/**
 * Prints the image. Used for debugging.
 */
const print = (img) => {
    for (let i = 0; i < img.length; i++) {
        console.log(img[i].join(''));
    }
}

/**
 * Rotates image anti-clockwise
 */
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

/**
 * Flips image vertically.
 */
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

/**
 * Flips image horizontally.
 */
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

/**
 * Rotates the given tile anti-clockwise.
 * Also updates map and fit variables to keep data consistent.
 */
const rotateLeft = (id, map, fit) => {
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

/**
 * Flips the given tile vertically.
 * Also updates map and fit variables to keep data consistent.
 */
const flipX = (id, map, fit) => {
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

/**
 * Flips the given tile horizontally.
 * Also updates map and fit variables to keep data consistent.
 */
const flipY = (id, map, fit) => {
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

/**
 * Visualize monster in image at given positions.
 */
//..................#.
//#....##....##....###
//.#..#..#..#..#..#...
const visualize = (img, positions) => {
    // Deep copy img
    let newImg = [...img];
    newImg = newImg.map(i => [...i]);

    const sub = [
        [18],
        [0, 5, 6, 11, 12, 17, 18, 19],
        [1, 4, 7, 10, 13, 16]
    ];

    positions.forEach(pos => {
        sub.forEach((row, index) => {
            row.forEach(cell => {
                newImg[pos.x + index][pos.y + cell] = 'O';
            });
        });
    });

    newImg = newImg.map(line => line.map(cell => cell === '.' ? ' ' : cell));
    print(newImg);
}

module.exports = {
    print,
    rotateImg,
    flipImgX,
    flipImgY,
    rotateLeft,
    flipX,
    flipY,
    visualize,
};
