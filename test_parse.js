const fs = require('fs');
try {
  const content = fs.readFileSync('index.html', 'utf8');
  const scriptMatch = content.match(/<script type="text\/babel" data-type="module">([\s\S]*?)<\/script>/);
  if (scriptMatch) {
    console.log('Script length:', scriptMatch[1].length);
  } else {
    console.log('Script tag not found.');
  }
} catch (e) {
  console.error(e);
}
