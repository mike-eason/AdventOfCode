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
                        let newInputs = state.inputCallback();

                        if (newInputs && newInputs.length) {
                            state.inputs = newInputs;
                        }

                        c = nextWriteParam();

                        let nextInput = state.inputs.splice(0, 1)[0];

                        state.program[c] = nextInput;
                    break;
                    case 4: 
                        c = nextParam();

                        state.outputs.push(c);

                        state.outputCallback(c);
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
            } while (true);
        }
    }
};

let grid = [];
let line = [];

let inputCallback = () => {
    // nothing to do here?
};

let outputCallback = (output) => {
    if (output == 10) {
        grid.push(line);
        line = [];
    } else {
        line.push(String.fromCharCode(output));
    }
};

let comp = computer(data, outputCallback, inputCallback);

comp.compute([]);

let intersections = [];

for (let y = 0; y < grid.length; y++) {
    for (x = 0; x < grid[y].length; x++) {
        let c = grid[y][x];

        if (c != '#')
            continue;

        let surroundingCount = 0;

        // get surrounding and count how many are scaffolds.
        // Try catch for a quick and dirty method.
        try {
            if (grid[y-1][x] === '#')
                surroundingCount++;
        } catch {}
        try {
            if (grid[y+1][x] === '#')
                surroundingCount++;
        } catch {}
        try {
            if (grid[y][x-1] === '#')
                surroundingCount++;
        } catch {}
        try {
            if (grid[y][x+1] === '#')
                surroundingCount++;
        } catch {}

        if (surroundingCount > 2)
            intersections.push({x, y});
    }
}

let result = intersections.reduce((sum, i) => {
    return sum + (i.x * i.y);
}, 0);

console.log(result);
