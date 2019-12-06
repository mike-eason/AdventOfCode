const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/input.txt');

fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
    const lines = data.match(/[^\r\n]+/g);

    const orbits = lines.map(l => {
        let line = l.split(')');

        return {
            body: line[0],
            sat: line[1]
        };
    });

    let youSteps = calculateStepsToStart(orbits, 'YOU');
    let sanSteps = calculateStepsToStart(orbits, 'SAN');

    for (let i = 0; i < youSteps.length; i++) {
        let you = youSteps[i];
        let san = sanSteps.find(x => x.orbit.body == you.orbit.body);

        if (san) {
            console.log(you.stepCount + san.stepCount);
            break;
        }
    }
});

function calculateStepsToStart(orbits, label) {
    let steps = [], parent, stepCount = 0;
    let orbit = orbits.find(x => x.sat == label);

    do {
        stepCount++;
        parent = orbits.find(x => x.sat == orbit.body)

        if (parent) {
            steps.push({
                orbit: parent,
                stepCount
            });

            orbit = parent;
        }
    } while(parent != null);

    return steps;
}
