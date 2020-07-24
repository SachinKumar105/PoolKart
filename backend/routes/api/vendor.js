const User = require('../../models/user')
const UserSession = require('../../models/usersession')
const VendorProduct = require('../../models/vendorproduct')
const Order = require('../../models/orders')

module.exports = (app) => {
    app.get('/api/vendor/viewproducts', (req,res,next) => {
        // console.log('req:',req)
        const { query } = req;
        const { userid } = query;
        // console.log('userid--',userid);
        VendorProduct.find({
            // seller: username
            sellerid: userid,
            status: 'waiting',
            $where: 'this.quantity != this.quantityordered'
        }, (err, products) => {
            if(err){
                console.log(err)
                return res.send({
                    message: 'Error: Server Error'
                });
            }
            // console.log(username);
            // if(products.length < 1){
                //     return res.send({
                    //         message: 'No products added/ check the input format (line 8)'
                    //     })
                    // }
            else{
                // console.log(products);
                return res.send(products);
            }
        });
    })
    app.post('/api/vendor/addproduct', (req,res,next) => {
        const { body } = req;
        const {
            username,
            userid,
            name,
            price,
            quantity,
            quantityordered
        } = body;
        
        if (!name){
            return res.send({
                message: 'Error: name cannot be blank.',
                'name': name
            });
        }
        if (!price){
            return res.send({
                message: 'Error: price cannot be blank.',
                'price': price
            });
        }
        if (!quantity){
            return res.send({
                message: 'Error: qunatity cannot be blank.',
                'qunatity': qunatity
            });
        }
        const vendorproduct = new VendorProduct();
        vendorproduct.seller = username;
        vendorproduct.sellerid = userid;
        vendorproduct.name = name;
        vendorproduct.price = price;
        vendorproduct.quantity = quantity;
        // vendorproduct.status = status;
        // vendorproduct.quantityordered = quantityordered;
        vendorproduct.save((err, vendorproduct) => {
            if (err){
                return res.send({
                    message: 'Error: Vendor product save error'
                });
            }
            return res.send({
                message: 'Product added'
            });
        });
        
    });
    app.post('/api/vendor/dispatch',(req,res,next) => {
        const { body } = req;
        const { product_id } = body;
        console.log("lol--",product_id);
        VendorProduct.findByIdAndUpdate(product_id,{
                status: 'dispatched'
        },null,(err, product) => {
            if(err){
                return res.send({
                    message: 'Error: Server Error'
                });
            }
            console.log("l--",product);
            if(product.length < 1){
                return res.send({
                    message: 'Not ready to be dispatched'
                })
            }
            else{
                // console.log(product_id)
                Order.updateMany({
                    productid: product_id
                },{
                    $set: {
                        status: 'dispatched'
                    }
                }, (err,p) => {
                    return res.send({
                        message: 'dispatched',
                        product_id: product_id
                    })
                })
                
            }
        })
    })
    app.get('/api/vendor/viewdispatched', (req,res,next) => {
        const { query } = req;
        const { userid } = query;
        console.log(userid);
        VendorProduct.find({
            sellerid: userid,
            status: 'dispatched'
        }, (err, products) => {
            if(err){
                return res.send({
                    message: 'Error: Server Error'
                });
            }
            // console.log(err)
            if(products.length < 1){
                return res.send({
                    message: 'No products dispatched'
                })
            }
            else{
                res.send(products)
                // Order.find({
                //     sellerid: userid,
                // },(err,p) => {
                //     if(err){
                //         return res.send({
                //             message: 'Error: Server Error'
                //         })
                //     }
                //     else{
                //         return res.send({p,products});

                //     }
                // })
            }
        }); 
    })
    app.get('/api/vendor/viewreadytodispatch', (req,res,next) => {
        const { query } = req;
        const { userid } = query;
        console.log(userid);
        VendorProduct.find({
            sellerid: userid,
            status: 'waiting',
            // quantity: { $gte: '$quantityordered' }
            $where: 'this.quantity == this.quantityordered'
        }, (err, products) => {
            if(err){
                console.log(err)
                return res.send({
                    message: 'Error: Server Error'
                });
            }
            // console.log(products);
            // console.log(username);
            if(products.length < 1){
                return res.send({
                    message: 'No products are ready to dispatch'
                })
            }
            if(products.quantity == products.quantityordered)
            {
                // console.log(products.quantity)
                return res.send(products);
            }
        })
        // .where(quantityordered == quantity)
    })
    app.get('/api/vendor/reviews', (req,res,next) => {
        const { query } = req;
        const { userid } = query;
        Order.find({
            sellerid: userid
        },(err,results) => {
            if(err){
                console.log(err)
                return res.send({
                    message: 'Error: Server Error'
                });
            }
            else{
                return res.send(results)
            }
        })
    })
    app.post('/api/vendor/cancel', (req,res,next) => {
        const { body } = req;
        const { product_id } = body;
        console.log("lol--",product_id);
        VendorProduct.findByIdAndUpdate(product_id,{
                status: 'cancelled'
        },null,(err, product) => {
            if(err){
                return res.send({
                    message: 'Error: Server Error'
                });
            }
            console.log("l--",product);
            if(product.length < 1){
                return res.send({
                    message: 'Not ready to be cancelled'
                })
            }
            else{
                // console.log(product_id)
                Order.updateMany({
                    productid: product_id
                },{
                    $set: {
                        status: 'cancelled'
                    }
                }, (err,p) => {
                    return res.send({
                        message: 'cancelled',
                        product_id: product_id
                    })
                })
                
            }
        })
    })
    app.post('/api/vendor/place', (req,res,next) => {
        const { body } = req;
        const { product_id } = body;
        console.log("lol--",product_id);
        Order.updateMany({
            productid: product_id
        },{
            $set: {
                status: 'placed'
            }
        }, (err,p) => {
            return res.send({
                message: 'placed',
                product_id: product_id
            })
        })
    })
}