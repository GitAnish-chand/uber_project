const express = require('express')
const router = express.Router()
const { body } = require("express-validator")
const userController = require('../controllers/user.controller')
const authMiddleware = require("../middlewares/auth.middleware")

router.post('/register', [
    body('fullname.firstname').isLength({ min: 5 }).withMessage("Firstname must be at least 3 character long"),
    body('email').isEmail().withMessage('invalid Email'),
    body('password').isLength({ min: 6 }).withMessage("password must be 6 character long")
],
    userController.registerUser
)

router.post('/login', [
    body('email').isEmail().withMessage('invalid Email'),
    body('password').isLength({ min: 6 }).withMessage("password must be 6 character long")
],
    userController.loginUser
)

router.get('/profile', authMiddleware.authUser, userController.getUserProfile)

router.get('/logout', authMiddleware.authUser, userController.logoutUser)



module.exports = router
