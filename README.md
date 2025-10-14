# Portfolio videos

This is my personal video library which is used under my domain.

I just wanted to see what it's like to create a video library.

I use React and TypeScript and Node.js in this project.

I'm not sure if I'll add a separate backend to go with the frontend, but for now I'm just building the frontend and node scripts to handle the file uploads to Cloudflare's R2 bucket.

All of video related data is put into a JSON.

I plan to use GSAP for animations, but keep other styles as close to my portfolio site and blog as possible.

### `update-videos-json.mjs`

- update-videos-json.mjs file is used to check the videos and thumbnails that are stored inside the public folder to see if they match with the json data.
- It outputs the report 'update-report.txt' and gives a new file called 'videos-merged.json', which can be used to paste the new values of new videos into the videos.json. Reduces manual work, but doesn't remove it as the video descriptions etc. still
need to be typed manually

- Used only in local testing and development.

- command:

node update-videos-json.mjs

## File management using CLI

### `upload.js`

- Node.js script that uploads videos from `public/videos/` to the configured R2 bucket.
- Uses environment variables defined in a `.env` file:
  - `R2_ENDPOINT` – Your R2 bucket endpoint.
  - `R2_BUCKET` – The name of your R2 bucket.
  - `R2_KEY` – Access key for R2.
  - `R2_SECRET` – Secret key for R2.
  - `AUTH_KEY_SECRET` – Secret used by the Worker to authorize uploads.
- Reads the list of `.mp4` files in the folder and uploads them one by one.
- Logs successes and failures to the console.
- Useful for quick terminal uploads without a browser interface.
- command :

node upload.js [filename]

for example, if you want to upload video.mp4 and videothumbnail.png from videos folder, you type 'node upload.js video.mp4 videothumbnail.png'

Note: file upload is restricted to PNG and MP4 filetypes only!

## Local UI and Server Usage

In addition to the CLI upload script, the project includes a **local server** and a **browser-based upload and file management UI** for testing and development.

### `server.js`

* Lightweight **Express** server that serves the frontend and handles upload, download, list, and delete requests.
* Reads environment variables from `.env` for R2 authentication.
* Provides the following main routes:

  * `GET /uploader` — serves the **file management UI** (`index.html`).
  * `POST /uploader/upload` — handles file uploads from the browser and forwards them securely to the R2 bucket.
  * `GET /uploader/files` — lists existing files stored in R2 (filename, size, and last modified date).
  * `GET /uploader/download?key=filename` — allows downloading or viewing uploaded files.
  * `DELETE /uploader/files` — deletes a file from R2 when requested from the UI.
* Used for **local development**, testing upload logic, and managing your stored content visually.

To run:

```bash
node server.js
```

Then open [http://localhost:3000/uploader](http://localhost:3000/uploader) in your browser.

---

### `uploader.js`

* Handles all **browser-side logic** for file uploads and R2 file management.
* Includes:

  * File validation (MP4 and PNG only)
  * Upload progress tracking and live status updates
  * Automatic refresh of the file list after each upload or deletion
  * Download and delete buttons for managing existing files
* Communicates with the Express backend at `/uploader` using `fetch()` and `XMLHttpRequest`.
* Designed for **interactive testing** during development and local content management.

---

### `index.html`

* A responsive and styled UI for local uploads and R2 file management.
* Provides:

  * File picker for `.mp4` and `.png` uploads
  * Individual upload progress bars
  * Real-time upload status messages
  * Auto-updating list of existing files (with size and last modified info)
  * Buttons to view/download or delete each file
* Connected to `uploader.js` and styled using minimal CSS, without external frameworks.
* Not intended for production use — this tool is for **developer convenience and testing** only.

### Typical usage flow

1. Start the local server:

   ```bash
   node server.js
   ```
2. Open your browser at [http://localhost:3000/uploader](http://localhost:3000/uploader)
3. Select `.mp4` or `.png` files, or drag them into the upload area
4. `uploader.js` uploads the files and shows progress
5. Uploaded files appear in the file list with options to **view** or **delete**
6. The backend (`server.js`) handles R2 operations and updates the UI automatically

## Images

Landing page image:

<img width="1229" height="874" alt="videosite" src="https://github.com/user-attachments/assets/623bec3f-da96-4685-93df-5642e3dfb142" />

## Future improvements

- Drag and drop for uploader UI
- More animations (GSAP etc.)
- Video suggestion after video has ended.
- Improved SEO and meta tags
. Sitemaps
- Option to toggle automatic start of the next video
- Lazy-loaded hover previews
- Featured video block once there's more content

## What I’ve learned

- How to use Cloudflare R2 for large file storage and configure access credentials.

- Implementing custom headers and authorization secrets for secure uploads.

- Managing large video files (over 500 MB) efficiently using R2.

- Writing Node.js scripts to automate uploads and JSON updates.

- Using @aws-sdk/client-s3 to interact with S3-compatible storage in Node.

## Final words

I used R2 for this project because all the videos I add to my personal site are well optimized and not high resolution, so I had no need to set up adaptive bitrates for streaming.

React site that I deployed to https://videos.joniputkinen.com using this repo is very fast.
Of course, speed depends greatly on the file size of assets: videos and thumbnails. Image compression can save a lot of
of disk space and bandwith, and video compression even more - sometimes over 90%.

This project has been a great exercise in combining frontend development with cloud storage solutions, handling file streaming, and planning for future user interfaces.