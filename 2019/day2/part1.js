const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/input.txt');

fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
    let arr = data.split(',').map(x => parseInt(x));

    console.log(arr.join());

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

        console.log(arr.join());
    }

    console.log(arr[0]);
});
