// transcode.js
const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const router = express.Router();
const path = require('path');
const onFinished = require('on-finished');
const ffmpegPath = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath);

// Transcoding route
router.post('/transcode', (req, res) => {
    const { filename } = req.body;  // Only need filename since output is always .mp4

    console.log('Received filename:', filename);

    if (!filename) {
        return res.status(400).send('Invalid input: filename is required.');
    }

    const inputPath = path.join(__dirname, '../uploads/', filename);  // Assume file is in uploads folder
    const outputPath = path.join(__dirname, '../uploads/', `${path.basename(filename, path.extname(filename))}.mp4`);

    // Set response headers for streaming progress
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    let totalTime;

    onFinished(res, (err) => {
        if (err) console.error('Error during streaming:', err);
        else console.log('Response finished successfully.');
    });

    // Start transcoding process
    ffmpeg(inputPath)
        .output(outputPath)
        .on('codecData', (data) => {
            totalTime = parseInt(data.duration.replace(/:/g, '')); // Total duration
            console.log(`Total video time: ${totalTime}`);
        })
        .on('progress', (progress) => {
            const currentTime = parseInt(progress.timemark.replace(/:/g, '')); // Current progress in seconds
            const percentComplete = (currentTime / totalTime) * 100;
            const progressMessage = `Processing: ${percentComplete.toFixed(2)}% done\n`;
            console.log(progressMessage);
            res.write(progressMessage);
        })
        .on('end', () => {
            res.end(`Transcoding complete: ${outputPath}`);
        })
        .on('error', (err) => {
            res.status(500).send(`Error occurred: ${err.message}`);
        })
        .run();
});

module.exports = router;


























// const express = require('express');
// const ffmpeg = require('fluent-ffmpeg');
// const router = express.Router();
// const path = require('path');
// const onFinished = require('on-finished');
// const ffmpegPath = require('ffmpeg-static');
// ffmpeg.setFfmpegPath(ffmpegPath);
// /* Transcoding was assisted with chatgpt and CoPiloit */
// // Transcoding route
// router.post('/transcode', (req, res) => {
//     const { filename, outputFormat } = req.body;

//     console.log('Received filename:', filename);
//     console.log('Received output format:', outputFormat);

//     if (!filename || !outputFormat) {
//         return res.status(400).send('Invalid input: filename and output format are required.');
//     }

//     const inputPath = path.join(__dirname, '../', filename);
//     const outputPath = path.join(__dirname, '../uploads/', `${path.basename(filename, path.extname(filename))}.${outputFormat}`);

//     // Set response headers for streaming
//     res.setHeader('Content-Type', 'text/plain');
//     res.setHeader('Transfer-Encoding', 'chunked');

//     // Variable to store total video duration
//     let totalTime;

//     onFinished(res, (err) => {
//         if (err) console.error('Error during streaming:', err);
//         else console.log('Response finished successfully.');
//     });

//     // Start the transcoding process
//     ffmpeg(inputPath)
//         .output(outputPath)

//         // Get the total duration of the video
//         .on('codecData', (data) => {
//             totalTime = parseInt(data.duration.replace(/:/g, '')); // Extract total duration in seconds
//             console.log(`Total video time: ${totalTime}`);
//         })

//         // Calculate and send progress updates as a percentage
//         .on('progress', (progress) => {
//             const currentTime = parseInt(progress.timemark.replace(/:/g, '')); // Current time in seconds
//             const percentComplete = (currentTime / totalTime) * 100;

//             const progressMessage = `Processing: ${percentComplete.toFixed(2)}% done\n (${progress.timemark}})\n`;
//             console.log(progressMessage);

//             // Send the progress update to the client
//             res.write(progressMessage);
//         })

//         // When transcoding is complete
//         .on('end', () => {
//             res.end(`Transcoding complete: ${outputPath}`);
//         })

//         // If an error occurs
//         .on('error', (err) => {
//             res.status(500).send(`Error occurred: ${err.message}`);
//         })

//         .run();
// });

// module.exports = router;
