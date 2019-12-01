const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/input.txt');

fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
    const lines = data.match(/[^\r\n]+/g);

    const calc = x => Math.floor(x / 3) - 2;

    let result = lines.reduce((total, current) => {
        let fuels = [ calc(current) ],
            index = 0,
            next = 0;

        do {
            next = calc(fuels[index]);

            next && fuels.push(next) && index++;
        } while(next > 0);

        return total + fuels.reduce((a, b) => a + b);
    }, 0);

    console.log(result);
});
