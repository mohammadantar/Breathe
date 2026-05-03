fetch('http://localhost:5173/')
.then(res => res.text())
.then(text => {
  if (text.includes('%VITE_GEMINI_API_KEY%')) {
    console.log('FAIL: Vite did not replace the variable.');
  } else if (text.includes('AIzaSyB8JLS-iig4sGROWYt5T7rarzegL2IF6zk')) {
    console.log('SUCCESS: Vite replaced the variable.');
  } else {
    console.log('UNKNOWN STATE');
  }
})
.catch(console.error);
