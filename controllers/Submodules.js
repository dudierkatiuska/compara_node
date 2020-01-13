'use strict'
const submodule_model = require('../models/submodule.js'),
    module_model = require('../models/module.js'),
    encryption = require('../config/encryption'),
    { checkToken } = require('../config/tokens'),
    general_helpers = require('../config/helpers'),
    path = require('path'),
    route_files = path.join(general_helpers.base_url, '/files/images/icons/'),
    route_relative = 'images/icons/',
    file_controller = require('fs')

async function createSubmodule(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    var check_request = await(general_helpers.validateParams('submodule', req))
    if (check_request !== 'Correcto') {
        return check_request
    }


    const data = {
        "sumo_description" : req.body.description,
        "sumo_url" : req.body.url,
        "sumo_icon" : (req.body.icon.includes('data:image/'))?req.body.icon:'',
        "sumo_order" : req.body.order,
        "sumo_modu" : req.body.modu,

    }
    var image = req.body.icon
    if (image !== undefined && image !== '' && image.includes('data:image/')) {
        var ba64 = require('ba64'),
            route_relative_file = '',
            base64Data = image.replace(/^data:image\/(png|gif|jpg)/gi, "data:image/jpeg"),
            name_file = req.body.description,
            route_store = route_files,
            fullname_file = route_store + '' + name_file
            route_relative_file =  route_relative + name_file + '.jpeg'
        ba64.writeImageSync(fullname_file, base64Data)
        data.sumo_icon = route_relative_file
    }
    
    try {
        var result = await(submodule_model.create(data))
        return 'Submódulo creado correctamente'
    } catch (e) {
        try {
            file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + route_relative_file)); 
        } catch (e) {
        }
        return e.parent.detail
    } 
}
async function updateSubmodule(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }

    var check_request = await(general_helpers.validateParams('submodule', req))
    if (check_request !== 'Correcto') {
        return check_request
    }
    var sumo_ide = parseInt(req.params.sumo_ide);
    var { description, url, icon, order, modu} = req.body;
    if (Number.isInteger(sumo_ide) && sumo_ide !== '') {
        const updatesubmodule = await submodule_model.findAll({
            attributes: ['sumo_ide','sumo_description', 'sumo_url','sumo_icon','sumo_order','sumo_modu'],
            where:{
                sumo_ide 
            }
        });
        if (updatesubmodule.length > 0) {
            return new Promise((resolve) => {
                updatesubmodule.forEach(async submodule_model => {
                    var image = icon
                    if (updatesubmodule[0].sumo_icon !== '' && image !== undefined && image !== '' && image.includes('data:image/')) {
                        try {
                            file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + updatesubmodule[0].sumo_icon)); 
                        } catch (e) {
                        }
                    }
                    if (image !== undefined && image !== '' && image.includes('data:image/')) {
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
                        var result = await (submodule_model.update({
                                                    sumo_description: description,
                                                    sumo_url: url,
                                                    sumo_icon: icon,
                                                    sumo_order: order,
                                                    sumo_modu: modu
                                                }));
                        results = 'Submódulo actualizado correctamente';
                    } catch (e) {
                        results = e.parent.detail;
                    }
                    resolve(results)
                })
            })
        } else {
            return new Promise((resolve) => {
                resolve("Submódulo no encontrado")
            })
        }
    } else {
        return new Promise((resolve) => {
            resolve("Submódulo inválido")
        })
    }
}
    

async function deleteSubmodule(req, res)
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
                const updatesubmodule = await submodule_model.findAll({where:{
                        modu_ide 
                    }
                });
                var result = await (submodule_model.destroy({
                    where: {
                        modu_ide
                    }
                }));
                if (result === 1) {
                    if (updatesubmodule[0].sumo_icon !== '') {
                        try {
                            file_controller.unlinkSync(path.join(general_helpers.base_url, '/files/' + updatesubmodule[0].sumo_icon)); 
                        } catch (e) {
                        }
                    }
                    resolve('Submódulo eliminado correctamente')
                } else {
                    resolve('Submódulo no encontrado')
                }
            } catch (e) {
                resolve('Hubo errores en la eliminación del submódulo')
            }
        })
    } else {
        return new Promise((resolve) => {
            resolve("Submódulo inválido")
        })
    }
}
    

async function listSubmodule(req, res) 
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }

    return new Promise(async(resolve) => {
        var result = await (submodule_model.findAll())
        var submodule = {};
        var count_submodule = result.length;
        if (count_submodule > 0) {
            var submodules = []
            for (var i = 0; i < result.length; i++) {
                var result_module = await (module_model.findAll({ where: { sumo_ide: result[i].sumo_modu } }))
                submodule = {};
                submodule.ide = result[i].sumo_ide;
                submodule.description = result[i].sumo_description;
                submodule.url = result[i].sumo_url;
                submodule.icon = result[i].sumo_icon;
                submodule.order = result[i].sumo_order;
                submodule.modu = result[i].sumo_modu;
                submodule.module = {};
                submodule.module.description = result_module[0].modu_description;
                submodules.push(submodule)
            }
            resolve(submodules)
        } else {
            resolve('No hay ningún submódulo para mostrar')
        }   
    })
}


async function getSubmoduleById(req, id) 
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }
    var sumo_ide = parseInt(id);
    if (Number.isInteger(sumo_ide) && sumo_ide !== '') {
        return new Promise(async(resolve) => {
            var result = await (submodule_model.findAll({ where: { sumo_ide:  sumo_ide } }))
            var count_submodule = result.length;
            if (count_submodule > 0) {
                var result_submodule = {};
                result_submodule.ide = result[0].sumo_ide;
                result_submodule.description = result[0].sumo_description;
                result_submodule.url = result[0].sumo_url;
                result_submodule.icon = result[0].sumo_icon;
                result_submodule.order = result[0].sumo_order;
                result_submodule.modu = result[0].sumo_modu;
                resolve(result_submodule)
            } else {
                resolve('No hay ningún submódulo para mostrar')
            }
            return result
        })
    } else {
        return new Promise((resolve) => {
            resolve("Submódulo inválido")
        })
    }
}

module.exports.createSubmodule = createSubmodule
module.exports.updateSubmodule = updateSubmodule
module.exports.deleteSubmodule = deleteSubmodule
module.exports.listSubmodule = listSubmodule
module.exports.getSubmoduleById = getSubmoduleById
