'use strict'
const accesstypeuser_model = require('../models/accesstypeuser.js'),
    usertype_model = require('../models/usertype.js'),
    access_model = require('../models/access.js'),
    encryption = require('../config/encryption'),
    general_helper = require('../config/helpers'),
    { checkToken } = require('../config/tokens')

async function createAccesstypeuser(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }

    const data = {
        "actu_acce" : req.body.access,
        "actu_usty" : req.body.usertype,
    }    
    try{
        var result = await(accesstypeuser_model.create(data))
        return 'Tipo de usuario creado correctamente'
    } catch (e) {
        return e.parent.detail
    } 
}


async function updateAccesstypeuser(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    var check_request = await(general_helper.validateParams('accesstypeuser', req))
    if (check_request !== 'Correcto') {
        return check_request
    }

    const accessuser = await access_model.findAll({
        where:{
            acce_user: result_token  
        }
    });
    if (accessuser.length > 0) {    
        const { usertype } = req.body;
        const updateaccesstypeuser = await accesstypeuser_model.findAll({
            where:{
                actu_acce: accessuser[0].acce_ide 
            }
        });
        if (updateaccesstypeuser.length > 0) {    
            return new Promise((resolve) => {
                updateaccesstypeuser.forEach(async accesstypeuser_model =>{
                    var results = ''
                    try {
                        var result = await (accesstypeuser_model.update({
                                                        actu_usty: usertype,
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
            resolve("Acceso no encontrado")
        })
    }
}

async function deleteAccesstypeuser(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    var actu_ide = req.params.actu_ide;
    return new Promise(async(resolve) => {
        try{
            var result = await (accesstypeuser_model.destroy({
                where: {
                    actu_ide
                }
            }));
            if (result === 1) {
                resolve('Tipo de usuario eliminado correctamente')
            } else {
                resolve('Tipo de usuario no encontrado')
            }
        } catch (e) {
            resolve('Hubo errores en la eliminación del Tipo de usuario ')
        }
    })
}

async function listAccesstypeuser(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    return new Promise(async(resolve) => {
        var result = await (accesstypeuser_model.findAll())
        var accesstypeuser = {};
        var count_accesstypeuser = result.length;
        if (count_accesstypeuser > 0) {
            var allaccess = []
            for (var i = 0; i < result.length; i++) {
                accesstypeuser = {};
                accesstypeuser.ide = result[i].actu_ide;
                accesstypeuser.acce = result[i].actu_acce;
                accesstypeuser.usty = result[i].actu_usty;
                allaccess.push(accesstypeuser)
            }
            resolve(allaccess)
        } else {
            resolve('No hay ningún tipo de usuario para mostrar')
        }
        
    })
}

async function getAccesstypeuserById(req, id) 
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    var actu_ide = id;
    return new Promise(async(resolve) => {
        var result = await (accesstypeuser_model.findAll({ where: { actu_ide:  actu_ide } }))
        var count_accesstypeuser = result.length;
        if (count_accesstypeuser > 0) {
            var result_accesstype = {};
            result_accesstype.actu = result[0].actu_ide;
            result_accesstype.access = result[0].actu_acce;
            result_accesstype.usertype = result[0].actu_usty;
            resolve(result_accesstype)
        } else {
            resolve('No hay ningún tipo de asuario para mostrar')
        }
        return result
    })
}


module.exports.createAccesstypeuser = createAccesstypeuser
module.exports.updateAccesstypeuser = updateAccesstypeuser
module.exports.deleteAccesstypeuser = deleteAccesstypeuser
module.exports.listAccesstypeuser = listAccesstypeuser
module.exports.getAccesstypeuserById = getAccesstypeuserById