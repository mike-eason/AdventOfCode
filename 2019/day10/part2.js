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

                return isBlocked;
            });
            
            if (!blocked) {
                a.sight++;
            }
        });
    });

    let base = asteroids.sort((a, b) => b.sight - a.sight)[0];

    console.log(`Base: ${base.x},${base.y}`);

    asteroids.splice(asteroids.indexOf(base), 1);

    // Work out every angle of all asteroids relative
    // to the base asteroid.
    asteroids.forEach(a => {
        a.degrees = angle(base.x, a.x, base.y, a.y);
        a.distance = distance(base.x, a.x, base.y, a.y);
    });

    let destroyed = [];

    // Get every possible degrees.
    // Order them by degrees so that when we iterate
    // through the list later it will be in order.
    let allAngles = asteroids
        .map(a => a.degrees)
        .sort((a, b) => a - b);

    // Distinct to get only unique angles.
    allAngles = [...new Set(allAngles)];
        
    // Get the starting angle
    let currentAngle = allAngles.findIndex(d => d === -90);

    do {
        // Get all asteroids with the given angle and
        // pick the closest one.
        let closest = asteroids
            .filter(a => a.degrees === allAngles[currentAngle])
            .sort((a, b) => a.distance - b.distance)[0];

        // Destroy it.
        destroyed.push(asteroids.splice(asteroids.indexOf(closest), 1)[0]);

        console.log(`Destroyed: ${closest.x},${closest.y}`);

        currentAngle++;

        if (currentAngle > allAngles.length - 1) {
            currentAngle = 0;
        }
    } while (destroyed.length < 200);

    let last = destroyed[destroyed.length - 1];
    let result = last.x * 100 + last.y;

    console.log(result);
});

// Ecludian distance
function distance(x1, x2, y1, y2) {
    let a = x1 - x2;
    let b = y1 - y2;

    return Math.sqrt((a * a) + (b * b));
}

function angle(x1, x2, y1, y2) {
    return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
}

function intersects(a, b, c) {
    let distAB = distance(a.x, b.x, a.y, b.y);
    let distAC = distance(a.x, c.x, a.y, c.y);
    let distBC = distance(b.x, c.x, b.y, c.y);

    // Use smaller precision.
    return (distAC + distBC).toPrecision(10) == distAB.toPrecision(10);
}
