const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/input.txt');

let data = fs.readFileSync(filePath, { encoding: 'utf8' });

data = data.split('').map(Number);

const repeat = 10000;
const iterations = 100;

// Get the offset number.
const offset = parseInt(data.slice(0, 7).join(''));

// Calculate the pattern to use but take only
// the data from the offset onwards.
// The bit before the offset will always be multiplied by 0 so
// the sum will always be 0.
data = getPattern(data, repeat).slice(offset);

const state = data.slice(); // Make a copy of the input
const nextState = [];

for (let i = 0; i < iterations; i++) {
    let count = 0;

    // Work backwards from end of the input to the start.
    for (let l = state.length - 1; l >= 0; l--) {
        count = (count + state[l]) % 10;
        nextState[l] = count;
    }

    // Copy the next state to the current state.
    for (let l = 0; l < state.length; l++) {
        state[l] = nextState[l];
    }
}

let result = state.slice(0, 8).join('');

console.log(result);


function getPattern(input, iterations) {
    let pattern = [];

    for (let i = 0; i < iterations; i++) {
        for (let z = 0; z < input.length; z++) {
            pattern[(input.length * i) + z] = input[z];
        }
    }

    return pattern;
}
