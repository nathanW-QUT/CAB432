const express = require('express'); 
const router = express.Router();
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const jwt = require('jsonwebtoken');
const { S3Client } = require('@aws-sdk/client-s3');
const { DynamoDBClient, PutItemCommand, DescribeTableCommand, CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm')
const s3 = new S3Client({
    region: 'ap-southeast-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
});

const ssmClient = new SSMClient({ region: "ap-southeast-2" });
const parameter_name = "/n11270551/pstore";


const dynamoDBClient = new DynamoDBClient({ region: 'ap-southeast-2' });
const tableName = 'n11270551VideoMetadata';
const qutUsername = 'n11270551@qut.edu.au';

// Function to create the DynamoDB table if it doesn't exist
async function createDynamoTableIfNotExists() {
    try {
        await dynamoDBClient.send(new DescribeTableCommand({ TableName: tableName }));
        console.log('Table already exists.');
    } catch (error) {
        if (error.name === 'ResourceNotFoundException') {
            console.log('Creating table...');
            const params = {
                TableName: tableName,
                AttributeDefinitions: [
                    { AttributeName: 'qut-username', AttributeType: 'S' }, // Change to match the second implementation
                    { AttributeName: 'username', AttributeType: 'S' }, // Adjust as necessary
                ],
                KeySchema: [
                    { AttributeName: 'qut-username', KeyType: 'HASH' },
                    { AttributeName: 'username', KeyType: 'RANGE' }
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1, // Match the values from the working implementation
                    WriteCapacityUnits: 1
                }
            };

            try {
                await dynamoDBClient.send(new CreateTableCommand(params));
                console.log('Table created successfully.');
            } catch (createError) {
                console.error('Error creating DynamoDB table:', createError);
            }
        } else {
            console.error('Error describing DynamoDB table:', error);
        }
    }
}

// Call the function to ensure the table exists
createDynamoTableIfNotExists();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'g40bucket',
        key: (req, file, cb) => {
            const filename = Date.now().toString() + path.extname(file.originalname);
            cb(null, filename);
        }
    })
});

router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file was uploaded.');
    }

    let username;
    try{
        const data = await ssmClient.send(new GetParameterCommand({ Name: parameter_name }));
        username = data.Parameter.Value;
        console.log('Username retrieved from Parameter Store:', username);
    } catch (err) {
        console.error('Error retrieving username from Parameter Store:', err);
        return res.status(500).send('An error occurred while retrieving the username.');

    }   // Decode the token to extract the username (assuming the token is a JWT)
    

    const originalName = req.file.originalname;
    const s3Key = req.file.key;
    const uploadTime = new Date().toISOString();
    console.log(username, originalName, s3Key, uploadTime);
    try {
        // Store metadata in DynamoDB
        const dynamoParams = {
            TableName: tableName,
            Item: {
                'qut-username': { S: qutUsername },
                username: { S: username },
                s3Key: { S: s3Key },
                originalName: { S: originalName },
                uploadTime: { S: uploadTime }
            }
        };
        await dynamoDBClient.send(new PutItemCommand(dynamoParams));
        console.log('Metadata saved to DynamoDB.');

        // Send back the file location and metadata
        res.json({
            message: 'File uploaded successfully',
            fileUrl: req.file.location,
            originalName: originalName,
            uploadTime: uploadTime
        });
    } catch (err) {
        console.error('Error saving metadata:', err);
        res.status(500).send('An error occurred while storing metadata.');
    }
});

module.exports = router;
