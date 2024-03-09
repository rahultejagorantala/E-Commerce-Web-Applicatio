const jwt = require('jsonwebtoken')
const config = require('../config/config')
const secret = require('../config/secret')
const USER = require('../models/user')

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
   
    if (!authorization) {
       
        return res.status(401).send({
            error: 'You must be logged in.'
        });

    }

    const token = authorization.replace('Bearer ', '');

   

    if (!token) {
       
        return res.status(401).send({
            error: 'You must be logged in.'
        });

    }

    jwt.verify(token, secret.secret, async (err, payload) => {
       
        if (err) {
            return res.status(401).send({ error: 'You must be logged in.' });
        }
        USER.findAll({
            where: {
                user_email: payload.email,
                user_token: token
            }
        }).then(result => {
            if (result != '' || result != null || result != 'undefined') {
                const { userData } = payload;


                next();
            }
            else {
                return res.status(401).send({ error: 'You must be logged in.' });
            }
        })


    })
}

