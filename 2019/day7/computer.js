module.exports = function(program, phase) {
    const state = {
        program,
        position: 0,
        phase,
        inputs: [ phase ],
        outputs: [],
        initialized: false,
        finished: false
    };

    return {
        state,
        
        clear: function() {
            // state.inputs = [];
            state.outputs = [];
        },

        compute: function(inputs) {
            state.inputs = state.inputs.concat(inputs);
            //state.outputs = [];

            let mode = -1;
            let instruction = null;

            let nextParam = () => {
                state.position++ && mode++;

                return calculateParameterValue(state.program, state.program[state.position], 
                    instruction.modes[mode]);
            };

            let nextWriteParam = () => {
                state.position++;

                return state.program[state.position];
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

                        return state;
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
                    case 99:
                        state.finished = true;

                        // I don't know why this works but it does.
                        if (state.outputs.length == 0) {
                            state.outputs = state.inputs;
                        }
                        
                        return state;
                }

                if (!jumped) {
                    state.position++;
                }
                
                mode = -1;
            } while (true);
        }
    }
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

function calculateParameterValue(program, parameter, mode) {
    switch (mode) {
        case 0:                             // Position
            return program[parameter];
        case 1:                             // Immediate
            return parameter;
        default:
            throw new Error('Unknown parameter mode: ' + mode);
    }
}
