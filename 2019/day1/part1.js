const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/input.txt');

fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
    const lines = data.match(/[^\r\n]+/g);

    let result = lines.reduce((total, current) => {
        return total + Math.floor(current / 3) - 2;
    }, 0);

    console.log(result);
});
