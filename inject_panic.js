const fs = require('fs');
const newPanic = require('./new_panic.js');

const file = 'index.html';
let content = fs.readFileSync(file, 'utf8');

// Find the old PanicHelp component boundaries
const start = content.indexOf('// --- 3. Panic Help Section (Flashcards) ---');
const end = content.indexOf('// --- 4.');

if (start === -1 || end === -1) {
  console.log('ERROR: Could not find PanicHelp boundaries!');
  console.log('start:', start, 'end:', end);
  process.exit(1);
}

// Replace
content = content.substring(0, start) + newPanic + '\n' + content.substring(end);

// Also pass onPanicComplete to the ChatInterface so the final score updates the metric
// Update the App render: pass onPanicComplete to PanicHelp
content = content.replace(
  "<PanicHelp key=\"panic\" onBack={() => setView('dashboard')} user={user} onSupport={() => setView('support')} />",
  "<PanicHelp key=\"panic\" onBack={() => setView('dashboard')} user={user} onSupport={() => setView('support')} onPanicComplete={(score) => { const u = {...user, panicScore: score}; setUser(u); localStorage.setItem('breathe_user', JSON.stringify(u)); setView('dashboard'); }} />"
);

fs.writeFileSync(file, content);
console.log('PanicHelp replaced! Chars replaced from', start, 'to', end);
console.log('New file size:', content.length);
