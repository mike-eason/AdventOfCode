const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/input.txt');

fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
    const nums = data.split('-').map(x => parseInt(x));

    let range = [...Array(nums[1] + 1).keys()].slice(nums[0]);

    // Match ascending.
    const r1 = /^0*1*2*3*4*5*6*7*8*9*$/;
    let valid1 = range.filter(x => r1.test(x));

    // Match double numbers
    const r2 = /00|11|22|33|44|55|66|77|88|99/;
    let valid2 = valid1.filter(x => r2.test(x));

    console.log(valid2.length);
});
