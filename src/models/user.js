const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]


});

// userSchema.statics.findOne = async (userR) => {
//     const user = await User.findOne({email: userR.email});

//     if(!user) {
//         throw new Error('Unable to login');
//     }

//     const isMatch = await bcrypt.compare(userR.password, user.password);


//     if(!isMatch) {
//         throw new Error('Password is incorrect');
//     }
// }

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();

});

const User = mongoose.model('User', userSchema)

module.exports = User