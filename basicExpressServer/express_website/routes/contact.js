'use strict';
const express = require('express');
const router = express.Router();
const nodemailer = require( 'nodemailer' );

/* GET contact page page. */
router.get('/', (req, res, next) => {
    res.render('contact', { title: 'Contact' });
});

router.post('/send', (req, res, next) =>{

    let nodemailer = require("nodemailer");

    let smtpTransport = nodemailer.createTransport("SMTP", {
        service: "Gmail",
        auth: {
            XOAuth2: {
                user: "pi6.mihai@gmail.com", // Your gmail address.
                clientId: "", //Your client ID
                clientSecret: "", //YOUR CLIENT SECRET
                refreshToken: "" //Your refreshtoken
            }
        }
    });

    let mailOptions = {
        from: "pi6.mihai@gmail.com",
        to: "mijeamihai@yahoo.com",
        subject: "NODE TEST NODEMAILER",
        generateTextFromHTML: true,
        html: '<p>You have a new submission with following details</p><ul><li>Name: '+ req.body.name +'</li><li> Email: '+ req.body.email + '</li><li>Message: '+ req.body.message +'</li></ul>'
    };

    smtpTransport.sendMail(mailOptions, (error, response) => {
        if (error) {
            console.log(error);
            res.redirect('/');
        } else {
            console.log(response);
            res.redirect('/');
        }
        smtpTransport.close();
    });

} );

module.exports = router;
