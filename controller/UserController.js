const mongoose = require('mongoose');
const UserSchema = require('../models/User');
const UserService = require('../services/UserService');
const config = require('config')
const Token = require('../handler/genToken');
const roleList = require('../seed/Roles');

exports.Add = (req, res, next) => {
    console.log("Creating User");

    let userId;
    // if (req.tokenData.data._id) {
    //     userId = req.tokenData.data._id;
    // }
    let formData = new UserSchema({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        contact: req.body.contact,
        roles: req.body.roles,
        salt: config.get('App.SALT_ROUNDS'),
        createdBy: userId
    })
    console.log(formData)
    UserService.Add(formData, (err, user) => {
        if (err) {
            let message = [];
            console.log(err);
            if (err.errors.name) message.push("Name is required.")
            if (err.errors.email) message.push("Invalid Email Address or Already Taken.")
            if (err.errors.contact) message.push("Invalid Contact or Already Taken.")
            return res.json({
                success: false,
                err_subject: "Error !!",
                err_message: message
            })
        } else {
            return res.json({
                success: true,
                success_subject: "Success !!",
                success_message: "You have successfully registered the user."
            })
        }
    })

}

exports.SignIn = (req, res, next) => {
    console.log("Processing Login");
    console.log(req.body);
    let roleListControl;

    console.log(req.body.email)

    UserService.GetByEmail(req.body.email, (err, user) => {
        if (err) {
            console.log(err)
            res.status(400).json({
                success: false,
                err_subject: "Authentication Error",
                err_message: err
            })
        }
        if (!user) {
            console.log("Invalid email, username, password");
            res.status(400).json({
                success: false,
                err_subject: "Authentication Error",
                err_message: "Invalid Authentication, Please check your login name and password"
            });
        }
        if (user) {
            UserService.comparePassword(req.body.password, user.password, (err, isMatch) => {
                if (err) {
                    console.log("Invalid Password")
                    res.status(400).json({
                        success: false,
                        err_subject: "Authentication Error",
                        err_message: "Invalid Authentication, Please check your login name and password"
                    });
                }
                if (isMatch) {
                    console.log("user found")
                    // console.log(user)
                    if (user.status == "Active") {
                        const token = Token.generateToken(user);
                        // console.log(token);
                        return res.json({
                            success: true,
                            // user:user,
                            role: user.roles,
                            token: "JWT " + token
                        })
                    } else if (user.status == "InActive") {
                        return res.status(403).json({
                            success: false,
                            err_subject: "Login Failed",
                            err_message: "Your account is InActive, Please contact your Admin."
                        })
                    } else if (user.status == "DeActivated") {
                        return res.status(403).json({
                            success: false,
                            err_subject: "Login Failed",
                            err_message: "Your account have been DeActivated, Please contact your admin."
                        })
                    } else {
                        return res.status(400).json({
                            success: false,
                            err_subject: "Oops",
                            err_message: "Something went wrong. Please contact technical support"
                        })
                    }
                } else {
                    return res.status(400).json({
                        success: false,
                        err_subject: "Authentication Error",
                        err_message: "Wrong Password"
                    })
                }
            })

        }
    })
    // UserService.findUserByRole(req.body.email, req.body.contact, roleListControl, (err, user) => {
    //     if (err) {
    //         console.log(err)
    //         res.status(400).json({
    //             success: false,
    //             err_subject: "Authentication Error",
    //             err_message: err
    //         })
    //     }
    //     if (!user) {
    //         console.log("Invalid email, username, password");
    //         res.status(400).json({
    //             success: false,
    //             err_subject: "Authentication Error",
    //             err_message: "Invalid Authentication, Please check your login name and password"
    //         });
    //     }


    // })
}
exports.GetAll = (req, res, next) => {
    UserService.GetAll((err, user) => {
        if (err) {
            console.log(err)
        }
        return res.json({
            success: true,
            user
        })
    })
}

exports.UpdateStatus = (req, res, next) => {
    console.log(req.params._id)
    UserService.GetByID(req.params._id, (err, user) => {
        if (user) {
            if (user.status == "Active") {
                UserService.updateUserStatus(req.params._id, 'InActive', (err, data) => {
                    if (err) {
                        res.json({
                            success: false,
                            err_subject: "Error..",
                            err_message: err
                        })
                    }
                    if (data) {
                        res.json({
                            success: true,
                            success_subject: "Success!!",
                            success_message: "User Status InActivated Successfully."
                        })
                    }
                })
            } else if (user.status == "InActive") {

                UserService.updateUserStatus(req.params._id, 'Active', (err, data) => {
                    if (err) {
                        res.json({
                            success: false,
                            err_subject: "Error..",
                            err_message: err
                        })
                    }
                    if (data) {
                        res.json({
                            success: true,
                            success_subject: "Success!!",
                            success_message: "User Status Activated Successfully."
                        })
                    }
                })
            } else if (user.status == "DeActivate") {
                UserService.updateUserStatus(req.params._id, 'Active', (err, data) => {
                    if (err) {
                        res.json({
                            success: false,
                            err_subject: "Error..",
                            err_message: err
                        })
                    }
                    if (data) {
                        res.json({
                            success: true,
                            success_subject: "Success!!",
                            success_message: "User Status Activated Successfully."
                        })
                    }
                })

            }
        }
        if (err) {
            res.json({
                success: false,
                err_subject: 'unhandled',
                err_message: err
            })
        }
    });
}
exports.DeActivateUser = (req, res, next) => {
    console.log(req.params.id)
    UserService.deactivateUser(req.params.id, (err, success) => {
        if (err) {
            res.json({
                success: false,
                err_subject: 'Error!!',
                err_message: 'Oops Something went wrong, Please contact your admin'
            })
        }
        if (success) {
            res.json({
                success: true,
                success_subject: 'Success!!',
                success_message: 'Account Deactivated Successfully'
            })
        }
        else {
            res.status(400).json({
                success: false,
                success_subject: 'Failed!!',
                success_message: 'user not found'
            })
        }
    })
}

exports.Update = (req, res, next) => {
    const id = req.params.id;
    let formData = new UserSchema({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        contact: req.body.contact,
        roles: req.body.roles
    })

    UserService.Update(id, formData, (err, data) => {
        if (err) {
            let message = [];
            console.log(err);
            if (err.errors.name) message.push("Name is required.")
            if (err.errors.email) message.push("Invalid Email Address or Already Taken.")
            if (err.errors.contact) message.push("Invalid Email Address or Already Taken.")
            return res.json({
                success: false,
                err_subject: "Error !!",
                err_message: message
            })
        } else {
            return res.json({
                success: true,
                success_subject: "Success !!",
                success_message: "You have successfully Updated the user."
            })
        }
    })

}