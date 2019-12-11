const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/input.txt');

fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
    data = data.split(',').map(x => parseInt(x));

    let robot = {
        x: 0,
        y: 0,
        direction: 0,
        rotate: function (value) {
            switch (value) {
                case 0: this.direction--; break;
                case 1: this.direction++; break;
            }
    
            if (this.direction < 0) this.direction = 3;
            if (this.direction > 3) this.direction = 0;
        },
        move: function() {
            switch (this.direction) {
                case 0: this.y--; break;
                case 1: this.x++; break;
                case 2: this.y++; break;
                case 3: this.x--; break;
            }
        }
    };

    let panels = [];

    let getPanelAt = (x, y) => {
        let panel = panels.find(p => p.x == x && p.y === y);

        if (!panel) {
            panel = { x, y, color: 0 };

            panels.push(panel);
        }

        return panel;
    };

    let paintPanel = (panel, color) => {
        panel.color = color;
    };

    // If painting is false then move robot,
    // otherwise paint the panel
    let painting = true;

    let outputCallback = (output) => {
        // Get the current panel the robot is sitting on.
        let panel = getPanelAt(robot.x, robot.y);

        if (painting) {
            // Paint it.
            paintPanel(panel, output);
        } else {
            // Rotate by output value
            robot.rotate(output);
            
            // Move the robot to the next panel based on on its direction
            robot.move();

            // Get the current panel the robot is sitting on after moving.
            let nextInput = getPanelAt(robot.x, robot.y).color;

            comp.state.inputs = [nextInput];
        }

        painting = !painting;
    };

    let comp = computer(data, outputCallback);

    comp.compute([1]);

    // Get the min y and x and then iterate through each line
    // and print it to the console.
    let minY = panels.sort((a, b) => a.y - b.y)[0].y;
    let maxY = panels.sort((a, b) => b.y - a.y)[0].y;
    let minX = panels.sort((a, b) => a.x - b.x)[0].x;
    let maxX = panels.sort((a, b) => b.x - a.x)[0].x;

    for (let y = minY; y <= maxY; y++) {
        let line = '';

        for (let x = minX; x <= maxX; x++) {
            let panel = panels.find(p => p.x == x && p.y == y);

            if (panel) {
                switch (panel.color) {
                    case 0: line += '⬛'; break;
                    case 1: line += '⬜'; break;
                }
            } else {
                line += '⬛';
            }
        }

        console.log(line);
    }
});

const computer = function(program, outputCallback) {
    const state = {
        program,
        position: 0,
        inputs: [],
        outputs: [],
        relativeBase: 0,
        outputCallback
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
