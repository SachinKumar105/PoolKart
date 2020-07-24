const mongoose = require('mongoose');

const VendorProduct = new mongoose.Schema({
    seller: {
        type: String
    },
    sellerid: {
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
    quantityordered: {
        type: Number,
        default: 0
    },
    sum: {
        type: Number,
        default: 0
    },
    number: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('VendorProduct', VendorProduct);