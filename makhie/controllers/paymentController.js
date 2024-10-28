const crypto = require('crypto');
const querystring = require('querystring');

// Load environment variables
const {
    PAYFAST_MERCHANT_ID,
    PAYFAST_MERCHANT_KEY,
    PAYFAST_RETURN_URL,
    PAYFAST_CANCEL_URL,
    PAYFAST_NOTIFY_URL,
    PAYFAST_PAYMENT_URL
} = process.env;

// Controller to handle payment initiation
const initiatePayment = (req, res) => {
    const { amount } = req.body;

    // Data required for PayFast payment form
    const paymentData = {
        merchant_id: PAYFAST_MERCHANT_ID,
        merchant_key: PAYFAST_MERCHANT_KEY,
        return_url: PAYFAST_RETURN_URL,
        cancel_url: PAYFAST_CANCEL_URL,
        notify_url: PAYFAST_NOTIFY_URL,
        amount,
        item_name: 'Contribution',
    };

    // Convert data to query string format
    const queryString = querystring.stringify(paymentData);

    // Redirect to PayFast with payment data
    res.redirect(`${PAYFAST_PAYMENT_URL}?${queryString}`);
};

// Handle PayFast IPN (Instant Payment Notification)
const handlePayFastIPN = (req, res) => {
    // Step 1: Receive and parse the IPN data from PayFast
    const { payment_status, amount_gross, item_name, ...otherData } = req.body;

    // Step 2: Check that the payment status is successful
    if (payment_status === 'COMPLETE') {
        // Add your logic here to update the user’s account or record the contribution
        console.log('Payment successful:', { amount_gross, item_name });
        // For example: update the user's balance or save the transaction details in the database
    } else {
        console.log('Payment not completed.');
    }

    // Respond to PayFast with 200 status to acknowledge receipt
    res.status(200).send();
};

// // Function to handle payment processing
// const processPayment = (req, res) => {
//     const { amount, businessId } = req.body; // Get amount and business ID from the request body

//     // PayFast parameters
//     const payfastParams = {
//         merchant_id: PAYFAST_MERCHANT_ID, // Use the environment variable for Merchant ID
//         merchant_key: PAYFAST_MERCHANT_KEY, // Use the environment variable for Merchant Key
//         amount: amount,
//         item_name: 'Contribution to Business on Makhie', // A description of what the payment is for
//         return_url: PAYFAST_RETURN_URL, // URL to redirect to on success
//         cancel_url: PAYFAST_CANCEL_URL, // URL to redirect to on cancel
//         notify_url: PAYFAST_NOTIFY_URL, // URL to notify on payment confirmation
//         custom_int1: businessId // You can add any custom parameters if necessary
//     };

//     // Generate the query string for PayFast
//     const queryString = querystring.stringify(payfastParams);
//     const payfastUrl = `${PAYFAST_PAYMENT_URL}?${queryString}`; // PayFast payment URL

//     // Redirect user to the PayFast payment page
//     res.redirect(payfastUrl);
// };

module.exports = {
    initiatePayment,
    handlePayFastIPN,
    // processPayment,
};
