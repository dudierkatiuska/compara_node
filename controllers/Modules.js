'use strict'
const module_model = require('../models/module.js'),
    encryption = require('../config/encryption'),
    { checkToken } = require('../config/tokens'),
    general_helpers = require('../config/helpers'),
    path = require('path'),
    route_files = path.join(general_helpers.base_url, '/files/images/icons/'),
    route_relative = 'images/icons/',
    file_controller = require('fs')

async function createModule(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }

    var check_request = await(general_helpers.validateParams('module', req))
    if (check_request !== 'Correcto') {
        return check_request
    }

    const data = {
        "modu_description" : encryption.encrypt(req.body.description),
        "modu_visibility" : req.body.visibility,
        "modu_icon" : (req.body.icon.includes('data:image/'))?encryption.encrypt(req.body.icon):'',

    }
    var image = req.body.icon
    if (image !== undefined && image !== '' && image.includes('data:image/')) {
        var ba64 = require('ba64'),
            route_relative_file = '',
            base64Data = image.replace(/^data:image\/(png|gif|jpg)/gi, "data:image/jpeg"),
            name_file = encryption.encrypt(req.body.description),
            route_store = route_files,
            fullname_file = route_store + '' + name_file
            route_relative_file =  route_relative + name_file + '.jpeg'
        ba64.writeImageSync(fullname_file, base64Data)
        data.modu_icon = encryption.encrypt(route_relative_file)
    }
    
    try {
        var result = await(module_model.create(data))
        return 'Módulo creado correctamente'
    } catch (e) {
        try {
            file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + route_relative_file)); 
        } catch (e) {
        }
        return e.parent.detail
    } 
}

async function updateModule(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }

    var check_request = await(general_helpers.validateParams('module', req))
    if (check_request !== 'Correcto') {
        return check_request
    }

    var modu_ide = parseInt(req.params.modu_ide);
    var { description, visibility, icon} = req.body;
    if (Number.isInteger(modu_ide) && modu_ide !== '') {
        const updatemodule = await module_model.findAll({
            attributes: ['modu_ide','modu_description', 'modu_visibility','modu_icon'],
            where:{
                modu_ide 
            }
        });
        if (updatemodule.length > 0) {
            return new Promise((resolve) => {
                updatemodule.forEach(async module_model => {
                    var image = icon
                    if (updatemodule[0].modu_icon !== '' && image !== undefined && image !== '' && image.includes('data:image/')) {
                        try {
                            file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + encryption.decrypt(updatemodule[0].modu_icon))); 
                        } catch (e) {
                        }
                    }
                    if (image != undefined && image !== '' && image.includes('data:image/')) {
                        var ba64 = require('ba64'),
                            route_relative_file = '',
                            base64Data = image.replace(/^data:image\/(png|gif|jpg)/gi, "data:image/jpeg"),
                            name_file = Math.random().toString(36).replace(/[^a-z]+/g, ''),
                            route_store = route_files,
                            fullname_file = route_store + '' + name_file
                            route_relative_file =  route_relative + name_file + '.jpeg'
                        ba64.writeImageSync(fullname_file, base64Data)
                        icon = route_relative_file
                    }
                    var results = ''
                    try {
                        var result = await (module_model.update({
                                                        modu_description: encryption.encrypt(description),
                                                        modu_visibility: visibility,
                                                        modu_icon: encryption.encrypt(icon)
                                                }));
                        results = 'Módulo actualizado correctamente';
                    } catch (e) {
                        results = e.parent.detail;
                    }
                    resolve(results)
                })
            })
        } else {
            return new Promise((resolve) => {
                resolve("Módulo no encontrado")
            })
        }
    } else {
        return new Promise((resolve) => {
            resolve("Módulo inválido")
        })
    }
}
    
async function deleteModule(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    
    var modu_ide = parseInt(req.params.modu_ide);
    if (Number.isInteger(modu_ide) && modu_ide !== '') {
        return new Promise(async(resolve) => {
            try{
                const updatemodule = await module_model.findAll({where:{
                        modu_ide 
                    }
                });
                var result = await (module_model.destroy({
                    where: {
                        modu_ide
                    }
                }));
                if (result === 1) {
                    if (updatemodule[0].modu_icon !== '') {
                        try {
                            file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + encryption.decrypt(updatemodule[0].modu_icon))); 
                        } catch (e) {
                        }
                    }
                    resolve('Módulo eliminado correctamente')
                } else {
                    resolve('Módulo no encontrado')
                }
            } catch (e) {
                resolve('Hubo errores en la eliminación del módulo')
            }
        })
    } else {
        return new Promise((resolve) => {
            resolve("Módulo inválido")
        })
    }
}

async function listModule(req, res) 
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    return new Promise(async(resolve) => {
        var result = await(module_model.findAll())
        var count_module = result.length;
        var module_object = {};
        if (count_module > 0) {
            var modules = []
            for (var i = 0; i < result.length; i++) {
                module_object = {};
                module_object.ide = result[i].modu_ide;
                module_object.description = encryption.decrypt(result[i].modu_description);
                module_object.visibility = result[i].modu_visibility;
                module_object.icon = encryption.decrypt(result[i].modu_icon);
                modules.push(module_object)
            }
            resolve(modules)
        } else {
            resolve('No hay ningún módulo para mostrar')
        }
    });
}


async function getModuleById(req, id) 
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    var modu_ide = parseInt(id);
    if (Number.isInteger(modu_ide) && modu_ide !== '') {
        return new Promise(async(resolve) => {
            var result = await (module_model.findAll({ where: { modu_ide:  modu_ide } }))
            var count_module = result.length;
            if (count_module > 0) {
                var result_module = {};
                result_module.ide = result[0].modu_ide;
                result_module.description = encryption.decrypt(result[0].modu_description);
                result_module.visibility = result[0].modu_visibility
                result_module.icon = encryption.decrypt(result[0].modu_icon);
                resolve(result_module)
            } else {
                resolve('No hay ningún módulo para mostrar')
            }
            return result
        })
    } else {
        return new Promise((resolve) => {
            resolve("Módulo inválido")
        })
    }
}

module.exports.createModule = createModule
module.exports.updateModule = updateModule
module.exports.deleteModule = deleteModule
module.exports.listModule = listModule
module.exports.getModuleById = getModuleById