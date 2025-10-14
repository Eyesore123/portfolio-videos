import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
dotenv.config();

// --- Configuration ---
console.log('Bucket:', process.env.R2_BUCKET);
console.log('Endpoint:', process.env.R2_ENDPOINT);

const client = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.R2_KEY,
    secretAccessKey: process.env.R2_SECRET,
  },
});

// Folder where your videos and thumbnails live
const folderPath = path.join(process.cwd(), 'public/videos');

// Allowed file types
const allowedExtensions = ['.mp4', '.png'];

// Allow specifying files via CLI: e.g. "node upload.js 2.mp4 thumbnail.png"
const args = process.argv.slice(2);
const filesToUpload = args.length
  ? args
  : fs.readdirSync(folderPath).filter(f =>
      allowedExtensions.includes(path.extname(f).toLowerCase())
    );

// Detect MIME type
function getContentType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  if (ext === '.mp4') return 'video/mp4';
  if (ext === '.png') return 'image/png';
  return 'application/octet-stream';
}

async function uploadFile(fileName) {
  const filePath = path.join(folderPath, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ File not found: ${fileName}, skipping.`);
    return;
  }

  const fileStream = fs.createReadStream(filePath);
  const contentType = getContentType(fileName);

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: fileName,
        Body: fileStream,
        ContentType: contentType,
      })
    );
    console.log(`✅ Uploaded ${fileName} (${contentType})`);
  } catch (err) {
    console.error(`❌ Failed to upload ${fileName}:`, err);
  }
}

async function main() {
  if (filesToUpload.length === 0) {
    console.log('No valid .mp4 or .png files found to upload.');
    return;
  }

  for (const file of filesToUpload) {
    console.log(`Uploading ${file}...`);
    await uploadFile(file);
  }

  console.log('🎉 Upload complete!');
}

main();
