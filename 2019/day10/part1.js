const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/input.txt');

fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
    const lines = data.match(/[^\r\n]+/g);

    let width = lines[0].length,
        height = lines.length;

    let asteroids = [];

    // Find all asteroid positions.
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let position = lines[y][x];

            if (position == '#') {
                asteroids.push({
                    x, y,
                    sight: 0
                });
            }
        }
    }

    // Iterate through each asteroid, try to draw a straight line
    // from it to all others.
    asteroids.forEach(a => {
        asteroids.forEach(b => {
            if (a == b)
                return;
                
            let blocked = asteroids.find(c => {
                // Ignore the same asteroid.
                if (a == b || b == c || a == c)
                    return false;

                // If the line is blocked by any other asteroid, then ignore it.
                let isBlocked = intersects(a, b, c);

                // if (isBlocked) {
                //     console.log(`(${a.x},${a.y}) ---(${c.x},${c.y})---> (${b.x},${b.y})`);
                // }

                return isBlocked;
            });
            
            if (!blocked) {
                //console.log(`(${a.x},${a.y}) ---> (${b.x},${b.y})`);
                a.sight++;
            }
        });
    });

    let best = asteroids.sort((a, b) => b.sight - a.sight)[0];

    console.log(best);
});

// Ecludian distance
function distance(x1, x2, y1, y2) {
    let a = x1 - x2;
    let b = y1 - y2;

    return Math.sqrt(a * a + b * b);
}

function intersects(a, b, c) {
    let distAB = distance(a.x, b.x, a.y, b.y);
    let distAC = distance(a.x, c.x, a.y, c.y);
    let distBC = distance(b.x, c.x, b.y, c.y);

    // Use smaller precision.
    return (distAC + distBC).toPrecision(10) == distAB.toPrecision(10);
}
