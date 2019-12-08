const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/input.txt');

fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
    let width = 25;
    let height = 6;
    let layer = width * height;

    data = data.split('').map(x => parseInt(x));

    let layers = [];

    do {
        let chunk = data.splice(0, layer);

        layers.push(chunk);
    } while (data.length);

    let fewest = layers.sort((a, b) => {
        return a.filter(x => x == 0).length
            - b.filter(x => x == 0).length;
    })[0];

    let sum = fewest.filter(x => x == 1).length
            * fewest.filter(x => x == 2).length;

    console.log(sum);
});
