const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/input.txt');

fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
    let arr = data.split(',').map(x => parseInt(x));

    for(let i = 0; i < 100; i++) {
        for (let z = 0; z < 100; z++) {
            let clone = JSON.parse(JSON.stringify(arr));
            let result = calc(clone, i, z);

            if (result == 19690720) {
                console.log(100 * i + z);
                return;
            }
        }
    }
});

function calc(arr, a, b) {
    arr[1] = a;
    arr[2] = b;

    for (let i = 0; i < arr.length - 1; i += 4) {
        let opcode = arr[i],
            input1 = arr[arr[i + 1]],
            input2 = arr[arr[i + 2]],
            output = arr[i + 3];

        let breakOut = false;
        let result = 0;

        switch (opcode) {
            case 1: 
                result = input1 + input2;
                break;
            case 2: 
            result = input1 * input2;
                break;
            case 99:
                breakOut = true;
                break;
        }

        if (breakOut) {
            break;
        }

        arr[output] = result;
    }

    return arr[0];
}
