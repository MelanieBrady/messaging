const express = require('express');
const router = express.Router();

const tokenUtils = require('../auth/token_utils');

// End point, handler of request and return response
router.get('/', tokenUtils.verifyToken, (req, res) => {
    res.status(200).send({
        success: true,
        message: `this is an auntenticated message`

    });
    console.log("message sent");
});

module.exports = router; 
