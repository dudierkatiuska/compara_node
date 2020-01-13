'use strict'
const { Router } = require('express'),
    router = Router(),
    general_helper = require('../config/helpers'),
    { createPermission, listPermission, updatePermission, deletePermission, getPermissionById }  = require('../controllers/Permissions'),
    prefix_api = '/api'

//Crear un nuevo Permission
router.post(prefix_api + '/permission/create', async function(req, res) {
    var result = await(createPermission(req, res))
    var message, status
    if (result === 'Token incorrecto') {
        res.status(403)
        status = 'error'
    } else if (result === 'Permiso creado correctamente') {
        res.status(201)
        status = 'success'
    } else {
        res.status(400)
        status = 'error'
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Actualizar Permission
router.put(prefix_api + '/permission/update/:perm_ide', async function(req, res) {
    var result = await(updatePermission(req, res))
    var message, status
    if (result === 'Token incorrecto') {
        res.status(403)
        status = 'error'
    } else if (result === 'Permiso actualizado correctamente') {
        res.status(201)
        status = 'success'
    } else {
        res.status(400)
        status = 'error'
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Borrar Permission
router.delete(prefix_api + '/permission/delete/:perm_ide', async function(req, res) {
    var result = await(deletePermission(req, res))
    var message, status
    if (result === 'Token incorrecto') {
        res.status(403)
        status = 'error'
    } else if (result === 'Permiso eliminado correctamente') {
        res.status(203)
        status = 'success'
    } else {
        res.status(400)
        status = 'error'
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Obtener todos los Permissions
router.get(prefix_api + '/permission/getAll', async function(req, res) {
	var result = await(listPermission(req, res))
    var message, status
    res.status(200)
    status = 'success'
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Obtener un  Permission especifico
router.get(prefix_api + '/permission/getById/:perm_ide', async function(req, res) {
	var perm_ide = req.params.perm_ide;
    var result = await(getPermissionById(req, perm_ide))
    var message, status
    res.status(200)
    status = 'success'
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});


module.exports = router;