process.stdin.resume();
process.stdin.setEncoding('utf8');

const countPixel = (layer) => {
    const pixels = layer.split('');
    const result = {
        '0': 0,
        '1': 0,
        '2': 0
    };
    pixels.forEach(pixel => {
        result[pixel]++;
    });
    return result
}

process.stdin.on('data', function (chunk) {
    const line = chunk.toString().split('\n')[0];
    const layers = [];
    const height = 6;
    const width = 25;
    for (let i = 0; i < line.length; i += width * height) {
        layers.push(line.substring(i, i + width * height));
    }
    const pixelCount = layers.map(layer => countPixel(layer));
    pixelCount.sort((a, b) => (a[0] - b[0]));
    console.log(pixelCount[0][1] * pixelCount[0][2]);
    const image = [];
    for (let i = 0; i < height; i++) {
        const row = [];
        for (let j = 0; j < width; j++) {
            let k;
            for (k = 0; k < layers.length; k++) {
                const pixel = layers[k][i * width + j];
                if (pixel === '0') {
                    row.push(' ');
                    break;
                } else if (pixel === '1') {
                    row.push('#');
                    break;
                }
            }
            if (k === layers.length) {
                row.push(' ');
            }
        }
        image.push(row);
    }
    image.forEach(row => console.log(row.join('')));
});
