// videos.js - Route for listing videos in S3 bucket
const express = require('express');
const router = express.Router();
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { QueryCommand, ScanCommand } = require('@aws-sdk/client-dynamodb');

const s3 = new S3Client({
    region: 'ap-southeast-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
});

// Route to list all videos in the S3 bucket
router.get('/videos', async (req, res) => {
    const params = {
        Bucket: 'g40bucket', // Your S3 bucket name
    };

    try {
        // Get the list of objects in the bucket (i.e., the video files)
        const data = await s3.send(new ListObjectsV2Command(params));
        const videos = data.Contents.map((file) => ({
            key: file.Key, // The file name/key
            lastModified: file.LastModified, // When the file was last modified
            size: file.Size, // The file size
        }));

        // Send the list of videos back as JSON
        res.json(videos);
    } catch (err) {
        console.error('Error listing videos:', err);
        res.status(500).send('Failed to list videos.');
    }
});

module.exports = router;
