fetch('http://localhost:8082/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ history: [{ role: 'user', parts: [{ text: 'hi' }] }] })
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
