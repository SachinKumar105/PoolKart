const User = require('../../models/user')
const UserSession = require('../../models/usersession')
const VendorProduct = require('../../models/vendorproduct')
const Order = require('../../models/orders')

module.exports = (app) => {
    app.get('/api/customer/viewproducts', (req,res,next) => {
        const { query } = req;
        const { name,sorttype } = query;
        console.log('name',name);
        VendorProduct.find({
            name: name
        }, (err,products) => {
            if(err){
                return res.send({
                    message:'Error: Server Error'
                });
            }
            if(products.length < 1){
                return res.send({
                    message: 'No products with given name'
                });
            }
            else{
                return res.send(products);
            }
        })
    })
    app.post('/api/customer/order', (req,res,next) => {
        const { body } = req;
        console.log(body);
        const{
            seller,
            sellerid,
            buyer,
            buyerid,
            productid,
            name,
            price,
            quantity
        } = body
        if(!quantity){
            return res.send({
                message:'Error : quantity cannot be blank'
            })
        }
        const newOrder = new Order();
        newOrder.seller = seller;
        newOrder.sellerid = sellerid;
        newOrder.buyer = buyer;
        newOrder.buyerid = buyerid;
        newOrder.productid = productid;
        newOrder.name = name;
        newOrder.price = price;
        newOrder.quantity = quantity;
        newOrder.save((err, neworder) => {
            if(err){
                return res.send({
                    message: 'Error: Order save error'
                });
            }
            VendorProduct.findOneAndUpdate({
                _id: productid
            },{
                // $set:{
                //     quantityordered: { $add: ["$quantityordered",newOrder.quantity] }
                // }
                 $inc: { quantityordered:newOrder.quantity }
            },null, (err, product) => {
                if(err){
                    console.log(err);
                    return res.send({
                        message: 'Error: Server Error'
                    });
                }
                else{
                    if(newOrder.quantity+product.quantityordered == product.quantity)
                    {
                        Order.updateMany({
                            productid: product._id
                        },{
                            status: 'placed'
                        },null, (err, product) => {
                            if(err){
                                console.log(err);
                                return res.send({
                                    message: 'Error: Server Error'
                                })
                            }
                            else{
                                return res.send({
                                    message: 'Order saved',
                                    // quantityordered:product.quantityordered+newOrder.quantity,
                                    // quantity: product.quantity
                                })
                            }
                    })
                    }
                    return res.send({
                        message: 'Order saved',
                        quantityordered:product.quantityordered+newOrder.quantity,
                        quantity: product.quantity
                    })
                }
        })
        
    })
})
    app.post('/api/customer/rating', (req,res,next) => {
        const { body } = req;
        const { 
            vendorid,
            orderid,
            customerid,
            vendorrating,
            productrating,
            review
         } = body;
         User.findOneAndUpdate({
            _id: vendorid
            },{
            $inc: { 
                sum:vendorrating,
                number:1
             }
         },null,(err,pr) => {
             if(err){
                 return res.send({
                     message: 'Error: Server Error'
                 })
             }
             VendorProduct.updateMany({
                 sellerid: vendorid
             },{
                 $inc: {
                     sum:vendorrating,
                     number:1
                 }
             },(err,p)=> {
                if(err){
                    console.log(err);
                    return res.send({
                        message: 'Error: Server Error'
                    });
                }
             })
             Order.findByIdAndUpdate(orderid,{
                review: review,
                rating: productrating
            },null,(err,p) => {
               if(err){
                   console.log(err);
                   return res.send({
                       message: 'Error: Server Error'
                   });
               }
               else{
                   return res.send({
                       message: 'Reviewed',
                   })
               }
            })
         })
         

    })
    app.get('/api/customer/vieworders', (req,res,next) => {
        const { query } = req;
        const { token } = query;
        Order.find({
            buyerid: token
        }, (err,products) => {
            if(err){
                return res.send({
                    message:'Error: Server Error'
                });
            }
            if(products.length < 1){
                return res.send({
                    message: 'No products bought'
                });
            }
            else{
                return res.send(products);
            }
        })
    })
    app.get('/api/customer/getdiff', (req,res,next) => {
        const { query } = req;
        const { productid } = query;
        VendorProduct.findOne({
            _id: productid
        },(err,p) => {
            if(err){
                return res.send({
                    message:'Error: Server Error'
                });
            }
            else{
                return res.send({
                    diff:p.quantity-p.quantityordered
                })
            }
        })
    })
    app.post('/api/customer/editorder', (req,res,next) => {
        const { body } = req;
        // const { orderid } = body;
        const{
            orderid,
            productid,
            oldquantity,
            newquantity,
        } = body
        console.log(orderid);
        if(!newquantity){
            return res.send({
                message:'Error : newquantity cannot be blank'
            })
        }
        const diff = newquantity-oldquantity;
        console.log('diff',diff);
        // VendorProduct.findByIdAndUpdate(productid,{
        //         quantityordered:quantityordered + diff
        // },(err,product) => {
        //     if(err){
        //         return res.send({
        //             message: "Error: Server Error"
        //         })
        //     }
        //     console.log(newquantity-oldquantity);
        //     console.log(product.quantityordered);
            
        // })
        var totquantity = 0;
        var totquantityordered = 0;
        VendorProduct.updateOne({"_id":productid},{
            $inc : {
                quantityordered: diff
            }
        },(err,product) => {
            if(err){
                return res.send({
                    message: "Error: Server Error"
                })
            }
            console.log(newquantity-oldquantity);
        })
        VendorProduct.findOne({
            _id:productid
        },(err,product) => {
            if(err){
                return res.send({
                    message: "Error: Server Error"
                })
            }
            console.log(product.quantityordered);
            totquantity = product.quantity;
            totquantityordered = product.quantityordered;
        })
        var upstat =''
        if(totquantityordered == totquantity){
            upstat = 'placed';
            console.log('placed')
        }
        else{
            upstat = 'waiting';
            console.log('waiting');
        }
        console.log('upstat:',upstat);
        console.log('l--',productid);
        Order.updateMany({
            productid: productid
        },{
            status: upstat
        },(err,p) => {
            if(err){
                return res.send({
                    message: 'Error: Server Error'
                })
            }
            // console.log(p.status)
        })
        Order.findByIdAndUpdate(orderid,{
                quantity: newquantity,
                // status: upstat
        },null, (err, order) => {
            if(err){
                return res.send({
                    message: 'Error: Server Error'
                })
            }
            return res.send({
                message: 'Order Edited',
                quantity: newquantity
            })
        }
        )
    })
    
}