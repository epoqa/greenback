const mongoose = require('mongoose')

const Diary = mongoose.model('Diary', {
    diaryName: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    owner: {
        type: String,
        required: true,
        ref: 'User'
    },
    createdAt: {
        type: Date, 
        default: Date.now
    },
    pictures: [
        {
            createdAt: {
                type: Date, 
                default: Date.now
            },
            picture: String
        }
    ],
    comments:  [
        {
            owner: {
                username: String,
            },
            comment: String,         
            createdAt: {
                type: Date,
                default: Date.now
            }
            
        }
    ]
})   
module.exports = Diary