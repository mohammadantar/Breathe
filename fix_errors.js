const fs = require('fs');
const file = 'index.html';
let content = fs.readFileSync(file, 'utf8');

const OLD = `      if (error.message === 'TIMEOUT') {
        setMessages(prev => [...prev, { 
          id: Date.now()+1, 
          sender: 'bree', 
          text: 'Bree is taking a moment to breathe, please try again.' 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          id: Date.now()+1, 
          sender: 'bree', 
          text: 'ERROR: ' + error.message 
        }]);
      }`;

const NEW = `      let friendlyMsg = "I'm having a little trouble right now, but I'm still here for you. \u{1F4AB}";
      if (error.message === 'TIMEOUT') {
        friendlyMsg = "I took a little too long to breathe just now. Could you send that again? \u{1F343}";
      } else if (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('Quota'))) {
        friendlyMsg = "I'm a little overwhelmed right now and need a short rest (API quota reached). Please try again in a minute, or ask your developer to update the API key. \u{2728}";
      } else if (error.message && error.message.includes('Missing API Key')) {
        friendlyMsg = "It seems my connection isn\u2019t set up yet. Please add a Gemini API key to the .env file to activate me! \u{1F511}";
      } else if (error.message && error.message.includes('404')) {
        friendlyMsg = "I couldn\u2019t find the right path to think. The AI model may have changed \u2014 please let your developer know. \u{1F4AD}";
      }
      setMessages(prev => [...prev, { 
        id: Date.now()+1, 
        sender: 'bree', 
        text: friendlyMsg
      }]);`;

if (content.includes(OLD)) {
  content = content.replace(OLD, NEW);
  console.log('Error handler updated.');
} else {
  console.log('ERROR: Block not found!');
}

fs.writeFileSync(file, content);
