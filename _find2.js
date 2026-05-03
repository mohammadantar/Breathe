const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');
const idx = c.indexOf('// --- 3. Panic Help ---');
const idx2 = c.indexOf('// --- 4.');
console.log('PanicHelp from:', idx, 'to:', idx2);
console.log(c.substring(idx, idx2));
