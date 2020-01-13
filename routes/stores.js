'use strict'
const { Router } = require('express'),
    router = Router(),
    general_helper = require('../config/helpers'),
    { createStore, updateStore, deleteStore, listStore, getStoreById }  = require('../controllers/Store'),
    prefix_api = '/api'

//Crear una nueva tienda
router.post(prefix_api + '/store/create', async function(req, res) {
    var result = await (createStore(req, res))
    var message, status
    if (result === 'Token incorrecto') {
        res.status(403)
        status = 'error'
    } else if (result === 'Tienda creada correctamente') {
        res.status(201)
        status = 'success'
    } else {
        res.status(400)
        status = 'error'
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Actualizar datos de una tienda
router.put(prefix_api + '/store/update/:stor_ide', async function(req, res) {
    var result = await(updateStore(req, res))
    var message, status
    if (result === 'Token incorrecto') {
        res.status(403)
        status = 'error'
    } else if (result === 'Tienda actualizada correctamente') {
        res.status(201)
        status = 'success'
    } else {
        res.status(400)
        status = 'error'
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Borrar una tienda
router.delete(prefix_api + '/store/delete/:stor_ide', async function(req, res) {
    var result = await(deleteStore(req, res))
    var message, status
    if (result === 'Token incorrecto') {
        res.status(403)
        status = 'error'
    } else if (result === 'Tienda eliminada correctamente') {
        res.status(203)
        status = 'success'
    } else {
        res.status(400)
        status = 'error'
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Obtener todos los usuarios
router.get(prefix_api + '/store/getAll', async function(req, res) {
    var result = await(listStore(req, res))
    var message, status
    res.status(200)
    status = 'success'
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Obtener un usuario específico
router.get(prefix_api + '/store/getById/:stor_ide', async function(req, res) {
	var stor_ide = req.params.stor_ide;
    var result = await(getStoreById(req, stor_ide))
    var message, status
    res.status(200)
    status = 'success'
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
module.exports = router;