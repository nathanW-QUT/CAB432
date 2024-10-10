const express = require('express');
const router = express.Router();
const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb');

const dynamoDBClient = new DynamoDBClient({ region: 'ap-southeast-2' });
const tableName = 'n11270551VideoMetadata';

// Route to fetch all items from the DynamoDB table
router.get('/dynamo-items', async (req, res) => {
    try {
        const params = {
            TableName: tableName,
        };

        const command = new ScanCommand(params);
        const data = await dynamoDBClient.send(command);

        res.json({
            message: 'Items retrieved successfully',
            items: data.Items,
        });
    } catch (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ message: 'Failed to fetch items from DynamoDB' });
    }
});

module.exports = router;
