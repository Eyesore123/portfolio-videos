document.getElementById('uploadBtn').addEventListener('click', async () => {
  const files = document.getElementById('fileInput').files;
  if (!files.length) return alert('Please select video files.');

  for (const file of files) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData
    });

    const text = await res.text();
    document.getElementById('status').innerHTML += `<p>${text}</p>`;
  }
});
