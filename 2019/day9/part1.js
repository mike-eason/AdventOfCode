const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/input.txt');

fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
    data = data.split(',').map(x => parseInt(x));

    let comp = computer(data, 0);

    let inputs = [1];

    let result = comp.compute(inputs);

    console.log(result.join());
});

const computer = function(program) {
    const state = {
        program,
        position: 0,
        inputs: [],
        outputs: [],
        relativeBase: 0
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
                        c = nextWriteParam();

                        let nextInput = state.inputs.splice(0, 1)[0];

                        state.program[c] = nextInput;
                    break;
                    case 4: 
                        c = nextParam();

                        state.outputs.push(c);
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
