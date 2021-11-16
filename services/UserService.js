const bcrypt = require('bcryptjs');
const User = require('../models/User');
var config = require('config');

module.exports.Add = function (newUser, callback) {
    bcrypt.genSalt(config.get('App.SALT_ROUNDS'), (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) return err;
            newUser.password = hash;
            newUser.save(callback);
        })
    })
}

module.exports.GetByID = function (id, callback) {
    User.findById(id).populate('companyProfile').exec(callback);
}

module.exports.GetByEmail = function (email, callback) {
    let query = {
        email: email
    }
    User.findOne(query, callback);
}

module.exports.updateUserStatus = function (UserId, status, callback) {
    let query = {
        _id: UserId
    }
    let setStatus = {
        status: status
    }
    User.updateOne(query, { $set: setStatus }, callback);
}

module.exports.GetAll = function (callback) {
    User.find(callback);
}

module.exports.findUserByRole = function (email, contact, role, callback) {

    const queryByUsername = {
        email: email,
        "roles": { $in: role }
    }
    const queryByEmail = {
        contact: contact,
        "roles": { $in: role }
    }
    User.findOne({ $or: [queryByEmail, queryByUsername] }, callback)
}

module.exports.comparePassword = function (password, hashPassword, callback) {
    bcrypt.compare(password, hashPassword, (err, isMatch) => {
        console.log("hashpassword :" + hashPassword)
        if (err) throw err;
        callback(null, isMatch);
    });
}

module.exports.deactivateUser = function (UserId, callback) {
    let query = {
        _id: UserId
    }
    let setStatus = {
        status: 'DeActivate'
    }
    User.updateOne(query, { $set: setStatus }, callback);
}

module.exports.Update = function (id, updateData, callback) {
    let query = {
        _id: id,
    }
    User.updateOne(query, { $set: updateData }, callback);
}