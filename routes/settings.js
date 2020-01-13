'use strict'
const { Router } = require('express'),
    router = Router(),
    general_helper = require('../config/helpers'),
    { createSetting, updateSetting, deleteSetting, listSetting, getSettingById}  = require('../controllers/Settings'),
    prefix_api = '/api',
    bodyParser = require('body-parser');
    bodyParser.json({limit: "50mb", extended: true});
    bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:100000000});

//Crear una nueva configuracion
router.post(prefix_api + '/setting/create', async function(req, res) {
    var result = await(createSetting(req, res))
    var message, status
    if (result == 'Token incorrecto') {
        res.status(403)
        status = 'error'
    } else if (result == 'Configuración creada correctamente') {
        res.status(201)
        status = 'success'
    } else {
        res.status(400)
        status = 'error'
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});

//Actualizar una configuracion
router.put(prefix_api + '/setting/update/:sett_ide', async function(req, res) {
    var result = await(updateSetting(req, res))
    var message, status
    if (result == 'Token incorrecto') {
        res.status(403)
        status = 'error'
    } else if (result == 'Configuración actualizada correctamente') {
        res.status(201)
        status = 'success'
    } else {
        res.status(400)
        status = 'error'
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Borrar configuracion
router.delete(prefix_api + '/setting/delete/:sett_ide', async function(req, res) {
    var result = await(deleteSetting(req, res))
    var message, status
    if (result == 'Token incorrecto') {
        res.status(403)
        status = 'error'
    } else if (result == 'Configuración eliminada correctamente') {
        res.status(203)
        status = 'success'
    } else {
        res.status(400)
        status = 'error'
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Obtener todas las configuraciones
router.get(prefix_api + '/setting/getAll', async function(req, res) {
    var result = await(listSetting(req, res))
    var message, status
    res.status(200)
    status = 'success'
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Obtener un acceso especifico
router.get(prefix_api + '/setting/getById/:sett_ide', async function(req, res) {
    var sett_ide = req.params.sett_ide;
    var message, status
    var result = await(getSettingById(req, sett_ide))
    res.status(200)
    status = 'success'
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
module.exports = router;