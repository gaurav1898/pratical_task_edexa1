const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController')
const permits = require('../handler/oauthorization');

//Registration Of Users
router.post('/signup', permits('Manager'), UserController.Add);

//Authentication of User Global
router.post('/signin/:role', UserController.SignIn);
router.get('/', permits('HR', 'Manager'), UserController.GetAll);

router.delete('/:id', permits('HR', 'Manager'), UserController.DeActivateUser);

router.get('/statusUpdate/:_id', UserController.UpdateStatus);

router.put('/:id', permits('HR', 'Manager'), UserController.Update);

module.exports = router;