const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/input.txt');

fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
    const lines = data.match(/[^\r\n]+/g);
    
    let wireCommands = lines.map(line => {
        return line.split(',').map(sub => {
            return {
                direction: sub.substring(0, 1),
                count: sub.substring(1),
            };
        });
    });

    const directions = {
        'U': { x: 0, y: -1 },
        'D': { x: 0, y: 1 },
        'R': { x: 1, y: 0 },
        'L': { x: -1, y: 0 },
    };

    let wires = wireCommands.map(commands => {
        let segments = [];
        let x = 0, y = 0, steps = 0;

        commands.forEach(command => {
            let dir = directions[command.direction];

            while (command.count--) {
                segments.push({ x, y, steps });

                x += dir.x;
                y += dir.y;
                steps++;
            }
        });

        return segments;
    });

    let intersectons = wires[0].filter(a => {
        return wires[1].find(b => b.x == a.x && b.y == a.y) != null;
    });

    intersectons.forEach(i => {
        i.distance = manhattanDistance(0, 0, i.x, i.y);
        
        let segmentA = wires[0].find(a => a.x == i.x && a.y == i.y);
        let segmentB = wires[1].find(b => b.x == i.x && b.y == i.y);

        i.combinedSteps = segmentA.steps + segmentB.steps;
    });

    let closest = intersectons.sort((a, b) => a.combinedSteps - b.combinedSteps)[1];

    console.log(closest.combinedSteps);
});

function manhattanDistance(aX, aY, bX, bY) {
    return Math.abs(bX - aX) + Math.abs(bY - aY);
}
