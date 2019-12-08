const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/input.txt');

fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
    let width = 25;
    let height = 6;
    let dimensions = width * height;

    data = data.split('').map(x => parseInt(x));

    let layers = [];

    do {
        let chunk = data.splice(0, dimensions);

        layers.push(chunk);
    } while (data.length);

    // Go through each pixel and find the first layer that is not transparent.
    let p = 0;
    let visible = [];

    do {
        for (let l = 0; l < layers.length; l++) {
            let layer = layers[l];
            let pixel = layer[p];

            if (pixel !== 2) {
                visible.push(pixel);
                break;
            }
        }

        p++;
    } while (p < dimensions);

    // Print the image to the console.
    for (let y = 0; y < height; y++) {
        let line = '';

        for (let x = 0; x < width; x++) {
            let p = visible.splice(0, 1)[0];

            switch (p) {
                case 0: line += '⬛'; break;
                case 1: line += '⬜'; break;
            }
        }

        console.log(line);
    }
});
