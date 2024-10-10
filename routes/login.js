const express = require('express');
const { SSMClient, PutParameterCommand } = require('@aws-sdk/client-ssm'); // Correct way to import from @aws-sdk/client-ssm
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const jwt = require('jsonwebtoken');
const router = express.Router();

const parameter_name = "/n11270551/pstore";
const client = new SSMClient({ region: "ap-southeast-2" });

// AWS Cognito configuration
const poolData = {
    UserPoolId: 'ap-southeast-2_0ovs9P8g0',  // Replace with your Cognito User Pool ID
    ClientId: '7fsj2iu5ds2srqb4cc1l4upnff'  // Replace with your Cognito Client ID
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// Login route using Cognito
router.post('/', (req, res) => {
    const { username, password } = req.body;

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: username,
        Password: password
    });

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: username,
        Pool: userPool
    });

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: async (result) => {
            // Get the JWT token
            const idToken = result.getIdToken().getJwtToken();
            const decoded = jwt.decode(idToken);
            const username = decoded['cognito:username'];
            
            const params = {
                Name: parameter_name,
                Value: username,
                Type: 'String',
                Overwrite: true
            };

            try {
                await client.send(new PutParameterCommand(params));
                console.log('Username stored in Parameter Store');
            } catch (err) {
                console.error('Error storing username in Parameter Store', err);
            }    
            
            // Send the token to the client
            // res.json({ token: idToken, username: decoded['cognito:username'] });
        },
        onFailure: (err) => {
            console.log('Login failed:', err);
            res.status(401).json({ message: 'Invalid credentials' });
        },
        mfaRequired: (codeDeliveryDetails) => {
            res.status(200).json({ message: 'MFA required' });
        }
    });
});

module.exports = router;


