'use strict'
const usertype_model = require('../models/usertype.js'),
    general_helper = require('../config/helpers'),
    encryption = require('../config/encryption'),
    { checkToken } = require('../config/tokens')

async function createUsertype(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }

    var check_request = await(general_helper.validateParams('usertype', req))
    if (check_request !== 'Correcto') {
        return check_request
    }

    const data = {
        "usty_description" : encryption.encrypt(req.body.description),
        "usty_status" : req.body.status,
    }
    try {
        var result = await(usertype_model.create(data))
        return 'Tipo de usuario creado correctamente'
    } catch (e) {
        return e.parent.detail
    }
}

async function updateUsertype(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }

    var check_request = await(general_helper.validateParams('usertype', req))
    if (check_request !== 'Correcto') {
        return check_request
    }

    var usty_ide = parseInt(req.params.usty_ide)
    if (Number.isInteger(usty_ide) && usty_ide != '') {
        const { description, status} = req.body;
        const updateusertype = await usertype_model.findAll({
            attributes: ['usty_ide','usty_description', 'usty_status'],
            where:{
                usty_ide 
            }
        });
        if(updateusertype.length > 0){
            return new Promise((resolve) => {
                updateusertype.forEach(async usertype_model => {
                    var results = ''
                    try {
                        var result = await (usertype_model.update({
                                                        usty_description: encryption.encrypt(description),
                                                        usty_status: (status == true || status == 1)?'1':'0'
                                                }));
                        results = 'Tipo de usuario actualizado correctamente';
                    } catch (e) {
                        results = e.parent.detail;
                    }
                    resolve(results)
                })
            })
        } else {
            return new Promise((resolve) => {
                resolve("Tipo de usuario no encontrado")
            })
        }
    } else {
        return new Promise((resolve) => {
            resolve("Tipo de usuario inválido")
        })
    }
}

async function deleteUsertype(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    
    var usty_ide = parseInt(req.params.usty_ide);
    if (Number.isInteger(usty_ide) && usty_ide != '') {
        return new Promise(async(resolve) => {
            try {
                var result = await (usertype_model.destroy({
                    where: {
                        usty_ide
                    }
                }));
                if (result === 1) {
                    resolve('Tipo de usuario eliminado correctamente')
                } else {
                    resolve('Tipo de usuario no encontrado')
                }
            } catch (e) {
                resolve('Hubo errores en la eliminación del tipo de usuario')
            }
        })
    } else {
        return new Promise((resolve) => {
            resolve("Tipo de usuario inválido")
        })
    }
}

async function listUsertype(req, res) 
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    return new Promise(async(resolve) => {
        var result = await(usertype_model.findAll())
        var count_usertype = result.length;
        var usertype = {};
        if (count_usertype > 0) {
            var usertypes = []
            for (var i = 0; i < result.length; i++) {
                usertype = {};
                usertype.ide = result[i].usty_ide;
                usertype.description = result[i].usty_description;
                usertype.status = result[i].usty_status;
                usertypes.push(usertype)
            }
            resolve(usertypes)
        } else {
            resolve('No hay ningún tipo de usuario para mostrar')
        }
    });
}


async function getUsertypeById(req, id) 
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    var usty_ide = parseInt(id);
    if (Number.isInteger(usty_ide) && usty_ide !== '') {
        return new Promise(async(resolve) => {
            var result = await (usertype_model.findAll({ where: { usty_ide:  usty_ide } }))
            var count_usertype = result.length;
            if (count_usertype > 0) {
                var result_usertype = {};
                result_usertype.ide = result[0].usty_ide;
                result_usertype.description = result[0].usty_description;
                result_usertype.status = result[0].usty_status;
                resolve(result_usertype)
            } else {
                resolve('No hay ningún tipo de usuario para mostrar')
            }
            return result
        })
    } else {
        return new Promise((resolve) => {
            resolve("Tipo de usuario inválido")
        })
    }
}


module.exports.createUsertype = createUsertype
module.exports.updateUsertype = updateUsertype
module.exports.deleteUsertype = deleteUsertype
module.exports.listUsertype = listUsertype
module.exports.getUsertypeById = getUsertypeById