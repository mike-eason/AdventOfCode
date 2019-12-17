const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/input.txt');

const data = fs.readFileSync(filePath, { encoding: 'utf8' });

const lines = data.match(/[^\r\n]+/g);
