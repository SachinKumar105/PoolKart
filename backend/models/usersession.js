const mongoose = require('mongoose');

const UserSession = new mongoose.Schema({
    userId: {
        type: String,
        defalut: ''
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('UserSession', UserSession);