const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/input.txt');

let data = fs.readFileSync(filePath, { encoding: 'utf8' });

data = data.split(',').map(x => parseInt(x));

const computer = function(program, outputCallback, inputCallback) {
    const state = {
        program,
        position: 0,
        inputs: [],
        outputs: [],
        relativeBase: 0,
        outputCallback,
        inputCallback
    };

    function getInstruction(program, position) {
        let operation = program[position].toString().padStart(5, '0');
        let opcode = parseInt(operation.substr(operation.length - 2));
    
        // Get all parameter modes (read right to left)
        let modes = operation.substr(0, 3).split('').reverse().map(x => parseInt(x));
    
        return {
            operation,
            opcode,
            modes
        };
    }

    return {
        state,
        
        compute: function(inputs) {
            state.inputs = inputs;

            let mode = -1;
            let instruction = null;

            let expandMemory = (position) => {
                if (program.length - 1 < position) {
                    program[position] = 0;
                }
            };

            let nextParam = () => {
                state.position++;
                mode++;

                let parameter = state.program[state.position];
                let pmode = instruction.modes[mode];

                expandMemory(parameter);
                
                switch (pmode) {
                    case 0:                             // Position
                        return state.program[parameter];
                    case 1:                             // Immediate
                        return parameter;
                    case 2:                             // Relative
                        return state.program[parameter + state.relativeBase];
                }
            };

            let nextWriteParam = () => {
                state.position++;
                mode++;

                let parameter = state.program[state.position];
                let pmode = instruction.modes[mode];

                switch(pmode) {
                    case 0:
                        return parameter;
                    case 2:
                        return parameter + state.relativeBase;
                }
            };

            do {
                instruction = getInstruction(state.program, state.position);

                let a, b, c, jumped = false;
                let exitNow = false;

                switch (instruction.opcode) {
                    case 1: 
                        a = nextParam();
                        b = nextParam();
                        c = nextWriteParam();
                        
                        state.program[c] = a + b;
                    break;
                    case 2: 
                        a = nextParam();
                        b = nextParam();
                        c = nextWriteParam();
                        
                        state.program[c] = a * b;
                    break;
                    case 3: 
                        if (state.inputCallback) {
                            let newInputs = state.inputCallback();

                            if (newInputs && newInputs.length) {
                                state.inputs = newInputs;
                            }
                        }

                        c = nextWriteParam();

                        let nextInput = state.inputs.splice(0, 1)[0];

                        state.program[c] = nextInput;
                    break;
                    case 4: 
                        c = nextParam();

                        state.outputs.push(c);

                        if (state.outputCallback) {
                            state.outputCallback(c);
                        }

                        //exitNow = true;
                    break;
                    case 5: 
                        a = nextParam();
                        b = nextParam();

                        if (a != 0) {
                            state.position = b;
                            jumped = true;
                        }
                    break;
                    case 6: 
                        a = nextParam();
                        b = nextParam();

                        if (a == 0) {
                            state.position = b;
                            jumped = true;
                        }
                    break;
                    case 7: 
                        a = nextParam();
                        b = nextParam();
                        c = nextWriteParam();
                        
                        if (a < b) {
                            state.program[c] = 1;
                        } else {
                            state.program[c] = 0;
                        }
                    break;
                    case 8: 
                        a = nextParam();
                        b = nextParam();
                        c = nextWriteParam();
                        
                        if (a == b) {
                            state.program[c] = 1;
                        } else {
                            state.program[c] = 0;
                        }
                    break;
                    case 9:
                        c = nextParam();

                        state.relativeBase += c;
                    break;
                    case 99:
                        return state.outputs;
                }

                if (!jumped) {
                    state.position++;
                }
                
                mode = -1;

                if (exitNow)
                    return state.outputs;
            } while (true);
        },

        clone: function(outputCallback, inputCallback) {
            // Generate a new computer and copy this state into it.
            let newComp = computer(state.program,
                            outputCallback, inputCallback);

            newComp.state.inputs = state.inputs.slice();
            newComp.state.outputs = state.outputs.slice();
            newComp.state.position = state.position;
            newComp.state.relativeBase = state.relativeBase;

            return newComp;
        }
    }
};

const directions = {
    1: { x: 0, y: -1 }, // North
    2: { x: 0, y: 1 }, // South
    3: { x: -1, y: 0 }, // West
    4: { x: 1, y: 0 }, // East
};

let visited = [];
let queue = [];

// Push the very first position to start.

queue.push({
    x: 0,
    y: 0,
    path: []
});

while (queue.length) {
    let current = queue.shift(); // Take the first in the queue.
    
    if (!current) {
        console.log('Well shit.');
        break;
    }

    // Check to see if this position has already been visited.
    let vis = visited.find(v => v.x == current.x && v.y == current.y);

    if (vis) {
        continue;
    }

    // If we get to here them this is a new position, mark it
    // as visited.
    vis = { 
        x: current.x,
        y: current.y,
        isWall: false
    };

    visited.push(vis);

    // Loop through each direction (N, S, W, E)
    // and visit them.
    for (let d = 1; d < 5; d++) {
        let direction = directions[d];

        let nextX = current.x + direction.x,
            nextY = current.y + direction.y;

        // Get the new path.
        let newPath = [...current.path, d];

        // Run the program for the new path.
        let comp = computer(data.slice());

        let result = comp.compute(newPath).pop();

        // If the output is a 2 then we have found the end.
        if (result == 2) {
            visited.push({
                x: nextX,
                y: nextY,
                isWall: false,
                isEnd: true
            });

            queue.push({
                x: nextX,
                y: nextY,
                path: [...current.path, d]
            });
        }
        else if (result == 0) {
            // If its a 0, then its a wall so mark it as visited so
            // we don't try to move there.
            visited.push({
                x: nextX,
                y: nextY,
                isWall: true
            });
        }
        else {
            // Otherwise, its empty space to add it to the queue
            // to be visited later.
            queue.push({
                x: nextX,
                y: nextY,
                path: [...current.path, d]
            });
        }
    }
}

print(visited);

// Next step is to start from the end point and basically work
// backwards from before. Oxygenate the surrounding positions,
// and then oxygenate those positions and so on until everything
// is oxygenated.

// Plan is to get all of the corridors (we don't care about walls)
// and for each one, oxygenate its surrounding corridors.
let corridors = visited.filter(v => !v.isWall);
let end = corridors.find(v => v.isEnd);
let oxygenated = [];

end.time = 0; // Set the initial time for the end point.

queue = [end];

while (queue.length) {
    let current = queue.shift();

    // Get surrounding corridors, N, S, W, E.
    let surrounding = corridors.filter(c => {
        return (c.x == current.x - 1 && c.y == current.y)
            || (c.x == current.x + 1 && c.y == current.y)
            || (c.x == current.x && c.y == current.y - 1)
            || (c.x == current.x && c.y == current.y + 1);
    });

    // Remove the surrounding from the corridors list
    // as they are now deemed oxygenated (we don't want to visit them again).
    for (let i = 0; i < surrounding.length; i++) {
        let sur = surrounding[i];

        corridors.splice(corridors.indexOf(sur), 1);

        // Keep track of how much time has elapsed.
        // Key thing to note here is that oxygenation happens
        // all at the same time so if we are doing this branching logic
        // we need to keep track of time everywhere.
        sur.time = current.time + 1;
    }

    queue = queue.concat(surrounding);
    oxygenated = oxygenated.concat(surrounding);
}

// Find the last corridor that was oxygenated and find out
// how much time has elapsed.
let mins = oxygenated.sort((a, b) => b.time - a.time)[0].time;

console.log(mins);

function print(grid) {
    console.clear();

    // Find the grid size
    let minX = grid.sort((a, b) => a.x - b.x)[0].x;
    let maxX = grid.sort((a, b) => b.x - a.x)[0].x;
    let minY = grid.sort((a, b) => a.y - b.y)[0].y;
    let maxY = grid.sort((a, b) => b.y - a.y)[0].y;

    for (let y = minY; y <= maxY; y++) {
        let line = '';

        for (let x = minX; x <= maxX; x++) {
            let vis = grid.find(v => v.x == x && v.y == y);
            
            if (!vis) {
                line += ' ';
            } else {
                if (vis.isWall) {
                    line += '#';
                } else if (vis.isEnd) {
                    line += 'O';
                } else {
                    line += '.';
                }
            }
        }

        console.log(line);
    }
}
