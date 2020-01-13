'use strict'
const city_model = require('../models/city.js'),
    { checkToken } = require('../config/tokens'),
    general_helper = require('../config/helpers'),
    encryption = require('../config/encryption')


async function createCity(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }

    var check_request = await(general_helper.validateParams('city', req))
    if (check_request !== 'Correcto') {
        return check_request
    }

    const data = {
        "city_description" : req.body.description,
        "city_status" : req.body.status,
    }
    try {
        var result = await(city_model.create(data))
        return 'Ciudad creada correctamente'
    } catch (e) {
        return e.parent.detail
    } 
}


async function updateCity(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }

    var check_request = await(general_helper.validateParams('city', req))
    if (check_request !== 'Correcto') {
        return check_request
    }

    var city_ide = parseInt(req.params.city_ide);
    if (Number.isInteger(city_ide) && city_ide !== '') {
        const { description, status} = req.body;
        const updatecity = await city_model.findAll({
            attributes: ['city_ide', 'city_description', 'city_status'],
            where:{
            city_ide 
            }
        });
        if(updatecity.length > 0){
            return new Promise((resolve) => {
                updatecity.forEach(async city_model => {
                    var results = ''
                    try {
                        var result = await (city_model.update({
                                                        city_description: description,
                                                        city_status: status
                                                }));
                        results = 'Ciudad actualizada correctamente';
                    } catch (e) {
                        results = e.parent.detail;
                    }
                    resolve(results)
                })
            })
        } else {
            return new Promise((resolve) => {
                resolve("Ciudad no encontrada")
            })
        }
    } else {
        return new Promise((resolve) => {
            resolve("Ciudad inválida")
        })
    }
}


async function deleteCity(req, res)
{
    var token = req.headers.authentication
    var result_token = await(checkToken(token))
    if (result_token === 'Token inválido') {
        return result_token
    }

    var city_ide = parseInt(req.params.city_ide);
    if (Number.isInteger(city_ide) && city_ide !== '') {
        return new Promise(async(resolve) => {
            try{
                var result = await (city_model.destroy({
                    where: {
                        city_ide
                    }
                }));
                if (result == 1) {
                    resolve('Ciudad eliminada correctamente')
                } else {
                    resolve('Ciudad no encontrada')
                }
            } catch (e) {
                resolve('Hubo errores en la eliminación de la ciudad')
            }
        })
    } else {
        return new Promise((resolve) => {
            resolve("Ciudad inválida")
        })
    }
}



async function listCity(req, res) 
{
    // var token = req.headers.authentication
    // var result_token = await(checkToken(token))
    // if (result_token == 'Token inválido') {
    //     return result_token
    // }

    return new Promise(async(resolve) => {
        var result = await (city_model.findAll())
        var city = {};
        var count_cities = result.length;
        if (count_cities > 0) {
            var cities = []
            for (var i = 0; i < result.length; i++) {
                city = {};
                city.ide = result[i].city_ide;
                city.description = result[i].city_description;
                city.status = result[i].city_status;
                cities.push(city)
            }
            resolve(cities)
        } else {
            resolve('No hay ninguna ciudad para mostrar')
        }
    })
}


async function getCityById(req, id) 
{
    // var token = req.headers.authentication
    // var result_token = await(checkToken(token))
    // if (result_token == 'Token inválido') {
    //     return result_token
    // }

    var city_ide = parseInt(id);
    if (Number.isInteger(city_ide) && city_ide !== '') {
        return new Promise(async(resolve) => {
            var result = await (city_model.findAll({ where: { city_ide:  city_ide } }))
            var count_cities = result.length;
            if (count_cities > 0) {
                var result_cities = {};
                result_cities.ide = result[0].city_ide;
                result_cities.description = result[0].city_description;
                resolve(result_cities)
            } else {
                resolve('No hay ninguna ciudad para mostrar')
            }
            return result
        })
    } else {
        return new Promise((resolve) => {
            resolve("Ciudad inválida")
        })
    }
}


module.exports.createCity = createCity
module.exports.updateCity = updateCity
module.exports.deleteCity = deleteCity
module.exports.listCity = listCity
module.exports.getCityById = getCityById