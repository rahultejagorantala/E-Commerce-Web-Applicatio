const { next } = require('locutus/php/array')
const USERS = require('../models/user')
const jwt  =require('jsonwebtoken')
const config = require('../config/config')
const secret = require('../config/secret')

const isPermitted = (permission)=>{
    
    return (req,res,next)=>{
        const { authorization } = req.headers;
      
        if (!authorization) {
            console.log('No authorization Found')
            return res.status(401).send({
                error: 'You must be logged in.'
            });
    
        }  
    
        const token = authorization.replace('Bearer', '');
     

        if(!token){
            return res.status(401).send({
                error:'You must be logged in.'
            });
             
        }
        jwt.verify(token,secret.secret,async(err,payload)=>{

            if(permission.includes(payload.user_role)){
                next()
            }

           else if(err){
            console.log('Not Allowed')

                return res.status(401).send({error:'You must be logged in.'});
            }
            else{
                console.log('Not Allowed')


                return res.status(401).send({error:'You must be logged in.'});  
            }
            
        })  


        
    }
}

module.exports = isPermitted