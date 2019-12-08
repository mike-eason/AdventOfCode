const fs = require('fs');
const path = require('path');
const computer = require('./computer');

const filePath = path.join(__dirname, '/input.txt');

fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
    data = data.split(',').map(x => parseInt(x));
    let phases = [];
    let input = 0;

    const getProgram = () => JSON.parse(JSON.stringify(data));

    let permutations = permute([0,1,2,3,4]);

    for (let i = 0; i < permutations.length; i++) {
        let p = permutations[i];

        let a = p[0],
            b = p[1],
            c = p[2],
            d = p[3],
            e = p[4];

        let phase = a.toString() + b.toString() + c.toString() + d.toString() + e.toString();

        let resultA = computer.compute(getProgram(), [a, input]);
        let resultB = computer.compute(getProgram(), [b, resultA]);
        let resultC = computer.compute(getProgram(), [c, resultB]);
        let resultD = computer.compute(getProgram(), [d, resultC]);
        let resultE = computer.compute(getProgram(), [e, resultD]);

        phases.push({
            phase,
            result: resultE
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
