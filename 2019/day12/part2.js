const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/input.txt');

fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
    const lines = data.match(/[^\r\n]+/g);

    let moons = getMoons(lines);

    // We need to keep track of the repetition period of each axis
    // (x y and z). In order to achieve that, we calculate how many
    // ticks it takes for each axis to complete a rotation.
    let periodX = 0,
        periodY = 0,
        periodZ = 0;

    periodX = calculateOrbitPeriod(moons,
            methods.getXPos, methods.getXVel,
            methods.applyGravityX, methods.moveX);

    // Reset in between calculations.
    moons = getMoons(lines);

    periodY = calculateOrbitPeriod(moons,
            methods.getYPos, methods.getYVel,
            methods.applyGravityY, methods.moveY);
            
    moons = getMoons(lines);

    periodZ = calculateOrbitPeriod(moons,
            methods.getZPos, methods.getZVel,
            methods.applyGravityZ, methods.moveZ);

    // The crazy part is here. Calculate the least common multiple for
    // all 3 periods, this should give us the number of steps
    // it takes to repeat a previous step.
    let result = lcm(lcm(periodX, periodY), periodZ);

    console.log(result);
});

function getMoons(data) {
    let regex = /<x=(-?\d+),\sy=(-?\d+),\sz=(-?\d+)>/;

    return data.map(l => {
        let match = regex.exec(l);

        return {
            position: {
                x: parseInt(match[1]),
                y: parseInt(match[2]),
                z: parseInt(match[3])
            },
            velocity: {
                x: 0,
                y: 0,
                z: 0
            }
        }
    });
}

function calculateOrbitPeriod(moons, 
    getAxisPosMethod, getAxisVelMethod,         // Pass in functions -> Crazy shit
    applyGravityAxisMethod, moveAxisMethod) {
    // Run the iteration until the axis has finished
    // a full rotation.
    let states = [];

    do {
        // Iterate through each moon, compare it with the other moons
        // and adjust velocity. Only apply to 1 axis.
        for (let a = 0; a < moons.length; a++) {
            for (let b = 0; b < moons.length; b++) {
                if (a == b)
                    continue;

                let m1 = moons[a],
                    m2 = moons[b];

                applyGravityAxisMethod(m1, m2);
            }
        }

        // Apply velocity to all moons for a given axis
        moons.forEach(m => moveAxisMethod(m));

        // I guess a string is best to save the state as.
        let state = moons.map(m => {
            return `<pos=${getAxisPosMethod(m)},vel=${getAxisVelMethod(m)}>`;
        }).join();

        // If the state already exists then break out.
        let existingState = states.find(x => x === state);

        if (existingState)
            break;

        states.push(state);
    } while (true);

    return states.length;
}

const methods = {
    getXPos: function(moon) {
        return moon.position.x;
    },
    getYPos: function(moon) {
        return moon.position.y;
    },
    getZPos: function(moon) {
        return moon.position.z;
    },
    getXVel: function(moon) {
        return moon.velocity.x;
    },
    getYVel: function(moon) {
        return moon.velocity.y;
    },
    getZVel: function(moon) {
        return moon.velocity.z;
    },
    moveX: function(moon) {
        moon.position.x += moon.velocity.x;
    },
    moveY: function(moon) {
        moon.position.y += moon.velocity.y;
    },
    moveZ: function(moon) {
        moon.position.z += moon.velocity.z;
    },
    applyGravityX: function(moon, otherMoon) {
        if (otherMoon.position.x > moon.position.x) {
            moon.velocity.x++;
        } else if (moon.position.x > otherMoon.position.x) {
            moon.velocity.x--;
        }
    },
    applyGravityY: function(moon, otherMoon) {
        if (otherMoon.position.y > moon.position.y) {
            moon.velocity.y++;
        } else if (moon.position.y > otherMoon.position.y) {
            moon.velocity.y--;
        }

    },
    applyGravityZ: function(moon, otherMoon) {
        if (otherMoon.position.z > moon.position.z) {
            moon.velocity.z++;
        } else if (moon.position.z > otherMoon.position.z) {
            moon.velocity.z--;
        }
    }
}

// https://www.w3resource.com/javascript-exercises/javascript-math-exercise-10.php
function lcm(x, y) {
    if ((typeof x !== 'number') || (typeof y !== 'number')) 
     return false;
   return (!x || !y) ? 0 : Math.abs((x * y) / gcd(x, y));
 }
 
 function gcd(x, y) {
   x = Math.abs(x);
   y = Math.abs(y);
   while(y) {
     var t = y;
     y = x % y;
     x = t;
   }
   return x;
 }
