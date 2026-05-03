const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');
const idx = c.indexOf('error.message === ');
console.log(c.substring(idx - 50, idx + 500));
