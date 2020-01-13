'use strict'
const crypto = require('crypto'),
    bcrypt = require('bcrypt'),
    algorithm = 'aes-256-ctr',
    new_algorithm = 'aes-256-cbc',
    application_pass = 'G01my2019',
    salt_rounds = 10,
    characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-."

//Permite encriptar un texto
function encrypt(text)
{
    let cipher = crypto.createCipher(algorithm, application_pass)
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return crypted
}
//Permite desencriptar un texto
function decrypt(hash)
{
    hash = hash.trim()
    let decipher = crypto.createDecipher(algorithm, application_pass)
    let dec = decipher.update(hash, 'hex', 'utf8')
    dec += decipher.final('utf8')
    return dec
}

//Permite generar un hash de las contraseñas
async function encryptPasswords(pass)
{
    return new Promise ((resolve) => {
        bcrypt.hash(pass, salt_rounds, function(err, hash) {
            resolve(hash)
        });
    })
    
}
//Permite comparar el texto plano de las contraseñas y el hash almacenado
async function comparePasswords(plain, hash)
{
    return new Promise((resolve) => {
        bcrypt.compare(plain, hash, function(err, res) {
            resolve(res)
        });
    })
}

async function generateRandomCode()
{
    return Math.random().toString(36).substring(0, 10)
}

async function generateStringRand(length)
{
    var pass = "";
    for (var i = 0; i < length; i++){
        pass += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return pass;
}

async function generateRandomPass()
{
    var new_password = await(generateStringRand(15)),
        pass_hashed = await(encryptPasswords(new_password)),
        data = []
    data.plain = new_password
    data.hashed = pass_hashed
    return data;
}

module.exports.encrypt = encrypt
module.exports.decrypt = decrypt
module.exports.encryptPasswords = encryptPasswords
module.exports.comparePasswords = comparePasswords
module.exports.generateRandomCode = generateRandomCode
module.exports.generateStringRand = generateStringRand
module.exports.generateRandomPass = generateRandomPass