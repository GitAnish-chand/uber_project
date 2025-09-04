const express = require('express')
const router = express.Router();
const { body } = require('express-validator');
const captainController = require('../controllers/captain.controller')

router.post('/register', [

    body('fullname').exists().withMessage('Fullname is required'),
    body('fullname.firstname')
        .exists().withMessage('Firstname is required')
        .isString().withMessage('Firstname must be a string')
        .isLength({ min: 3 }).withMessage('Firstname must be at least 3 characters long'),
    body('fullname.lastname')
        .exists().withMessage('Lastname is required')
        .isString().withMessage('Lastname must be a string')
        .isLength({ min: 3 }).withMessage('Lastname must be at least 3 characters long'),
    body('email')
        .exists().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address'),
    body('password')
        .exists().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color')
        .exists().withMessage('Vehicle color is required')
        .isString().withMessage('Vehicle color must be a string')
        .isLength({ min: 3 }).withMessage('Vehicle color must be at least 3 characters long'),
    body('vehicle.plate')
        .exists().withMessage('Vehicle palte is required')
        .isLength({ min: 3 }).withMessage('Vehicle plate must be at least 3 characters long'),
    body('vehicle.capacity')
        .exists().withMessage('Vehicle capacity is required')
        .isInt({ min: 1 }).withMessage('Vehicle capacity must be a number and at least 1'),
    body('vehicle.vehicleType')
        .exists().withMessage('Vehicle type is required')
        .isString().withMessage('Vehicle type must be a string')
],
    captainController.registerCaptiain

)

module.exports = router


