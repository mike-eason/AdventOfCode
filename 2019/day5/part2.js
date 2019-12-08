const fs = require('fs');
const path = require('path');
const computer = require('./computer');

const filePath = path.join(__dirname, '/input.txt');

fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
    let arr = data.split(',').map(x => parseInt(x));

    let input = 5;

    let output = computer.compute(arr, input);

    console.log(output);
});
