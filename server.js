import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json()); // needed for DELETE JSON body

// Multer config
const upload = multer({ 
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const allowed = ['video/mp4', 'image/png'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only .mp4 and .png files are allowed!'));
  }
});

// S3/R2 client
const client = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.R2_KEY,
    secretAccessKey: process.env.R2_SECRET,
  },
});

// Serve static uploader page
const uploaderPath = path.join(process.cwd(), 'public', 'uploader');
app.use('/uploader', express.static(uploaderPath));
app.get('/uploader', (req, res) => {
  res.sendFile(path.join(uploaderPath, 'index.html'));
});

// Upload
app.post('/uploader/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const fileStream = fs.createReadStream(file.path);

  try {
    await client.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: file.originalname,
      Body: fileStream,
      ContentType: file.mimetype,
    }));
    fs.unlinkSync(file.path);
    res.send(`✅ Uploaded ${file.originalname}`);
  } catch (err) {
    console.error(err);
    res.status(500).send(`❌ Failed to upload ${file.originalname}`);
  }
});

// List files
app.get('/uploader/files', async (req, res) => {
  try {
    const data = await client.send(new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET,
      MaxKeys: 100,
    }));

    const files = (data.Contents || []).map(file => ({
      key: file.Key,
      size: file.Size,
      lastModified: file.LastModified
    }));

    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching files');
  }
});

// Download file
app.get('/uploader/download', async (req, res) => {
  const { key } = req.query;
  if (!key) return res.status(400).send('Missing key');

  try {
    const data = await client.send(new GetObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
    }));

    res.setHeader('Content-Disposition', `attachment; filename="${key}"`);
    res.setHeader('Content-Type', data.ContentType || 'application/octet-stream');


    data.Body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to download');
  }
});

// Delete file
app.delete('/uploader/files', async (req, res) => {
  const { key } = req.body;
  if (!key) return res.status(400).send('Missing file key');

  try {
    await client.send(new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
    }));
    res.send(`✅ Deleted ${key}`);
  } catch (err) {
    console.error(err);
    res.status(500).send(`❌ Failed to delete ${key}`);
  }
});

// Start server
app.listen(3000, () => console.log('Uploader running on http://localhost:3000/uploader'));
