const mongoose = require('mongoose');
const accountTierEnum = require('../enums/accountTiers');


const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First Name field is required'],
        trim: true,
        maxlength: [50, 'first Name cant exceed 50 characters.']
    },
    lastName:{
        type: String,
        required: [true, 'Last Name field is required'],
        trim: true,
        maxlength: [50, 'Last Name cant exceed 50 characters.']
    },
    idNumber:{
        type: String,
        required: true,
        unique: true,
        length: [13, 'Id numbers must be 13 characters.']
    },
    phone:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    address:{
        type: String,
        required: true
    },
    accountTier:{
        type: Number,
        required: true,
        enum:[accountTierEnum],
    },
    accounts:{
        type: [String],
        required: true
    },
    accountVerified:{
        type: Boolean,
        default: false
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

module.exports = mongoose.model('User', UserSchema);