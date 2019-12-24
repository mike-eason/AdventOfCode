const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/input.txt');

const data = fs.readFileSync(filePath, { encoding: 'utf8' });

const lines = data.match(/[^\r\n]+/g);

let mins = 0;

let grid = [];
let states = [];

// Load initial state.
for (let y = 0; y < lines.length; y++) {
    let line = lines[y];
    grid.push([]);

    for (let x = 0; x < line.length; x++) {
        grid[y][x] = line[x];
    }
}

while (true) {
    let newGrid = JSON.parse(JSON.stringify(grid));

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            let adjacent = 0;

            try {
                if (grid[y - 1][x] == '#') {
                    adjacent++;
                }
            } catch {}

            try {
                if (grid[y + 1][x] == '#') {
                    adjacent++;
                }
            } catch {}

            try {
                if (grid[y][x - 1] == '#') {
                    adjacent++;
                }
            } catch {}

            try {
                if (grid[y][x + 1] == '#') {
                    adjacent++;
                }
            } catch {}

            let isBug = grid[y][x] == '#';

            if (isBug) {
                if (adjacent != 1) {
                    newGrid[y][x] = '.';
                }
            } else {
                if ([1, 2].indexOf(adjacent) > -1) {
                    newGrid[y][x] = '#';
                }
            }
        }
    }

    grid = newGrid;
    mins++;

    //print(grid);

    let state = calculateRating(grid);

    if (states.indexOf(state) > -1) {
        console.log(`Mins: ${mins}, Rating: ${state}`);
        break;
    } else {
        states.push(state);
    }
}

function print(grid) {
    console.clear();

    for (let y = 0; y < grid.length; y++) {
        let line = '';
    
        for (let x = 0; x < grid.length; x++) {
            line += grid[y][x];
        }

        console.log(line);
    }
}

function calculateRating(grid) {
    let rating = 1;
    let actual = 0;

    for (let y = 0; y < grid.length; y++) {    
        for (let x = 0; x < grid.length; x++) {
            if (grid[y][x] == '#') {
                actual += rating;
            }

            rating = rating * 2;
        }
    }

    return actual;
}
