

module.exports = {

    compute: function(program, input) {
        let position = 0, mode = -1;
        let instruction = null;
        let output = 0;

        let nextParam = () => {
            position++ && mode++;

            return calculateParameterValue(program, program[position], instruction.modes[mode]);
        };

        let nextWriteParam = () => {
            position++;

            return program[position];
        };

        do {
            instruction = getInstruction(program, position);

            let a, b, c, jumped = false;

            switch (instruction.opcode) {
                case 1: 
                    a = nextParam();
                    b = nextParam();
                    c = nextWriteParam();
                    
                    program[c] = a + b;
                break;
                case 2: 
                    a = nextParam();
                    b = nextParam();
                    c = nextWriteParam();
                    
                    program[c] = a * b;
                break;
                case 3: 
                    c = nextWriteParam();

                    program[c] = input;
                break;
                case 4: 
                    c = nextParam();

                    output = c;
                break;
                case 5: 
                    a = nextParam();
                    b = nextParam();

                    if (a != 0) {
                        position = b;
                        jumped = true;
                    }
                break;
                case 6: 
                    a = nextParam();
                    b = nextParam();

                    if (a == 0) {
                        position = b;
                        jumped = true;
                    }
                break;
                case 7: 
                    a = nextParam();
                    b = nextParam();
                    c = nextWriteParam();
                    
                    if (a < b) {
                        program[c] = 1;
                    } else {
                        program[c] = 0;
                    }
                break;
                case 8: 
                    a = nextParam();
                    b = nextParam();
                    c = nextWriteParam();
                    
                    if (a == b) {
                        program[c] = 1;
                    } else {
                        program[c] = 0;
                    }
                break;
                case 99:
                    return output;
            }

            if (!jumped) {
                position++;
            }
            
            mode = -1;
        } while (true);
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
