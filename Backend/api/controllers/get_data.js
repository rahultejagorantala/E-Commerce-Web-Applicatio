const secret = require('../../config/secret')
const  Sequelize = require('sequelize')
const  USERS = require('../../models/user')
const  PRODUCT_CATEGORIES = require('../../models/product_category')
const PRODUCT = require('../../models/product')
const CART = require('../../models/cart')
const ORDER = require('../../models/oder')
const fetch = require('node-fetch');
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
const { json } = require('sequelize')
const Razorpay = require('razorpay')
var SHA256 = require("crypto-js/sha256");
var Base64 = require('crypto-js/enc-base64')
var shortId = require('shortid')
var crypto = require('crypto');

var options = {
  min:  1000
, integer: true
}
const rzp = new Razorpay({
    key_id: "rzp_test_EGWzUu3mNjLuP7",
    key_secret: "PNZXDggf7flRmNiC2Fj7yumU",
   })

exports.get_all_cats = (req,res)=>{
    PRODUCT_CATEGORIES.findAll().then(result=>{
    res.status(200).send(result)
}).catch(err=>{
    res.status(500).send(err)
})


}


      
exports.add_product_category = async(req,res)=>{
var {cat_name} = req.body
var cat_image = req.files

PRODUCT_CATEGORIES.create({
    cat_name,
    cat_image_path: cat_image[0].path
}).then(result=>{
    var response = {
        success:true,
        status:'Product Category Added',
    }
    console.log(cat_image[0].path)

    res.status(200).json(response)
}
).catch(err => {
    var response = {
        success:false,
        status:'Something went wrong '+err,
    }
    res.status(401).json(response)

}
)

}

exports.user_signup = async(req,res)=>{
    var {user_email,user_password,user_gender,user_phone} = req.body

    var address = {
        street_one: req.body.street_one,
        street_two: req.body.street_two,
        nearby: req.body.near_by,
        city: req.body.city,
        state: req.body.state,
        pin_code : req.body.pin_code
    }

    var MatchUSer = await USERS.findAll({where:{user_email:user_email}})


    bcrypt.hash(user_password, 10,function(err,hashedPass){
        if(MatchUSer!=''){
            var response = {
                success:false,
                id:0,
                status:'Username already registered',
               
            }
        
        res.status(200).json(response)
        }
        else{
     
         try{
            USERS.create({
                user_email,
                user_password:hashedPass,
                user_gender,
                user_phone,
                user_address:JSON.stringify(address),
                user_role:'customer'
        
            }).then(result=>{
                console.log(result.user_id)
                var response = {
                    success:true,
                    id:result.user_id,
                    status:'Signup done',
                }
            
            res.status(200).json(response)
            }).catch(err=>{
                console.log(err)
                var response = {
                   success:false,
                   id:0,
                   status:'Something went wrong',
                
               }
           
           res.status(200).json(response)  
            })
         }catch(err){
             console.log(err)
             var response = {
                success:false,
                id:0,
                status:'Something went wrong',
               
            }
        
        res.status(200).json(response)
         }
    
           
        }
    })

    

  
}
exports.user_signin =async (req,res)=>{
    console.log(req.body)
    var {user_email,user_password} = req.body
   
   if(user_email===secret.admin_email){
   

    USERS.findAll({
        where:{
            user_email
        }
    }).then(result=>{
        if(result!=''){
           
            const token = jwt.sign({email:user_email,user_role:'admin',user_id:result[0].user_id},secret.secret)
            if(user_password===secret.admin_password){
                var response = {
                    success:true,
                    id:1,
                    status:'login success',
                    user_role:'admin',
                    token
                }
                USERS.update(
                    { user_token: token },
                    { where: { user_email } }
                  )
                    .then(result =>
                        {
                            console.log('-->',token) 
                            res.cookie("token",token,{expire:new Date(Date.now()+999999)})
                            res.status(200).json(response)
                            
                    }
                    )
                    .catch(err =>
                      {
                        var response = {
                            success:false,
                            id:0,
                            status:'username/password is wrong',
                        }
                        res.status(200).json(response)
                      }
                    )
            }else{
                var response = {
                    success:false,
                    id:0,
                    status:'username/password is wrong',
                }
                res.status(200).json(response)
            }
        }else{
            var response = {
                success:false,
                id:0,
                status:'username/password is wrong',
            }
            res.status(200).json(response)
        }
    })

  
 


   
   }
   else{
    USERS.findAll(
        {where:{
            user_email,
        }
    }
     ).then(result=>{
         if(result!=''){
            var hashpass = result[0].user_password
            bcrypt.compare(user_password, hashpass, function(err, isMatch) {
            
                if(isMatch) {
                    const token = jwt.sign({email:user_email,user_role:'admin',user_id:result[0].user_id},secret.secret)

                    var response = {
                        success:true,
                        id:result[0].user_id,
                        status:'login success',
                        user_role:result[0].user_role,
                        token
                    }
                    USERS.update(
                        { user_token: token },
                        { where: { user_email } }
                      )
                        .then(result =>
                            {
                                console.log('-->',token) 
                            res.cookie("token",token,{expire:new Date(Date.now()+999999),
                                httpOnly:false,
                                overwrite: true
                             })
                            
                            res.status(200).json(response)
                        }
                        )
                        .catch(err =>
                          {
                            var response = {
                                success:false,
                                id:0,
                                status:'username/password is wrong',
                            }
                            res.status(500).json(response)
                          }
                        )
                   
                }
                else{
                    console.log('**',"not matched")
                    var response = {
                        success:false,
                        id:0,
                        status:'username/password is wrong',
                    }
                
                res.status(200).json(response)
                }

            })
         }else{
            console.log('**',"No user Found")
            var response = {
                success:false,
                id:0,
                status:'username/password is wrong',
            }
        
        res.status(200).json(response)
         }
     }) 
   }
   
   

}

exports.user_signout = (req,res)=>{
    res.clearCookie('token')
    res.json({
        Message:"Signout"
    })
}




exports.buy_product = (req,res)=>{
    var cartItems = req.body.cartItems
    var order_amount = req.body.order_amount
    var order_status = 'processing'


    const { authorization } = req.headers;

   const token = authorization.replace('Bearer', '');


    if(!token){
        console.log('No Token Found')
        return res.status(401).send({
            error:'You must be logged in.'
        });
         
    }
    jwt.verify(token,secret.secret,async(err,payload)=>{
   
 const payment_capture = 1


        ORDER.create({
        
            userUserId:payload.user_id,
            order_status,
            order_amount,
            cartItems:cartItems,
            
        }).then(order_result=>{
          
             rzp.orders.create({
                amount: order_amount * 100, 
                currency: 'INR',
                receipt:shortId.generate(),
                payment_capture,
                notes:{order_id:order_result.order_id}
                
                
               }).then(result=>{
                  
                res.json({
                    id: result.id,
                    currency: result.currency,
                    amount: result.amount,
                    order_result
                })
               }).catch(err=>{
                console.log('******',err)
                var resonse = {
                    status:'order declined',
                    success:false,
                }
    
                res.status(500).send(resonse)
               })
            
            
        }).catch(err=>{
            console.log('>>>>>>>>>>',err)
            
           
        })
        
    })  

 

    

}


exports.verify_order = (req,res)=>{

    try {
        // getting the details back from our font-end
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            order_id,
            cartItems
        } = req.body;

       
        console.log('%%%',cartItems)

       
        const shasum = crypto.createHmac("sha256", "PNZXDggf7flRmNiC2Fj7yumU");

        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");

        // comaparing our digest with the actual signature
        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legit!" });

        // THE PAYMENT IS LEGIT & VERIFIED
      
        ORDER.update({
                    order_status:'payment successful',
                    receipt_number:razorpayOrderId
                    },
                    {where:
                        {order_id}
                    }
                    ).then(result=>{
                        if(!result) return
                        cartItems.map(c=>{
                            console.log(c.cart_id)
                            CART.findByPk(c.cart_id).then(delete_cart => {
                                delete_cart.destroy()
                            }).catch(err=>{return})
                
                        })
                        res.json({
                            msg: "success",
                            success:true,
                            orderId: razorpayOrderId,
                            paymentId: razorpayPaymentId,
                        });
                    }).catch(err=>{
                        console.log('error occured ',err)
                        res.json({
                            msg: "fail",
                            success:false,
                            
                        });
                    })
       
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }

}

exports.fetch_orders = (req,res)=>{
 
    const { authorization } = req.headers;

   const token = authorization.replace('Bearer', '');



    if(!token){
        console.log('No Token Found')
        return res.status(401).send({
            error:'You must be logged in.'
        });
         
    }
    jwt.verify(token,secret.secret,async(err,payload)=>{
        ORDER.findAll({where:{userUserId:payload.user_id}}).then(result=>{
            if(!result){
                var response = {
                    status:'No order',
                    success:false
                }
                res.status(200).send(response)
            }
            else{
                var response = {
                    status:'order found',
                    success:true,
                    result
                }
                res.status(200).send(response)  
            }
        })
    })
}

exports.add_product = (req,res)=>{
    const {product_category_id,product_name,product_quantity,product_price} = req.body
    var product_image_path = req.files


    const { authorization } = req.headers;

   const token = authorization.replace('Bearer', '');


    if(!token){
        console.log('No Token Found')
        return res.status(401).send({
            error:'You must be logged in.'
        });
         
    }
    jwt.verify(token,secret.secret,async(err,payload)=>{
        PRODUCT.create({
            product_category_id,
            product_name,
            product_quantity,
            product_price,
            product_image_path:product_image_path[0].path,
            product_vendor_id:payload.user_id
        }).then(result=>{
            var response = {
                success:true,
                status:'Product is Added',
            }
            res.status(200).json(response)
        }).catch(err=>{
            var response = {
                success:false,
                status:'Something went wrong',
            }
            console.log(err)
            res.status(500).json(response)
        })
        
    })  




    
}

exports.get_all_products = (req,res)=>{
    PRODUCT.findAll({
        include: [
            {
                model: PRODUCT_CATEGORIES
            }
        ]
    }).then(result=>{
        res.status(200).json(result)
    }).catch(err=>{
        res.status(500).send('Something went wrong')
    })
}

exports.get_product_by_id = (req,res)=>{
    var id = req.params.id
    PRODUCT.findByPk(id).then(result=>{
        console.log('result....',result)
        if(result){
            var response = {
                success:true,
                status:'Product found',
                data:result
            }
            res.status(200).json(response)
        }else{
            var response = {
                success:false,
                status:'Something went wrong',
            }
          
            res.status(500).json(response) 
        }
    }).catch(err=>{
        var response = {
            success:false,
            status:'Something went wrong '+err,
        }
      
        res.status(500).json(response)
    })
}

exports.delete_product = (req,res)=>{
    var id = req.params.id
    console.log('DELETEING ERROR'+id)
    PRODUCT.findByPk(id).then(delete_product => {

        delete_product.destroy()
    }).then( result=>{
            console.log('DELETED PRODUCT')
            if(result!=='' || result!=null || result!=='undefined'){
                var response = {
                    success:true,
                    status:'deleted'
                }
                res.status(200).send(response)
            }
        
        }
    ).catch(err => {
        var response = {
            success:false,
            status:'Something went wrong'
        }
        console.log('DELETEING ERROR'+err)
        res.status(200).send(response)
    })
}



exports.edit_product = (req,res)=>{
    const {product_category_id,product_name,product_quantity,product_price,product_id} = req.body
 
    PRODUCT.update({
        product_category_id,
        product_name,
        product_quantity,
        product_price,
        },
        {where:
            {product_id:product_id}
        }
        ).then(result=>{
          if(result){

             var response = {
                success:true,
                status:'Product is Updated',
            }
            res.status(200).json(response)
          }else{
            var response = {
                success:false,
                status:'Something went wrong '+err,
            }
          
            res.status(200).json(response)
          }
        }).catch(err=>{
            var response = {
                success:false,
                status:'Something went wrong '+err,
            }
           
            res.status(200).json(response)
        })
}





exports.add_to_cart = (req,res)=>{
    var {product_id} = req.body


    const { authorization } = req.headers;

   const token = authorization.replace('Bearer', '');


    if(!token){
        console.log('No Token Found')
        return res.status(401).send({
            error:'You must be logged in.'
        });
         
    }

    jwt.verify(token,secret.secret,async(err,payload)=>{
        CART.create({
            productProductId:product_id,
            quantity:1,
            userUserId:payload.user_id
        }).then(result=>{
            if(result){
                var response = {
                    success:true,
                    status:'Added to cart'
                }

                res.status(200).send(response)
            }
        }).catch(err=>{
            var response = {
                success:false,
                status:'Something went wrong'
            }

            res.status(500).send(response)
        })
    })
}

exports.get_cart = (req,res)=>{

    const { authorization } = req.headers;

   const token = authorization.replace('Bearer', '');


    if(!token){
        console.log('No Token Found')
        return res.status(401).send({
            error:'You must be logged in.'
        });
         
    }


    jwt.verify(token,secret.secret,async(err,payload)=>{
        CART.findAll({
          where:{ userUserId:payload.user_id},
          include: [
            {
                model: USERS
            },
            {
                model: PRODUCT
            }
        ]
        },
        
        ).then(result=>{
            if(result){
               
                res.status(200).send(result)
            }
        }).catch(err=>{
         

            res.status(500).send('Something went wrong')
        })
    })
}


exports.remove_cart_item = (req,res)=>{
    var {product_id} = req.body

    const { authorization } = req.headers;

   const token = authorization.replace('Bearer', '');


    if(!token){
        console.log('No Token Found')
        return res.status(401).send({
            error:'You must be logged in.'
        });
         
    }


    jwt.verify(token,secret.secret,async(err,payload)=>{
        CART.findAll(
            {where:
                {productProductId:product_id,
                    userUserId:payload.user_id
                }
            }).then(result => {
            console.log('RESULTTTTTTTTT',result[0].cart_id)
            CART.findByPk(result[0].cart_id).then(delete_cart => {
                delete_cart.destroy()
            }).then(
                result=>{
                    console.log('DELETED PRODUCT')
                    if(result!=='' || result!=null || result!=='undefined'){
                        var response = {
                            success:true,
                            status:'deleted'
                        }
                        res.status(200).send(response)
                    }
                    else{
                        var response = {
                            success:false,
                            status:'Something went wrong'
                        }
                        res.status(500).send(response)
                    }
                }
            ).catch(err => {
                var response = {
                    success:false,
                    status:'Something went wrong'
                }
                res.status(500).send(response)
            })
        })
    })

    

}