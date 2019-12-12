const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/input.txt');

fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
    const lines = data.match(/[^\r\n]+/g);

    let regex = /<x=(-?\d+),\sy=(-?\d+),\sz=(-?\d+)>/;

    let moons = lines.map(l => {
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
            compared: []
        }
    });

    let timeSteps = 999;

    do {
        // Iterate through each moon, compare it with the other moons
        // and adjust velocity.
        moons.forEach(m1 => {
            moons.forEach(m2 => {
                if (m1 == m2)
                    return;

                if (m1.compared.find(x => x == m2) || m2.compared.find(x => x == m1))
                    return;

                if (m2.position.x > m1.position.x) {
                    m1.velocity.x++;
                    m2.velocity.x--;
                } else if (m1.position.x > m2.position.x) {
                    m1.velocity.x--;
                    m2.velocity.x++;
                }

                if (m2.position.y > m1.position.y) {
                    m1.velocity.y++;
                    m2.velocity.y--;
                } else if (m1.position.y > m2.position.y) {
                    m1.velocity.y--;
                    m2.velocity.y++;
                }

                if (m2.position.z > m1.position.z) {
                    m1.velocity.z++;
                    m2.velocity.z--;
                } else if (m1.position.z > m2.position.z) {
                    m1.velocity.z--;
                    m2.velocity.z++;
                }

                m1.compared.push(m2);
            });
        });

        // Apply velocity
        moons.forEach(m => {
            m.position.x += m.velocity.x;
            m.position.y += m.velocity.y;
            m.position.z += m.velocity.z;

            //console.log(`pos=<x= ${m.position.x}, y= ${m.position.y}, z= ${m.position.z}>, vel=<x= ${m.velocity.x}, y= ${m.velocity.y}, z= ${m.velocity.z}>, `);

            m.compared = [];
        });

        console.log('');
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
