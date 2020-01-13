'use strict'
const { Router } = require('express'),
    router = Router(),
    general_helper = require('../config/helpers'),
    { createPermissioncrud, listPermissioncrud, updatePermissioncrud, deletePermissioncrud,getPermissioncrudById }  = require('../controllers/Permissioncruds'),
    prefix_api = '/api'

//Crear un nuevo Permissioncrud
router.post(prefix_api + '/permissioncrud/create', async function(req, res) {
    var result = await(createPermissioncrud(req, res))
    var message, status
    if (result === 'Token incorrecto') {
        res.status(403)
        status = 'error'
    } else if (result === 'Permiso crud creado correctamente') {
        res.status(201)
        status = 'success'
    } else {
        res.status(400)
        status = 'error'
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Actualizar Permissioncrud
router.put(prefix_api + '/permissioncrud/update/:pecr_ide', async function(req, res) {
    var result = await(updatePermissioncrud(req, res))
    var message, status
    if (result === 'Token incorrecto') {
        res.status(403)
        status = 'error'
    } else if (result === 'Permiso crud actualizado correctamente') {
        res.status(201)
        status = 'success'
    } else {
        res.status(400)
        status = 'error'
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Borrar Permissioncrud
router.delete(prefix_api + '/permissioncrud/delete/:pecr_ide', async function(req, res) {
    var result = await(deletePermissioncrud(req, res))
    var message, status
    if (result === 'Token incorrecto') {
        res.status(403)
        status = 'error'
    } else if (result === 'Permiso crud eliminado correctamente') {
        res.status(203)
        status = 'success'
    } else {
        res.status(400)
        status = 'error'
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Obtener todos los Permissioncruds
router.get(prefix_api + '/permissioncrud/getAll', async function(req, res) {
	var result = await(listPermissioncrud(req, res))
    var message, status
    res.status(200)
    status = 'success'
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Obtener un  Permissioncruds especifico
router.get(prefix_api + '/permissioncrud/getById/:pecr_ide', async function(req, res) {
	var pecr_ide = req.params.pecr_ide;
	var result = await(getPermissioncrudById(req, pecr_ide))
    var message, status
    res.status(200)
    status = 'success'
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});



module.exports = router;