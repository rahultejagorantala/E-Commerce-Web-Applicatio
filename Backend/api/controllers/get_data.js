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
  min:  1000,
  integer: true
}
const rzp = new Razorpay({
    key_id: "", // add your keyid and key secret here.
    key_secret: "",
   })

// Function to get all product categories
exports.get_all_cats = (req,res)=>{
    PRODUCT_CATEGORIES.findAll().then(result=>{
    res.status(200).send(result)
}).catch(err=>{
    res.status(500).send(err)
})


}

// Function to add a new product category
exports.add_product_category = async(req,res)=>{
    // Extracting category name from request body
    var {cat_name} = req.body
    // Retrieving category image from request files
    var cat_image = req.files

    // Creating a new product category entry in the database
    PRODUCT_CATEGORIES.create({
        cat_name,
        cat_image_path: cat_image[0].path
    }).then(result=>{
        var response = {
            success:true,
            status:'Product Category Added',
        }
        console.log(cat_image[0].path) // Logging the path of the uploaded image

        res.status(200).json(response)
    }).catch(err => {
        var response = {
            success:false,
            status:'Something went wrong '+err,
        }
        res.status(401).json(response)
    })
}


// Function to sign up a new user
exports.user_signup = async(req,res)=>{
    // Destructuring user details from request body
    var {user_email,user_password,user_gender,user_phone} = req.body

    // Extracting address details from request body
    var address = {
        street_one: req.body.street_one,
        street_two: req.body.street_two,
        nearby: req.body.near_by,
        city: req.body.city,
        state: req.body.state,
        pin_code : req.body.pin_code
    }

    // Checking if user with the provided email already exists
    var MatchUSer = await USERS.findAll({where:{user_email:user_email}})

    // Hashing the user's password
    bcrypt.hash(user_password, 10,function(err,hashedPass){
        if(MatchUSer!=''){
            // If user with the same email already exists, return error
            var response = {
                success:false,
                id:0,
                status:'Username already registered',
            }
            res.status(200).json(response)
        }
        else{
            try{
                // Creating a new user with provided details
                USERS.create({
                    user_email,
                    user_password:hashedPass,
                    user_gender,
                    user_phone,
                    user_address:JSON.stringify(address),
                    user_role:'customer'
                }).then(result=>{
                    // If user creation is successful, return success response
                    console.log(result.user_id)
                    var response = {
                        success:true,
                        id:result.user_id,
                        status:'Signup done',
                    }
                    res.status(200).json(response)
                }).catch(err=>{
                    // If there's an error during user creation, return error response
                    console.log(err)
                    var response = {
                        success:false,
                        id:0,
                        status:'Something went wrong',
                    }
                    res.status(200).json(response)  
                })
            }catch(err){
                // If there's any other error, return a generic error response
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


// Function to sign in a user
exports.user_signin = async (req, res) => {
    console.log(req.body);
    var { user_email, user_password } = req.body;

    // Check if the user is an admin
    if (user_email === secret.admin_email) {
        // Find admin user in the database
        USERS.findAll({
            where: {
                user_email
            }
        }).then(result => {
            if (result != '') {
                // Generate token for admin
                const token = jwt.sign({ email: user_email, user_role: 'admin', user_id: result[0].user_id }, secret.secret);
                // Check admin password
                if (user_password === secret.admin_password) {
                    var response = {
                        success: true,
                        id: 1,
                        status: 'login success',
                        user_role: 'admin',
                        token
                    };
                    // Update admin's token in the database
                    USERS.update(
                        { user_token: token },
                        { where: { user_email } }
                    ).then(result => {
                        console.log('-->', token);
                        // Set token in cookie and send response
                        res.cookie("token", token, { expire: new Date(Date.now() + 999999) });
                        res.status(200).json(response);
                    }).catch(err => {
                        var response = {
                            success: false,
                            id: 0,
                            status: 'username/password is wrong',
                        };
                        res.status(200).json(response);
                    });
                } else {
                    // Incorrect admin password
                    var response = {
                        success: false,
                        id: 0,
                        status: 'username/password is wrong',
                    };
                    res.status(200).json(response);
                }
            } else {
                // Admin not found in the database
                var response = {
                    success: false,
                    id: 0,
                    status: 'username/password is wrong',
                };
                res.status(200).json(response);
            }
        });
    } else {
        // User is not an admin, find user in the database
        USERS.findAll(
            {
                where: {
                    user_email,
                }
            }
        ).then(result => {
            if (result != '') {
                var hashpass = result[0].user_password;
                // Compare user's password
                bcrypt.compare(user_password, hashpass, function (err, isMatch) {
                    if (isMatch) {
                        // Generate token for user
                        const token = jwt.sign({ email: user_email, user_role: 'admin', user_id: result[0].user_id }, secret.secret);
                        var response = {
                            success: true,
                            id: result[0].user_id,
                            status: 'login success',
                            user_role: result[0].user_role,
                            token
                        };
                        // Update user's token in the database
                        USERS.update(
                            { user_token: token },
                            { where: { user_email } }
                        ).then(result => {
                            console.log('-->', token);
                            res.cookie("token", token, {
                                expire: new Date(Date.now() + 999999),
                                httpOnly: false,
                                overwrite: true
                            });
                            res.status(200).json(response);
                        }).catch(err => {
                            var response = {
                                success: false,
                                id: 0,
                                status: 'username/password is wrong',
                            };
                            res.status(500).json(response);
                        });
                    } else {
                        // Password doesn't match
                        console.log('**', "not matched");
                        var response = {
                            success: false,
                            id: 0,
                            status: 'username/password is wrong',
                        };
                        res.status(200).json(response);
                    }
                });
            } else {
                // User not found
                console.log('**', "No user Found");
                var response = {
                    success: false,
                    id: 0,
                    status: 'username/password is wrong',
                };
                res.status(200).json(response);
            }
        });
    }
};


// Function to sign out a user
exports.user_signout = (req, res) => {
    // Clear the token cookie
    res.clearCookie('token');
    // Send a JSON response indicating successful signout
    res.json({
        Message: "Signout"
    });
}

// Function to buy a product
exports.buy_product = (req, res) => {
    // Retrieve cart items and order details from request body
    var cartItems = req.body.cartItems;
    var order_amount = req.body.order_amount;
    var order_status = 'processing';

    // Extract authorization header from request
    const { authorization } = req.headers;
    // Extract token from authorization header
    const token = authorization.replace('Bearer', '');

    // Check if token exists
    if (!token) {
        // If token doesn't exist, send error response
        console.log('No Token Found');
        return res.status(401).send({
            error: 'You must be logged in.'
        });
    }

    // Verify the token
    jwt.verify(token, secret.secret, async (err, payload) => {
        // Set payment_capture value
        const payment_capture = 1;

        // Create an order in the database
        ORDER.create({
            userUserId: payload.user_id,
            order_status,
            order_amount,
            cartItems: cartItems,
        }).then(order_result => {
            // Create an order with Razorpay
            rzp.orders.create({
                amount: order_amount * 100,
                currency: 'INR',
                receipt: shortId.generate(),
                payment_capture,
                notes: { order_id: order_result.order_id }
            }).then(result => {
                // Send the response with order details
                res.json({
                    id: result.id,
                    currency: result.currency,
                    amount: result.amount,
                    order_result
                });
            }).catch(err => {
                // Handle errors during Razorpay order creation
                console.log('******', err);
                var response = {
                    status: 'order declined',
                    success: false,
                };
                res.status(500).send(response);
            });
        }).catch(err => {
            // Handle errors during database order creation
            console.log('>>>>>>>>>>', err);
        });
    });
}


// Function to verify an order
exports.verify_order = (req, res) => {
    try {
        // Getting the details back from our front-end
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            order_id,
            cartItems
        } = req.body;

        // Logging cart items for debugging
        console.log('%%%', cartItems);

        // Creating SHA256 hash for verification
        const shasum = crypto.createHmac("sha256", "PNZXDggf7flRmNiC2Fj7yumU");
        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
        const digest = shasum.digest("hex");

        // Comparing our digest with the actual signature
        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legit!" });

        // The payment is legit & verified
        ORDER.update({
            order_status: 'payment successful',
            receipt_number: razorpayOrderId
        }, {
            where: { order_id }
        }).then(result => {
            if (!result) return;
            // Deleting cart items after successful order
            cartItems.map(c => {
                console.log(c.cart_id);
                CART.findByPk(c.cart_id).then(delete_cart => {
                    delete_cart.destroy();
                }).catch(err => { return; });
            });
            // Sending success response
            res.json({
                msg: "success",
                success: true,
                orderId: razorpayOrderId,
                paymentId: razorpayPaymentId,
            });
        }).catch(err => {
            console.log('error occurred ', err);
            // Sending failure response
            res.json({
                msg: "fail",
                success: false,
            });
        });
    } catch (error) {
        console.log(error);
        // Sending server error response
        res.status(500).send(error);
    }
}

// Function to fetch all orders for a user
exports.fetch_orders = (req, res) => {
    const { authorization } = req.headers;
    const token = authorization.replace('Bearer', '');

    if (!token) {
        // If token is not found, sending unauthorized error
        console.log('No Token Found');
        return res.status(401).send({
            error: 'You must be logged in.'
        });
    }
    // Verifying JWT token
    jwt.verify(token, secret.secret, async (err, payload) => {
        // Fetching orders for the authenticated user
        ORDER.findAll({ where: { userUserId: payload.user_id } }).then(result => {
            if (!result) {
                // If no order found, sending appropriate response
                var response = {
                    status: 'No order',
                    success: false
                };
                res.status(200).send(response);
            } else {
                // If orders found, sending them as response
                var response = {
                    status: 'order found',
                    success: true,
                    result
                };
                res.status(200).send(response);
            }
        });
    });
}

// Function to add a new product
exports.add_product = (req, res) => {
    // Destructuring request body
    const { product_category_id, product_name, product_quantity, product_price } = req.body;
    // Retrieving product image path from request files
    var product_image_path = req.files;

    // Extracting authorization token from request headers
    const { authorization } = req.headers;
    const token = authorization.replace('Bearer', '');

    // Checking if token exists
    if (!token) {
        console.log('No Token Found');
        return res.status(401).send({
            error: 'You must be logged in.'
        });
    }

    // Verifying JWT token
    jwt.verify(token, secret.secret, async (err, payload) => {
        // Creating a new product in the database
        PRODUCT.create({
            product_category_id,
            product_name,
            product_quantity,
            product_price,
            product_image_path: product_image_path[0].path,
            product_vendor_id: payload.user_id
        }).then(result => {
            var response = {
                success: true,
                status: 'Product is Added',
            };
            res.status(200).json(response);
        }).catch(err => {
            var response = {
                success: false,
                status: 'Something went wrong',
            };
            console.log(err);
            res.status(500).json(response);
        });
    });
};

// Function to get all products
exports.get_all_products = (req, res) => {
    // Retrieving all products from the database
    PRODUCT.findAll({
        include: [
            {
                model: PRODUCT_CATEGORIES
            }
        ]
    }).then(result => {
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).send('Something went wrong');
    });
};

// Function to get a product by ID
exports.get_product_by_id = (req, res) => {
    var id = req.params.id;
    // Finding a product by its ID
    PRODUCT.findByPk(id).then(result => {
        console.log('result....', result);
        if (result) {
            var response = {
                success: true,
                status: 'Product found',
                data: result
            };
            res.status(200).json(response);
        } else {
            var response = {
                success: false,
                status: 'Something went wrong',
            };
            res.status(500).json(response);
        }
    }).catch(err => {
        var response = {
            success: false,
            status: 'Something went wrong ' + err,
        };
        res.status(500).json(response);
    });
};

// Function to delete a product
exports.delete_product = (req, res) => {
    var id = req.params.id;
    console.log('DELETEING ERROR' + id);
    // Finding a product by its ID and deleting it
    PRODUCT.findByPk(id).then(delete_product => {
        delete_product.destroy();
    }).then(result => {
        console.log('DELETED PRODUCT');
        if (result !== '' || result != null || result !== 'undefined') {
            var response = {
                success: true,
                status: 'deleted'
            };
            res.status(200).send(response);
        }
    }).catch(err => {
        var response = {
            success: false,
            status: 'Something went wrong'
        };
        console.log('DELETEING ERROR' + err);
        res.status(200).send(response);
    });
};

// Function to edit a product
exports.edit_product = (req, res) => {
    const { product_category_id, product_name, product_quantity, product_price, product_id } = req.body;

    // Update the product in the database
    PRODUCT.update({
        product_category_id,
        product_name,
        product_quantity,
        product_price,
    }, {
        where: { product_id: product_id }
    }).then(result => {
        if (result) {
            var response = {
                success: true,
                status: 'Product is Updated',
            };
            res.status(200).json(response);
        } else {
            var response = {
                success: false,
                status: 'Something went wrong ' + err,
            };
            res.status(200).json(response);
        }
    }).catch(err => {
        var response = {
            success: false,
            status: 'Something went wrong ' + err,
        };
        res.status(200).json(response);
    });
};

// Function to add a product to the cart
exports.add_to_cart = (req, res) => {
    var { product_id } = req.body;

    const { authorization } = req.headers;
    const token = authorization.replace('Bearer', '');

    // Check if a token is provided
    if (!token) {
        console.log('No Token Found');
        return res.status(401).send({
            error: 'You must be logged in.'
        });
    }

    // Verify the token
    jwt.verify(token, secret.secret, async (err, payload) => {
        CART.create({
            productProductId: product_id,
            quantity: 1,
            userUserId: payload.user_id
        }).then(result => {
            if (result) {
                var response = {
                    success: true,
                    status: 'Added to cart'
                };
                res.status(200).send(response);
            }
        }).catch(err => {
            var response = {
                success: false,
                status: 'Something went wrong'
            };
            res.status(500).send(response);
        });
    });
};

// Function to get the user's cart
exports.get_cart = (req, res) => {
    const { authorization } = req.headers;
    const token = authorization.replace('Bearer', '');

    // Check if a token is provided
    if (!token) {
        console.log('No Token Found');
        return res.status(401).send({
            error: 'You must be logged in.'
        });
    }

    // Verify the token
    jwt.verify(token, secret.secret, async (err, payload) => {
        CART.findAll({
            where: { userUserId: payload.user_id },
            include: [
                {
                    model: USERS
                },
                {
                    model: PRODUCT
                }
            ]
        }).then(result => {
            if (result) {
                res.status(200).send(result);
            }
        }).catch(err => {
            res.status(500).send('Something went wrong');
        });
    });
};

// Function to remove an item from the cart
exports.remove_cart_item = (req, res) => {
    var { product_id } = req.body;
    const { authorization } = req.headers;
    const token = authorization.replace('Bearer', '');

    // Check if a token is provided
    if (!token) {
        console.log('No Token Found');
        return res.status(401).send({
            error: 'You must be logged in.'
        });
    }

    // Verify the token
    jwt.verify(token, secret.secret, async (err, payload) => {
        // Find the item in the cart
        CART.findAll({
            where: {
                productProductId: product_id,
                userUserId: payload.user_id
            }
        }).then(result => {
            // Delete the item from the cart
            CART.findByPk(result[0].cart_id).then(delete_cart => {
                delete_cart.destroy();
            }).then(result => {
                if (result !== '' || result != null || result !== 'undefined') {
                    var response = {
                        success: true,
                        status: 'deleted'
                    };
                    res.status(200).send(response);
                } else {
                    var response = {
                        success: false,
                        status: 'Something went wrong'
                    };
                    res.status(500).send(response);
                }
            }).catch(err => {
                var response = {
                    success: false,
                    status: 'Something went wrong'
                };
                res.status(500).send(response);
            });
        });
    });
};
