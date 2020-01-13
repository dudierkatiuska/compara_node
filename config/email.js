'use strict'
const nodemailer = require('nodemailer'),
    email_template = require('./email_template'),
    responses = require('./responses').responses

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'licoresya2018@gmail.com',
        pass: 'fdizytyybozzhepq'
    }
});

const general_config_email = {
    'from_default': 'soporte@akipartes.com',
    'to_default': 'pruebas@akipartes.com',
    'img_logo': 'images/logo/logo.jpeg'
}

async function sendEmail(to, subject, type_email, data)
{
    var html = await(email_template.getTemplate(type_email, data))
    var mail_options = {
        "from": general_config_email.from_default, 
        "to": to,
        "subject": responses[subject],
        "html": html
    };
    return new Promise ((resolve) => {
        transporter.sendMail(mail_options, function (err, info) {
            if (err) {
                resolve(false)
            } else {
                resolve(true)
            }
        });
    })
}

module.exports.sendEmail = sendEmail
module.exports.general_config_email = general_config_email