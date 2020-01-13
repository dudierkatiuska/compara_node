'use strict'
const jwt = require('jsonwebtoken'),
    token_expiration_model = require('../models/tokenexpiration')

async function checkToken(token)
{
    return new Promise((resolve) => {
        var result = ''
        jwt.verify(token, 'Akipartes2019', async function(err, user) {
            if (err) {
                resolve('Token inválido')
            } else if (user !== undefined) {
                var result_token = await (token_expiration_model.findAll({
                    where:{
                        toex_token: token,
                    }
                }))
                if (result_token != undefined) {
                    if (result_token.length > 0) {
                        resolve('Token inválido')
                    } else if (result_token.length == 0) {
                        resolve(user.id)
                    }
                } else {
                    resolve('Token inválido')
                }
            }
        })
    })
        
}

module.exports.checkToken = checkToken
