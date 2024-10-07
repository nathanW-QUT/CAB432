const express = require('express');
const app = express();
// const db = require('./config/db'); // Ensure database connection is initialized
require('dotenv').config();
S3 = require("@aws-sdk/client-s3");
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

app.use(express.json());

const loginRoute = require('./routes/login');
const signupRoute = require('./routes/signup');

const uploadRoute = require('./routes/upload');
const transcodeRoute = require('./routes/transcode');
const videosRoute = require('./routes/videos');
const downloadRoute = require('./routes/download');

app.use('/login', loginRoute); // Use '/login' prefix for the login route
app.use('/signup', signupRoute);
app.use(uploadRoute);
app.use(transcodeRoute);
app.use(videosRoute);
app.use(downloadRoute);
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/videos', (req, res) => {
    res.sendFile(__dirname + '/videos.html');
});


app.get('/upload',  (req, res) => {
    res.sendFile(__dirname + '/upload.html');
});

app.get('/download', (req, res) => {
    res.sendFile(__dirname + '/download.html');
});
app.get('/transcode',  (req, res) => {
    res.sendFile(__dirname + '/transcode.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});
// error handler
// 404 Error Handler for any unmatched routes
app.use((req, res, next) => {
    res.status(404).sendFile(__dirname + '/404.html');
});

// Global Error Handler for catching other errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!' );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
