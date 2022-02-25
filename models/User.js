const mongoose = require('mongoose');
const accountTiers = require('../enums/accountTiers');


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
        enum:[accountTiers],
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
},{
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
});

// cascade delete Accounts when a User is deleted
UserSchema.pre('remove', async function (next){
    await this.model('Account').deleteMany({user: this._id});
    next();
});

// reverse populate with virtuals
UserSchema.virtual('accounts', {
    ref: 'Account', // model to include
    localField: '_id',
    foreignField: 'user', // the field in the 'Account' model we want to partain to
    justOne: false // indicates that it will return an array
});

module.exports = mongoose.model('User', UserSchema);