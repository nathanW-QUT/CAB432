// download.js - Route for downloading files
const express = require('express');
const router = express.Router();
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3 = new S3Client({
    region: 'ap-southeast-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
});

// Generate a pre-signed URL to download a video file
router.get('/download/:filename', async (req, res) => {
    const filename = req.params.filename;

    try {
        const command = new GetObjectCommand({
            Bucket: 'g40bucket',
            Key: filename, // The file key in S3
        });

        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // URL expires in 1 hour
        res.json({ url: signedUrl });
    } catch (err) {
        console.error('Error generating signed URL:', err);
        res.status(500).send('Failed to generate download URL.');
    }
});

module.exports = router;
