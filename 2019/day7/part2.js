const fs = require('fs');
const path = require('path');
const computer = require('./computer');

const filePath = path.join(__dirname, '/input.txt');

fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
    data = data.split(',').map(x => parseInt(x));
    let phases = [];

    const getProgram = () => JSON.parse(JSON.stringify(data));

    let permutations = permute([5,6,7,8,9]);

    for (let i = 0; i < permutations.length; i++) {
        let p = permutations[i];

        let a = p[0],
            b = p[1],
            c = p[2],
            d = p[3],
            e = p[4];

        let phase = a.toString() + b.toString() + c.toString() + d.toString() + e.toString();

        let ampA = computer(getProgram(), a);
        let ampB = computer(getProgram(), b);
        let ampC = computer(getProgram(), c);
        let ampD = computer(getProgram(), d);
        let ampE = computer(getProgram(), e);

        // Setup first run.
        ampE.state.outputs = [0];
        
        // Run through until ampE is finished
        do {
            ampA.compute(ampE.state.outputs);
            ampE.clear();

            ampB.compute(ampA.state.outputs);
            ampA.clear();

            ampC.compute(ampB.state.outputs);
            ampB.clear();

            ampD.compute(ampC.state.outputs);
            ampC.clear();

            ampE.compute(ampD.state.outputs);
            ampD.clear();
        } while (!ampE.state.finished);

        phases.push({
            phase,
            result: ampE.state.outputs[0]
        });
    }
    
    let max = phases.sort((a, b) => b.result - a.result)[0];

    console.log(max);
});

/* Stole this from https://stackoverflow.com/questions/9960908/permutations-in-javascript */
let permArr = [],
    usedChars = [];

function permute(input) {
    
  let i, ch;
  for (i = 0; i < input.length; i++) {
    ch = input.splice(i, 1)[0];
    usedChars.push(ch);
    if (input.length == 0) {
      permArr.push(usedChars.slice());
    }
    permute(input);
    input.splice(i, 0, ch);
    usedChars.pop();
  }
  return permArr
};
