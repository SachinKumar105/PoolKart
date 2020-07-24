const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

let User = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String
    },
    isDeleted: {
        type: Boolean
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

User.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', User);