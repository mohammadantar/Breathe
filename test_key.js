const apiKey = "AIzaSyB8JLS-iig4sGROWYt5T7rarzegL2IF6zk";
fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ contents: [{ parts: [{ text: 'hi' }] }] })
})
.then(res => res.json())
.then(data => {
  if (data.error) {
    console.error("API ERROR:", data.error);
    process.exit(1);
  } else {
    console.log("SUCCESS:", data.candidates[0].content.parts[0].text);
  }
})
.catch(console.error);
