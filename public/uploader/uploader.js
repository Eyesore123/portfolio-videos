const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const status = document.getElementById('status');
const fileList = document.getElementById('fileList');
const dropZone = document.getElementById('dropZone');

const BASE_URL = 'http://localhost:3000/uploader';

// --- Load existing files ---
async function loadFiles() {
  const res = await fetch(`${BASE_URL}/files`);
  const files = await res.json();
  fileList.innerHTML = '';

  files.forEach(file => {
    const div = document.createElement('div');
    div.className = 'upload-item';
    const url = `${BASE_URL}/download?key=${file.key}`;
    div.innerHTML = `
      <strong>${file.key}</strong>
      <span>${(file.size/1024).toFixed(1)} KB | Last Modified: ${new Date(file.lastModified).toLocaleString()}</span>
      <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
        <a href="${url}" target="_blank"><button>View/Download</button></a>
        <button class="deleteBtn">Delete</button>
      </div>
    `;
    div.querySelector('.deleteBtn').addEventListener('click', async () => {
      if (!confirm(`Delete ${file.key}?`)) return;
      const res = await fetch(`${BASE_URL}/files`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: file.key })
      });
      alert(await res.text());
      loadFiles();
    });
    fileList.appendChild(div);
  });
}

// --- Sequential upload with batch status ---
async function uploadFilesSequentially(files) {
  if (!files.length) return;

  status.innerHTML = `<p class="uploadingmessage">Uploading ${files.length} file(s)...</p>`;

  for (const file of files) {
    const div = document.createElement('div');
    div.className = 'upload-item';
    div.innerHTML = `<strong>${file.name}</strong><progress value="0" max="100"></progress><span class="dots">Uploading...</span>`;
    status.appendChild(div);

    const progressBar = div.querySelector('progress');
    const dots = div.querySelector('.dots');

    const formData = new FormData();
    formData.append('file', file);

    await new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${BASE_URL}/upload`);

      let dotCount = 0;
      const interval = setInterval(() => {
        dots.textContent = 'Uploading' + '.'.repeat(dotCount % 4);
        dotCount++;
      }, 400);

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) progressBar.value = Math.round((e.loaded / e.total) * 100);
      });

      xhr.onload = async () => {
        clearInterval(interval);
        if (xhr.status === 200) dots.textContent = '✅ Uploaded';
        else dots.textContent = '❌ Failed';
        resolve();
      };

      xhr.onerror = () => {
        clearInterval(interval);
        dots.textContent = '❌ Error';
        resolve();
      };

      xhr.send(formData);
    });
  }

  loadFiles();
}

// --- Upload button ---
uploadBtn.addEventListener('click', () => {
  uploadFilesSequentially([...fileInput.files]);
});

// --- Drag & drop ---
dropZone.addEventListener('dragover', e => {
  e.preventDefault();
  dropZone.classList.add('hover');
});
dropZone.addEventListener('dragleave', e => {
  e.preventDefault();
  dropZone.classList.remove('hover');
});
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('hover');
  const files = [...e.dataTransfer.files];
  uploadFilesSequentially(files);
});

// --- Initial load ---
loadFiles();
