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



// Check the co-ordinates from the left edge (x = 0) until we reach the beam. 
// This will be the BOTTOM LEFT corner of the box. We can then check to see 
// if the TOP RIGHT is in the beam also. If it is then we can assume that the 
// TOP LEFT and BOTTOM RIGHT are also in the beam.

let x = 0, y = 100;

do {
    while (!isInBeam(x, y)) {
        x++;
    }
    
    if (isInBeam(x + 99, y - 99)) {
        console.log(x * 10000 + (y - 99));
        break;
    }
} while (y++);

function isInBeam(x, y) {
    let comp = computer(data.slice(0));

    comp.compute([x, y]);

    return comp.state.outputs[0] === 1;
}
