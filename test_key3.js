const apiKey = "AIzaSyB8JLS-iig4sGROWYt5T7rarzegL2IF6zk";
fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
.then(res => res.json())
.then(data => {
  if (data.error) {
    console.error("API ERROR:", data.error);
    process.exit(1);
  } else {
    console.log("AVAILABLE MODELS:", data.models.map(m => m.name));
  }
})
.catch(console.error);
