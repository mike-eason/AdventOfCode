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

    let wires = wireCommands.map(commands => {
        let segments = [];
        let x = 0, y = 0, steps = 0;

        commands.forEach(command => {
            switch(command.direction) {
                case 'U': 
                    while (command.count--) {
                        segments.push({
                            x, y: y--,
                            steps
                        });

                        steps++;
                    }
                    break;
                case 'D': 
                    while (command.count--) {
                        segments.push({
                            x, y: y++,
                            steps
                        });

                        steps++;
                    }
                    break;
                case 'L': 
                    while (command.count--) {
                        segments.push({
                            x: x--, y,
                            steps
                        });

                        steps++;
                    }
                    break;
                case 'R': 
                    while (command.count--) {
                        segments.push({
                            x: x++, y,
                            steps
                        });

                        steps++;
                    }
                    break;
            }
        });

        return segments;
    });

    let wireA = wires[0];
    let wireB = wires[1];

    let intersectons = wireA.filter(a => {
        return wireB.find(b => b.x && b.y && b.x == a.x && b.y == a.y) != null;
    });

    intersectons.forEach(i => {
        i.distance = manhattanDistance(0, 0, i.x, i.y);
        
        let segmentA = wireA.find(a => a.x == i.x && a.y == i.y);
        let segmentB = wireB.find(a => a.x == i.x && a.y == i.y);

        i.combinedSteps = segmentA.steps + segmentB.steps;
    });

    let closest = intersectons.sort((a, b) => a.combinedSteps - b.combinedSteps)[0];

    console.log(closest.combinedSteps);
});

function manhattanDistance(aX, aY, bX, bY) {
    return Math.abs(bX - aX) + Math.abs(bY - aY);
}
