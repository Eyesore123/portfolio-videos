const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const status = document.getElementById('status');
const fileList = document.getElementById('fileList');

const BASE_URL = 'http://localhost:3000/uploader';

// Helper: human-readable file size
function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(1)} ${units[i]}`;
}

// Load existing files
async function loadFiles() {
  try {
    const res = await fetch(`${BASE_URL}/files`);
    if (!res.ok) throw new Error('Failed to fetch files');
    const files = await res.json();
    fileList.innerHTML = '';

    if (files.length === 0) {
      fileList.innerHTML = '<p>No files stored yet.</p>';
      return;
    }

    files.forEach(file => {
      const div = document.createElement('div');
      div.className = 'file-item';
      const url = `${BASE_URL}/download?key=${encodeURIComponent(file.key)}`;

      div.innerHTML = `
        <strong>${file.key}</strong>
        <span class="file-info">${formatSize(file.size)} — Last modified: ${new Date(file.lastModified).toLocaleString()}</span>
        <div class="file-actions">
          <a href="${url}" target="_blank"><button>View / Download</button></a>
          <button class="delete deleteBtn">Delete</button>
        </div>
      `;

      div.querySelector('.deleteBtn').addEventListener('click', async () => {
        if (!confirm(`Are you sure you want to delete "${file.key}"?`)) return;
        const res = await fetch(`${BASE_URL}/files`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: file.key })
        });
        alert(await res.text());
        setTimeout(loadFiles, 600);
      });

      fileList.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    fileList.innerHTML = '<p>Error loading files.</p>';
  }
}

// Upload files
uploadBtn.addEventListener('click', async () => {
  const files = fileInput.files;
  if (!files.length) return alert('Please select files.');
  status.innerHTML = '';

  for (const file of files) {
    const div = document.createElement('div');
    div.className = 'upload-item';
    div.innerHTML = `<strong>${file.name}</strong><progress value="0" max="100"></progress><span class="dots">Uploading...</span>`;
    status.appendChild(div);

    const progressBar = div.querySelector('progress');
    const dots = div.querySelector('.dots');

    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${BASE_URL}/upload`);

    let dotCount = 0;
    const interval = setInterval(() => {
      dots.textContent = 'Uploading' + '.'.repeat(dotCount % 4);
      dotCount++;
    }, 400);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        progressBar.value = Math.round((e.loaded / e.total) * 100);
      }
    });

    xhr.onload = () => {
      clearInterval(interval);
      if (xhr.status === 200) {
        dots.textContent = '✅ Uploaded';
      } else {
        dots.textContent = '❌ Failed';
      }
      setTimeout(loadFiles, 600);
    };

    xhr.onerror = () => {
      clearInterval(interval);
      dots.textContent = '❌ Error';
    };

    xhr.send(formData);
  }
});

// Initial load
loadFiles();
