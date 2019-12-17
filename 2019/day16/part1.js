const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/input.txt');

let data = fs.readFileSync(filePath, { encoding: 'utf8' });

data = data.split('').map(x => parseInt(x));

const basePattern = [0, 1, 0, -1];

let maxPhases = 100;
let phases = [data];

while (maxPhases--) {
    let phase = phases[phases.length - 1];
    let nextPhase = [];
    
    for (let i = 0; i < phase.length; i++) {
        // Get the pattern for the current position.
        let pattern = getPattern(i, phase.length);

        // Go through each item in the phase and execute the pattern.
        let temp = [];

        for (let z = 0; z < phase.length; z++) {
            let p = phase[z];
            let t = pattern[z];

            temp.push(p * t);
        }

        let res = temp.reduce((sum, x) => {
            return sum + x;
        }, 0);

        let num = res.toString()[res.toString().length - 1];

        nextPhase.push(parseInt(num));
    }

    phases.push(nextPhase);
}

console.log(phases[phases.length - 1].slice(0, 8).join(''));

function getPattern(position, length, offset = 1) {
    let patternItemCount = position + 1;
    let patternPosition = 0;
    let pattern = [];

    while (pattern.length < length + 1) { // Do length + 1 so there is a bit of leeway when we take the offset.
        for (let z = 0; z < patternItemCount; z++) {
            pattern.push(basePattern[patternPosition]);
        }

        patternPosition++;

        if (patternPosition > basePattern.length - 1) {
            patternPosition = 0;
        }
    }

    return pattern.slice(1);    
}
