// routes/signup.js
const express = require('express');
const { signUpUser } = require('../cognito');
const router = express.Router();

router.post('/', (req, res) => {
    const { username, email, password } = req.body;

    signUpUser(username, email, password, (err, result) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        return res.status(200).json({ message: 'User registered successfully', data: result });
    });
});

module.exports = router;
