const mongoose = require('mongoose');
const roleList = require('../seed/Roles');
const statusList = require('../seed/Status');
const uniqueValidator = require('mongoose-unique-validator');

const SCHEMA = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        index: true,
        match: [/\S+@\S+\.\S+/, "Invalid"]
    },
    contact: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    salt: {
        type: String
    },
    roles: {
        type: [
            {
                type: String,
                enum: roleList.Role
            }
        ],
        default: ['HR']
    },
    status: {
        type: String,
        enum: statusList.User_status,
        default: 'InActive'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
},
    {
        timestamps: true
    })

SCHEMA.plugin(uniqueValidator);
const User = module.exports = mongoose.model('User', SCHEMA)