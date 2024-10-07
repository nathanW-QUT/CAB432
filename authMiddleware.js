// authMiddleware.js
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'No token provided. Access denied.' });
    }

    // Just check if the token exists; assume it's valid if present (Cognito does the verification)
    req.token = token.slice(7); // Remove 'Bearer ' from the token
    next();
}

module.exports = verifyToken;
