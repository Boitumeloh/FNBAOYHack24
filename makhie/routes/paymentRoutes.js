const express = require('express');
const router = express.Router();
const { initiatePayment, handlePayFastIPN } = require('../controllers/paymentController');

// Route to initiate payment
router.post('/initiate', initiatePayment);

// Route to handle PayFast IPN (notifications)
router.post('/ipn', handlePayFastIPN);

module.exports = router;
