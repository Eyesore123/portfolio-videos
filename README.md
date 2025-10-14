# Portfolio videos

This is my personal video library which is used under my domain.

I just wanted to see what it's like to create a video library.

I use React and TypeScript and Node.js in this project.

I'm not sure if I'll add a separate backend to go with the frontend, but for now I'm just building the frontend and node scripts to handle the file uploads to Cloudflare's R2 bucket.

All of video related data is put into a JSON.

I plan to use GSAP for animations, but keep other styles as close to my portfolio site and blog as possible.

### `update-videos-json.mjs`

- update-videos-json.mjs file is used to check the videos and thumbnails that are stored inside the public folder to see if they match with the json data.
- It outputs the report 'update-report.txt' and gives a new file called 'videos-merged.json', which can be used to paste the new values of new videos into the videos.json. Reduces manual work, but doesn't remove it as the video desciptions etc. still
need to be typed manually

- Used only in local testing and development.

- command:

node update-videos-json.mjs

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

for example, if you want to upload video.mp4 form videos folder, you type 'node upload.js video.mp4'

Landing page image:

<img width="1229" height="874" alt="videosite" src="https://github.com/user-attachments/assets/623bec3f-da96-4685-93df-5642e3dfb142" />
