const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/input.txt');

fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
    const lines = data.match(/[^\r\n]+/g);

    let moons = getMoons(lines);

    let timeSteps = 9;

    do {
        // Iterate through each moon, compare it with the other moons
        // and adjust velocity.
        for (let a = 0; a < moons.length; a++) {
            for (let b = 0; b < moons.length; b++) {
                if (a == b)
                    continue;

                let m1 = moons[a],
                    m2 = moons[b];

                m1.applyGravity(m2);
            }
        }

        // Apply velocity to all moons
        moons.forEach(m => m.move());
    } while (timeSteps--);

    let total = moons.reduce((sum, m) => {
        let potential = Math.abs(m.position.x)
            + Math.abs(m.position.y)
            + Math.abs(m.position.z);

        let kinetic = Math.abs(m.velocity.x)
            + Math.abs(m.velocity.y)
            + Math.abs(m.velocity.z);

        return sum + (potential * kinetic);
    }, 0);

    console.log(total);
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
            },
            move: function() {
                this.position.x += this.velocity.x;
                this.position.y += this.velocity.y;
                this.position.z += this.velocity.z;
            },
            applyGravity: function(otherMoon) {
                if (otherMoon.position.x > this.position.x) {
                    this.velocity.x++;
                } else if (this.position.x > otherMoon.position.x) {
                    this.velocity.x--;
                }

                if (otherMoon.position.y > this.position.y) {
                    this.velocity.y++;
                } else if (this.position.y > otherMoon.position.y) {
                    this.velocity.y--;
                }

                if (otherMoon.position.z > this.position.z) {
                    this.velocity.z++;
                } else if (this.position.z > otherMoon.position.z) {
                    this.velocity.z--;
                }
            }
        }
    });
}
