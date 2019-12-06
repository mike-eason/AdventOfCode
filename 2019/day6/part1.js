const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/input.txt');

fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
    const lines = data.match(/[^\r\n]+/g);

    const orbits = lines.map(l => {
        let line = l.split(')');

        return {
            body: line[0],
            sat: line[1]
        };
    });

    let count = orbits.length;

    let doRecusion = (orbit) => {
        let parent = orbits.find(x => x.sat == orbit.body);

        if (parent) {
            count++;
            doRecusion(parent);
        }
    };
    
    orbits.forEach(doRecusion);

    console.log(count);
});
