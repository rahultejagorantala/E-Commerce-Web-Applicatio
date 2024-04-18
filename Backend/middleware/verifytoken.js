// Import required modules and configurations
const jwt = require('jsonwebtoken');
const config = require('../config/config'); 
const secret = require('../config/secret'); 
const USER = require('../models/user'); 

// Middleware function to verify JWT token

module.exports = (req, res, next) => {
    // Extract the authorization header from the request
    const { authorization } = req.headers;

    // Check if authorization header is missing
    if (!authorization) {

        return res.status(401).send({
            error: 'You must be logged in.'
        });
    }

    // Extract the token from the authorization header (assuming it follows the 'Bearer <token>' format)
    const token = authorization.replace('Bearer ', '');

    // Check if token is missing
    if (!token) {
        return res.status(401).send({
            error: 'You must be logged in.'
        });
    }

    // Verify the JWT token using the secret key
    jwt.verify(token, secret.secret, async (err, payload) => {
        if (err) {
            return res.status(401).send({ error: 'You must be logged in.' });
        }

        // Find user data in the database based on the email and token from the payload
        USER.findAll({
            where: {
                user_email: payload.email,
                user_token: token
            }
        }).then(result => {
            // Check if user data is found
            if (result != '' || result != null || result != 'undefined') {
                const { userData } = payload;
                next();
            } else {
                return res.status(401).send({ error: 'You must be logged in.' });
            }
        });
    });
};
