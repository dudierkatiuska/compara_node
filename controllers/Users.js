'use strict'
const {sequelize} = require('../config/config.js'),
    path = require('path'),
    access_model = require('../models/access.js'),
    user_model = require('../models/user.js'),
    access_type_user_model = require('../models/accesstypeuser'),
    encryption = require('../config/encryption'),
    { checkToken } = require('../config/tokens'),
    general_helpers = require('../config/helpers'),
    route_files = path.join(general_helpers.base_url, '/files/images/profile/'),
    route_relative = 'images/profile/',
    file_controller = require('fs'),
    Op = require('../config/config').op,
    regex_password =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_])[A-Za-z\d$@$!%*?&#.$($)$-$_]{8,15}$/,
    regex_email = /^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/
    

async function createUser(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }

    var check_request = await(general_helpers.validateParams('user', req))
    if (check_request !== 'Correcto') {
        return check_request
    }

    var user_email = req.body.email
    const data = {
        "user_name" : req.body.name,
        "user_email" : req.body.email,
        "user_birthdate" : req.body.birthdate,
        "user_aboutme" : req.body.aboutme,
        "user_avatar" : (req.body.avatar.includes('data:image/'))?req.body.avatar:'',
        "user_mobile" : req.body.mobile,
        "user_dtregister" : new Date(),
        "user_dtactivation" : new Date(),
        "user_city" : req.body.city
    }
    var avatar = req.body.avatar
    if (avatar !== undefined && avatar !== '' && avatar.includes('data:image/')) {
        var ba64 = require('ba64'),
            route_relative_file = '',
            base64Data = avatar.replace(/^data:image\/(png|gif|jpg)/gi, "data:image/jpeg"),
            name_file = Math.random().toString(36).replace(/[^a-z]+/g, ''),
            route_store = route_files,
            fullname_file = route_store + '' + name_file
            route_relative_file =  route_relative + name_file + '.jpeg'
        ba64.writeImageSync(fullname_file, base64Data)
        data.user_avatar = route_relative_file
    }

    var result_user = await(user_model.create(data))
    if (result_user !== null) {
        var username = req.body.username

        const _data = {
            "acce_username" : username,
            "acce_password" : await(encryption.encryptPasswords(req.body.password)),
            "acce_user" : result_user.user_ide,
            "acce_status" : 1,
        }

        var result_access = await(access_model.create(_data))
        if (result_access !== null) {
            const __data = {
                "actu_acce" : result_access.acce_ide,
                "actu_usty" : 1
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
                try {
                    file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + route_relative_file)); 
                } catch (e) {
                }
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
            try {
                file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + route_relative_file)); 
            } catch (e) {
            }
            return 'Error al registrar el usuario'; 
        }
    }
}


async function updateUser(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }

    var check_request = await(general_helpers.validateParams('userupdate', req))
    if (check_request !== 'Correcto') {
        return check_request
    }

    var user_ide = result_token;
    const {  name, email, birthdate, aboutme, avatar, mobile, dtregister, dtactivation, city, username, password } = req.body;
    const updateuser = await user_model.findAll({
        attributes: ['user_ide','user_name', 'user_email', 'user_birthdate', 'user_aboutme','user_avatar','user_mobile', 'user_dtregister', 'user_dtactivation', 'user_city'],
        where:{
           user_ide 
        }
    });
    if (updateuser.length > 0) {
        const updateuser_access = await access_model.findAll({
            attributes: ['acce_ide','acce_username', 'acce_password', 'acce_user','acce_status'],
            where:{
                "acce_user": updateuser[0].user_ide 
            }
        });
        if (updateuser.length > 0 && updateuser_access.length > 0) {
            return new Promise((resolve) => {
                updateuser.forEach(async user_model => {
                    var results = ''
                    try {
                        if (updateuser[0].user_avatar !== '' && avatar !== undefined && avatar !== '') {
                            try {
                                file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + updateuser[0].user_avatar)); 
                            } catch (e) {
                            }
                        }
                        if (avatar !== undefined && avatar !== '' && avatar.includes('data:image/')) {
                            var ba64 = require('ba64'),
                                route_relative_file = '',
                                base64Data = avatar.replace(/^data:image\/(png|gif|jpg)/gi, "data:image/jpeg"),
                                name_file = Math.random().toString(36).replace(/[^a-z]+/g, ''),
                                route_store = route_files,
                                fullname_file = route_store + '' + name_file
                                route_relative_file =  route_relative + name_file + '.jpeg'
                            ba64.writeImageSync(fullname_file, base64Data)
                        }
                        const _data = {}
                        if (name !== undefined && name !== '') {
                            _data['user_name'] = name
                        }
                        if (email !== undefined && email !== '') {
                            _data['user_email'] = email
                        }
                        if (birthdate !== null && birthdate !== '') {
                            _data['user_birthdate'] = birthdate
                        }
                        if (aboutme !== undefined && aboutme !== '') {
                            _data['user_aboutme'] = aboutme
                        }
                        if (avatar !== undefined && avatar !== '') {
                            _data['user_avatar'] = route_relative_file
                        }
                        if (mobile !== undefined && mobile !== '') {
                            _data['user_mobile'] = mobile
                        }
                        if (dtregister !== undefined && dtregister !== '') {
                            _data['user_dtregister'] = dtregister
                        }
                        if (dtactivation !== undefined && dtactivation !== '') {
                            _data['user_dtactivation'] = dtactivation
                        }
                        if (city !== undefined && city !== '') {
                            _data['user_city'] = city
                        }
                        var result_user = await (user_model.update(_data));
                        updateuser_access.forEach(async access_model => {
                            try {
                                const __data = {}
                                if (username !== null && username !== '') {
                                    __data['acce_username'] = username
                                }
                                if (password !== null && password !== '') {
                                    __data['acce_password'] = await(encryption.encryptPasswords(password))
                                }
                                if ((username !== null && username !== '') || (password !== null && password !== '')) {
                                    var result_access = await (access_model.update(__data));
                                }
                                results = 'Usuario actualizado correctamente';
                                resolve(results)
                            } catch (e) {
                                results = e.parent.detail;
                                resolve(results)
                            }
                        })
                    } catch (e) {
                        results = e.parent.detail;
                        resolve(results)
                    }
                })
            })
        } else {
            return new Promise((resolve) => {
                resolve("Usuario no encontrado")
            })
        }
    } else {
        return 'Usuario no encontrado'
    }
}


async function deleteUser(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }

    var user_ide = parseInt(req.params.user_ide);
    if (Number.isInteger(user_ide) && user_ide !== '') {
        return new Promise(async(resolve) => {
            try {
                var updateuser = await (user_model.findAll({where: user_ide}));
                var getaccess = await (access_model.findAll({where: {acce_user: user_ide}}));
                var result_access_type_user = await (access_type_user_model.destroy({
                    where: {
                        actu_acce: getaccess[0].acce_ide
                    }
                }));
                var result_access = await (access_model.destroy({
                    where: {
                        acce_user: user_ide
                    }
                }));
                var result_user = await (user_model.destroy({
                    where: {
                        user_ide
                    }
                }));
                
                if (result_user === 1 && result_access === 1) {
                    if (updateuser[0].user_avatar !== '') {
                        try {
                            file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + updateuser[0].user_avatar)); 
                        } catch (e) {
                        }
                    }
                    resolve('Usuario eliminado correctamente')
                } else {
                    resolve('Usuario no encontrado')
                }
            } catch (e) {
                console.log(e)
                resolve('Hubo errores en la eliminación del usuario')
            }
        })
    } else {
        return new Promise(async(resolve) => {
            resolve('Usuario inválido')
        })
    }
}

async function listUser(req, res) 
{
    // var token = req.headers.authentication
    // var result_token = await(checkToken(token))
    // if (result_token == 'Token inválido') {
    //     return result_token
    // } 
    return new Promise(async(resolve) => {
        var result = await (user_model.findAll())
        var user = {};
        var count_users = result.length;
        if (count_users > 0) {
            var users = []
            for (var i = 0; i < result.length; i++) {
                user = {};
                user.name = result[i].user_name;
                user.email = result[i].user_email;
                user.birthdate = result[i].user_birthdate;
                user.aboutme = result[i].user_aboutme;
                user.avatar = result[i].user_avatar;
                user.city = result[i].user_city;
                user.dtregister = result[i].user_dtregister;
                user.dtactivation = result[i].user_dtactivation;
                var result_access = await (access_model.findAll({ where: { acce_user:  result[0].user_ide } }))
                user.access = {}
                user.access.username = result_access[0].acce_username;
                users.push(user)
            }
            resolve(users)
        } else {
            resolve('No hay ningún usuario para mostrar')
        }   
    })
}

async function getUserById(req, id) 
{
    // var token = req.headers.authentication
    // var result_token = await(checkToken(token))
    // if (result_token == 'Token inválido') {
    //     return result_token
    // }
    var user_ide = parseInt(id);
    if (Number.isInteger(user_ide) && user_ide !== '') {
        return new Promise(async(resolve) => {
            var result = await (user_model.findAll({ where: { user_ide:  user_ide } }))
            var count_user = result.length;
            if (count_user > 0) {
                var result_user = {};
                result_user.name = result[0].user_name;
                result_user.email = result[0].user_email;
                result_user.birthdate = result[0].user_birthdate;
                result_user.aboutme = result[0].user_aboutme;
                result_user.avatar = result[0].user_avatar;
                result_user.dtregister = result[0].user_dtregister;
                result_user.dtactivation = result[0].user_dtactivation;
                result_user.city = result[0].user_city;
                var result_access = await (access_model.findAll({ where: { acce_user:  result[0].user_ide } }))
                result_user.access = {}
                result_user.access.username = result_access[0].acce_username;
                resolve(result_user)
            } else {
                resolve('No hay ningún usuario para mostrar')
            }
            return result
        })
    } else {
        return new Promise(async(resolve) => {
            resolve('Usuario inválido')
        })
    }
}

async function getUserByToken(req) 
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    return new Promise(async(resolve) => {
        var result = await (user_model.findAll({ where: { user_ide:  result_token } }))
        var count_user = result.length;
        if (count_user > 0) {
            var result_user = {};
            result_user.name = result[0].user_name;
            result_user.email = result[0].user_email;
            result_user.birthdate = result[0].user_birthdate;
            result_user.aboutme = result[0].user_aboutme;
            result_user.avatar = result[0].user_avatar;
            result_user.dtregister = result[0].user_dtregister;
            result_user.dtactivation = result[0].user_dtactivation;
            result_user.city = result[0].user_city;
            var result_access = await (access_model.findAll({ where: { acce_user:  result[0].user_ide } }))
            result_user.access = {}
            result_user.access.username = result_access[0].acce_username;
            resolve(result_user)
        } else {
            resolve('No hay ningún usuario para mostrar')
        }
    })
}

module.exports.createUser = createUser
module.exports.updateUser = updateUser
module.exports.deleteUser = deleteUser
module.exports.listUser = listUser
module.exports.getUserById = getUserById
module.exports.getUserByToken = getUserByToken
