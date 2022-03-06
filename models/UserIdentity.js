const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserIdentitySchema = new mongoose.Schema({
    userName:{
        type: String,
        required: [true, 'A user name is required'],
        unique: true
    },
    role:{
        type: String,
        enum: ['client', 'admin', 'superadmin'],
        default: 'client'
    },
    password:{
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: String,
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    }
});

// add password encryption middleware, using bcryptjs
UserIdentitySchema.pre('save', async function (next){
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
});

// sign the JWT and return the token
UserIdentitySchema.methods.getSignedJwtToken = function(){
    return jwt.sign({ id: this._id},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRE});
}

// match the Users's password to hashed passwordin the DB
UserIdentitySchema.methods.validatePassword = async function(plainTextPassword){
    return await bcrypt.compare(plainTextPassword, this.password);
}

module.exports = mongoose.model('UserIdentity', UserIdentitySchema);