const mongoose = require('mongoose');
const accountTypes = require('../enums/accountTypes');

const AccountSchema = new mongoose.Schema({
    number:{
        type: String,
        required: [true, 'Account number is required'],
        unique: [true, 'Account Numbers must be unique']
    },
    accountType:{
        type: Number,
        required: [true, 'An account type must be specified'],
        enum: [accountTypes]
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Account', AccountSchema);