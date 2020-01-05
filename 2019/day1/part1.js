const text = require('fs').readFileSync('./input.txt', { encoding: 'utf8' });

console.log(text.match(/[^\r\n]+/g)
	.reduce((s, v) => s + Math.floor(v / 3) - 2, 0));
