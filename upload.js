import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
dotenv.config();


console.log('Bucket:', process.env.R2_BUCKET);
console.log('Endpoint:', process.env.R2_ENDPOINT);

// Config
const client = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.R2_KEY,
    secretAccessKey: process.env.R2_SECRET,
  },
});

// Folder containing videos
const folderPath = path.join(process.cwd(), 'public/videos');

// Allow specifying files from CLI, e.g. "node upload.js 2.mp4 10.mp4"
const args = process.argv.slice(2);
const videos = args.length ? args : fs.readdirSync(folderPath).filter(f => f.endsWith('.mp4'));


async function uploadVideo(fileName) {
  const filePath = path.join(folderPath, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ File not found: ${fileName}, skipping.`);
    return;
  }

  const fileStream = fs.createReadStream(filePath);

  try {
    await client.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: fileName,
      Body: fileStream,
      ContentType: 'video/mp4',
    }));
    console.log(`✅ Uploaded ${fileName}`);
  } catch (err) {
    console.error(`❌ Failed to upload ${fileName}:`, err);
  }
}

async function main() {
  for (const video of videos) {
    console.log(`Uploading ${video}...`);
    await uploadVideo(video);
  }
}

main();
