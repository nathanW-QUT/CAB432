// cognito.js
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
require('dotenv').config();

// Use environment variables for UserPoolId and ClientId
const poolData = {
    UserPoolId: 'ap-southeast-2_0ovs9P8g0',
    ClientId: '7fsj2iu5ds2srqb4cc1l4upnff'
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// Function to sign up a new user
function signUpUser(username, email, password, callback) {
    const attributeList = [];
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: 'email',
        Value: email
    }));

    userPool.signUp(username, password, attributeList, null, (err, result) => {
        if (err) {
            return callback(err, null);
        }
        return callback(null, result);
    });
}

// Function to authenticate a user (login)
function authenticateUser(username, password, callback) {
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: username,
        Password: password
    });

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: username,
        Pool: userPool
    });

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
            const idToken = result.getIdToken().getJwtToken();
            return callback(null, idToken);  // Returning the ID token (JWT)
        },
        onFailure: (err) => {
            return callback(err, null);
        }
    });
}

module.exports = { signUpUser, authenticateUser };
