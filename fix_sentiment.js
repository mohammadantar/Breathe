const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'index.html');
let content = fs.readFileSync(file, 'utf8');

// Fix 1: Broken regex — replace with a working version using new RegExp()
const brokenBlock = `      // Extract sentiment_score from JSON block if present
      let aiScore = null;
      const jsonMatch = rawText.match(/{\"sentiment_score\"s*:s*(d+)}/);\n      if (jsonMatch) {
        aiScore = Math.min(10, Math.max(1, parseInt(jsonMatch[1], 10)));
        rawText = rawText.replace(/{\"sentiment_score\"s*:s*d+}/, '').trim();
      }`;

const fixedBlock = `      // Extract sentiment_score from JSON block if present
      let aiScore = null;
      const scoreRegex = new RegExp('\\\\{\\\\s*"sentiment_score"\\\\s*:\\\\s*(\\\\d+)\\\\s*\\\\}');
      const jsonMatch = rawText.match(scoreRegex);
      if (jsonMatch) {
        aiScore = Math.min(10, Math.max(1, parseInt(jsonMatch[1], 10)));
        rawText = rawText.replace(scoreRegex, '').trim();
      }`;

if (content.includes(brokenBlock)) {
  content = content.replace(brokenBlock, fixedBlock);
  console.log('Fixed broken regex block.');
} else {
  // Try matching without exact whitespace
  const old = content.match(/\/\/ Extract sentiment_score from JSON block if present[\s\S]*?\.trim\(\);\s*\}/);
  if (old) {
    content = content.replace(old[0], fixedBlock);
    console.log('Fixed via flexible match.');
  } else {
    console.log('ERROR: Could not find regex block to replace!');
    process.exit(1);
  }
}

// Fix 2: Ensure final responseText strips JSON even if leftover
// Already handled above by the scoreRegex replace — good.

// Fix 3: Make sure the JSON block never leaks into chat even as fallback
// Add a secondary safety strip on responseText
const OLD_RESPONSE_LINE = `      const responseText = rawText || "I'm here to listen.";
      setMessages(prev => [...prev, { id: Date.now()+1, sender: 'bree', text: responseText }]);`;

const NEW_RESPONSE_LINE = `      // Safety: strip any remaining JSON blobs from visible text
      const safeText = (rawText || "I'm here to listen.")
        .replace(/\{[\s\S]*?"sentiment_score"[\s\S]*?\}/g, '')
        .replace(/\{"sentiment_score"\s*:\s*\d+\}/g, '')
        .trim() || "I'm here to listen.";
      setMessages(prev => [...prev, { id: Date.now()+1, sender: 'bree', text: safeText }]);`;

if (content.includes(OLD_RESPONSE_LINE)) {
  content = content.replace(OLD_RESPONSE_LINE, NEW_RESPONSE_LINE);
  console.log('Added safety JSON strip for chat messages.');
} else {
  console.log('WARNING: Could not find response line — skipping this step.');
}

fs.writeFileSync(file, content);
console.log('Done!');
