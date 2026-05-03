async function listModels() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyCuORqA5c6XQ0FSQti-CGNW2BomxEo-r2k`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.models) {
        console.log(data.models.map(m => m.name));
    } else {
        console.log(data);
    }
  } catch (e) {
    console.error(e);
  }
}

listModels();
