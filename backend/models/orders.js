const mongoose = require('mongoose');

const Order = new mongoose.Schema({
    seller: {
        type: String
    },
    sellerid: {
        type: String
    },
    buyer: {
        type: String
    },
    buyerid: {
        type: String
    },
    productid: {
        type: String
    },
    name: {
        type: String
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number
    },
    status: {
        type: String,
        default: 'waiting'
    },
    review: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Order', Order);