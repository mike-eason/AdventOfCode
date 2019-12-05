const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/input.txt');

const program = {
    '1': {
        parameters: 3,
        method: function(instruction, arr) {
            let a = calculateParameterValue(instruction.parameters[0], arr),
                b = calculateParameterValue(instruction.parameters[1], arr),
                o = instruction.parameters[2].value;

            console.log(`${0}(${arr[o]} = ${a} + ${b} (${a + b}))`);

            arr[o] = a + b;
        }
    },
    '2': {
        parameters: 3,
        method: function(instruction, arr) {
            let a = calculateParameterValue(instruction.parameters[0], arr),
                b = calculateParameterValue(instruction.parameters[1], arr),
                o = instruction.parameters[2].value;

            console.log(`${0}(${arr[o]} = ${a} * ${b} (${a * b}))`);
            
            arr[o] = a * b;
        }
    },
    '3': {
        parameters: 1,
        method: function(instruction, arr, input) {
            console.log(`Input: ${input} -> ${instruction.parameters[0].value}(${arr[instruction.parameters[0].value]})`);

            arr[instruction.parameters[0].value] = input;
        }
    },
    '4': {
        parameters: 1,
        method: function(instruction, arr) {
            let a = arr[instruction.parameters[0].value];
            
            console.log(`Output: ${a}`);
        }
    },
    '5': {
        parameters: 2,
        method: function(instruction, arr) {
            let a = calculateParameterValue(instruction.parameters[0], arr),
                b = calculateParameterValue(instruction.parameters[1], arr);

            if (a != 0) {
                console.log(`${a} != 0 -> Moving to ${b}(${arr[b]})`);

                return b;
            }
        }
    },
    '6': {
        parameters: 2,
        method: function(instruction, arr) {
            let a = calculateParameterValue(instruction.parameters[0], arr),
                b = calculateParameterValue(instruction.parameters[1], arr);

            if (a == 0) {
                console.log(`${a} == 0 -> Moving to ${b}(${arr[b]})`);
                
                return b;
            }
        }
    },
    '7': {
        parameters: 3,
        method: function(instruction, arr) {
            let a = calculateParameterValue(instruction.parameters[0], arr),
                b = calculateParameterValue(instruction.parameters[1], arr),
                o = instruction.parameters[2].value;

            if (a < b) {
                console.log(`${a} < ${b} -> ${o}(${arr[o]}) = 1`);
                
                arr[o] = 1;
            } else {
                console.log(`${a} >= ${b} -> ${o}(${arr[o]}) = 0`);
                
                arr[o] = 0;
            }
        }
    },
    '8': {
        parameters: 3,
        method: function(instruction, arr) {
            let a = calculateParameterValue(instruction.parameters[0], arr),
                b = calculateParameterValue(instruction.parameters[1], arr),
                o = instruction.parameters[2].value;

            if (a == b) {
                console.log(`${a} == ${b} -> ${o}(${arr[o]}) = 1`);
                
                arr[o] = 1;
            } else {
                console.log(`${a} != ${b} -> ${o}(${arr[o]}) = 0`);
                
                arr[o] = 0;
            }
        }
    },
    '99': {
        parameters: 0,
        method: function() {
            console.log('Exit');
        }
    },
};

fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
    let arr = data.split(',').map(x => parseInt(x));

    let input = 5;
    let instruction;
    let position = 0;

    do {
        instruction = getInstruction(position, arr);

        let operation = program[instruction.opcode.toString()].method;

        let pointer = operation(instruction, arr, input);

        if (pointer != null) {
            position = pointer;
        } else {
            position += instruction.length;
        }
    } while (instruction.opcode != 99);
});

function getInstruction(position, arr) {
    let operation = arr[position].toString();
    let opcode = parseInt(operation.substr(operation.length - 2));
    let parameterCount = program[opcode.toString()].parameters;
    
    let fullOperation = operation.padStart(2 + parameterCount, '0');

    // Get all parameter modes (read right to left)
    let pmodes = fullOperation.substr(0, parameterCount).split('').reverse().map(x => parseInt(x));

    // Get all parameter values (read left to right)
    let pvalues = [];

    for (let i = position + 1; i <= position + parameterCount; i++) {
        pvalues.push(arr[i]);
    }

    let parameters = [];

    for (let i = 0; i < parameterCount; i++) {
        parameters.push({
            value: pvalues[i],
            mode: pmodes[i]
        });
    }

    return {
        position,
        opcode,
        length: 1 + parameterCount,
        parameters
    };
}

function calculateParameterValue(parameter, arr) {
    switch (parameter.mode) {
        case 0:                             // Position
            return arr[parameter.value];
        case 1:                             // Immediate
            return parameter.value;
        default:
            throw new Error('Unknown parameter mode: ' + parameter.mode);
    }
}
