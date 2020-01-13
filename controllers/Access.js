'use strict'
const access_model = require('../models/access.js'),
    access_type_user_model = require('../models/accesstypeuser'),
    general_helper = require('../config/helpers'),
    user_model = require('../models/user.js'),
    token_model = require('../models/token.js'),
    token_expiration_model = require('../models/tokenexpiration'),
    jwt = require('jsonwebtoken'),
    encryption = require('../config/encryption'),
    { checkToken } = require('../config/tokens'),
    Op = require('../config/config').op,
    regex_password =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_\-])[A-Za-z\d$@$!%*?&#.$($)$-$_\-]{6,8}$/,
    regex_email = /^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/


async function createAccess(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }

    const data = {
        "acce_username" : req.body.username,
        "acce_password" : await(encryption.encryptPasswords(req.body.password)),
        "acce_user" : req.body.user,
        "acce_status" : req.body.status,
    }
    try {
        var result_username = await access_model.findAll({
            attributes: ['acce_ide','acce_username', 'acce_password','acce_user', 'acce_status'],
            where:{
               acce_username: req.body.username
            }
        });
        var count_access = result_username.length;
        if (count_access > 0) {
            return 'El username ya está siendo usado'
        } else {
            if (data.acce_password.match(regex_password)) {
                var result = await(access_model.create(data))
            } else {
                return 'La contraseña debe contener mínimo 6 caracteres, al menos 1 letra mayúscula, 1 letra minúscula, 1 número y 1 caracter especial'
            }
        }
        return 'Se creó el acceso correctamente'
    } catch (e) {
        return e.parent.detail
    }   
}

async function updateAccess(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    
    var acce_ide = req.params.acce_ide;
    const { username, password, user, moderator, status} = req.body;
    const updateaccess = await access_model.findAll({
        attributes: ['acce_ide','acce_username', 'acce_password','acce_user','acce_status'],
        where:{
           acce_ide 
        }
    });
    var result_username = await access_model.findAll({
        attributes: ['acce_ide'],
        where:{
            acce_username: username,
            acce_ide: {[Op.ne]: acce_ide}
        }
    })
    var count_access = result_username.length;
    if (count_access > 0) {
        return 'El username ya está siendo usado'
    }
    if (updateaccess.length > 0) {
        return new Promise((resolve) => {
            updateaccess.forEach(async access_model => {
                var results = ''
                try {
                    if (password.match(regex_password)) {
                        var result = await (access_model.update({
                                acce_username: username,
                                acce_password: await(encryption.encryptPasswords(password)),
                                acce_user: user,
                                acce_status: status
                        }));
                        results = 'Se actualizó el acceso correctamente';
                    } else {
                        return 'La contraseña debe contener mínimo 6 caracteres, al menos 1 letra mayúscula, 1 letra minúscula, 1 número y 1 caracter especial'
                    }
                } catch (e) {
                    results = e.parent.detail;
                }
                resolve(results)
            })
        })
    } else {
        return new Promise((resolve) => {
            resolve("Acceso no encontrado")
        })
    }
}

async function deleteAccess(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    var acce_ide = req.params.acce_ide;
    return new Promise(async(resolve) => {
        try{
            var result = await (access_model.destroy({
                where: {
                    acce_ide
                }
            }));
            if (result === 1) {
                resolve('Se eliminó el acceso correctamente')
            } else {
                resolve('Acceso no encontrado')
            }
        } catch (e) {
            resolve('Hubo errores en la eliminación del acceso')
        }
    })
}

async function listAccess(req, res) 
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    
    return new Promise(async(resolve) => {
        var result = await (access_model.findAll())
        var access = {};
        var count_access = result.length;
        if (count_access > 0) {
            var allaccess = []
            for (var i = 0; i < result.length; i++) {
                var result_user = await (user_model.findAll({ where: { user_ide: result[i].acce_user } }))
                access = {};
                access.ide = result[i].acce_ide;
                access.username = result[i].acce_username;
                access.user = result[i].acce_user;
                access.status = result[i].acce_status;
                access.user = {};
                access.user.name = result_user[0].user_name;
                allaccess.push(access)
            }
            resolve(allaccess)
        } else {
            resolve('No hay ningún acceso para mostrar')
        }   
    })
}

async function getAccessById(req, id) 
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    var acce_ide = id;
    return new Promise(async(resolve) => {
        var result = await (access_model.findAll({ where: { acce_ide:  acce_ide } }))
        var count_access = result.length;
        if (count_access > 0) {
            var result_access = {};
            result_access.ide = result[0].acce_ide;
            result_access.username = result[0].acce_username;
            result_access.user = result[0].acce_user;
            result_access.status = result[0].acce_status;
            resolve(result_access)
        } else {
            resolve('No hay ningún acceso para mostrar')
        }
        return result
    })
}

async function getAccessByUserId(req) 
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    var acce_user = result_token;
    return new Promise(async(resolve) => {
        var result = await (access_model.findAll({ where: { acce_user:  acce_user } }))
        var count_access = result.length;
        if (count_access > 0) {
            var result_access = {};
            result_access.username = result[0].acce_username;
            result_access.moderator = result[0].acce_moderator;
            result_access.status = result[0].acce_status;
            resolve(result_access)
        } else {
            resolve('No hay ningún acceso para mostrar')
        }
        return result
    })
}
async function login(req, res)
{
    var user_email = req.body.email,
        acce_password = req.body.password,
        band_email = false,
        user_id = 0

    var check_request = await(general_helper.validateParams('login', req))
    if (check_request !== 'Correcto') {
        return check_request
    }

    return new Promise(async(resolve) => {
        var email = user_email
        var result_user = await (user_model.findAll({}))
        if (result_user.length > 0) {
            for (var i in result_user) {
                if (result_user[i].user_email === email) {
                    band_email = true
                    user_id = i
                }
            }
            if (band_email === true) {
                var result_access = await (access_model.findAll({ where: { acce_user: result_user[user_id].user_ide } }))
            }
        } else {
            resolve('El usuario o la contraseña son incorrectos')
        }
        if (result_user && result_access) {
            if (result_user[user_id].user_ide !== result_access[0].acce_user || await(encryption.comparePasswords(acce_password, result_access[0].acce_password)) === false) {
                resolve('El usuario o la contraseña son incorrectos')
            }
            var id = {id: result_access[0].acce_user}
            var token = jwt.sign(id, 'Akipartes2019', {
                expiresIn: (((2 * 60) * 60) * 1000)
            })
            var result_access_type_user = await (access_type_user_model.findAll({ where: { actu_acce: result_access[0].acce_ide } }))
            var result = {
                "token": token,
                "name": result_user[user_id].user_name,
                "type_user" :result_access_type_user[0].actu_usty
            }
            var result_token = await (token_model.findAll({ where: { toke_user: result_access[0].acce_user } }))
            if (result_token.length > 0) {
                result_token.forEach(async token_model => {
                    var results = ''
                    try {
                        var result_token_update = await (token_model.update({
                                    toke_description: token,
                        }));
                        resolve(result);
                    } catch (e) {
                        results = e.parent.detail;
                        resolve(results);
                    }
                })
            } else {
                const _data = {
                    "toke_description" : token,
                    "toke_user" : result_access[0].acce_user,
                }
                var result_create_token = await(token_model.create(_data))
                resolve(result);
            }
            
        } else {
            resolve('El usuario o la contraseña son incorrectos')
        }
    })
}

async function logout(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    const data = {
        "toex_user" : result_token,
        "toex_token" : token,
    }
    try {
        var result = await(token_expiration_model.create(data))
        return 'Has cerrado sesión satisfactoriamente'
    } catch (e) {
        return e.parent.detail
    } 
}

async function register(req, res)
{
    var user_email = req.body.email,
        user_name = req.body.name,
        user_city = req.body.city,
        acce_password = req.body.password,
        type_user = req.body.type_user,
        date = new Date(),
        date_reg = (date.getMonth() +1) + "/" + date.getDate() + "/" + date.getFullYear()
    
    var check_request = await(general_helper.validateParams('register', req))
    if (check_request !== 'Correcto') {
        return check_request
    }

    const data = {
        "user_name" : user_name,
        "user_email" : user_email,
        "user_birthdate" : date_reg,
        "user_aboutme" : '',
        "user_avatar" : '',
        "user_city" : user_city,
        "user_mobile" : '',
        "user_dtregister" : date_reg,
        "user_dtactivation" : date_reg
    }
        
    var result_user = await(user_model.create(data))
    if (result_user !== null) {
        var username = await(encryption.generateStringRand(10))
        const data = {
            "acce_username" : username,
            "acce_password" : await(encryption.encryptPasswords(acce_password)),
            "acce_user" : result_user.user_ide, 
            "acce_status" : 1,
        }
        var result_access = await(access_model.create(data))
        if (result_access !== null) {
            var __data = {
                "actu_acce" : result_access.acce_ide,
                "actu_usty" : 1
            }
            if (type_user == 2) {
                __data.actu_usty = 2
            }
                var result_access_type_user = await(access_type_user_model.create(__data))
                if (result_access_type_user !== null) {
                    return 'Usuario creado correctamente';
                } else {
                    var result_destroy_user = await (user_model.destroy({
                        where: {
                            user_ide : result_user.user_ide
                        }
                    }));
                    var result_destroy_access = await (access_model.destroy({
                        where: {
                            acce_ide : result_access.acce_ide
                        }
                    }));
                    return 'Error al registrar el usuario';
                }
            } else {
            var result_destroy_user = await (user_model.destroy({
                where: {
                    user_ide : result_user.user_ide
                }
            }));
            return 'Error al registrar el usuario'; 
        }
    }
}

async function check(req)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    return result_token
}

async function recoverPassword(req, res)
{
    var user_email = req.body.email
    
    var check_request = await(general_helper.validateParams('recover_password', req))
    if (check_request !== 'Correcto') {
        return check_request
    }
    var new_password = await(encryption.generateRandomPass())
    var result_user = await (user_model.findAll({where: {user_email}}))
    if (result_user != null) {
        var result_access = await (access_model.findAll({where: { acce_user: result_user[0].user_ide}}))
        if (result_access != null) {
            return new Promise((resolve) => {
                result_access.forEach(async access_model => {
                    var results = ''
                    try {
                        var result = await (access_model.update({
                                acce_password: new_password.hashed
                        }));
                        results = 'Nueva contraseña generada correctamente' + new_password.plain
                    } catch (e) {
                        results = e.parent.detail;
                    }
                    resolve(results)
                })
            })
        }
    }

}


module.exports.createAccess = createAccess
module.exports.updateAccess = updateAccess
module.exports.deleteAccess = deleteAccess
module.exports.listAccess = listAccess
module.exports.getAccessById = getAccessById
module.exports.getAccessByUserId = getAccessByUserId
module.exports.login = login
module.exports.logout = logout
module.exports.register = register
module.exports.check = check
module.exports.recoverPassword = recoverPassword
