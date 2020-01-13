'use strict'
const { Router } = require('express'),
    router = Router(),
    general_helper = require('../config/helpers'),
    { createUsertype, listUsertype, updateUsertype, deleteUsertype,getUsertypeById }  = require('../controllers/Usertypes'),
    prefix_api = '/api'

//Crear un nuevo tipo de usario
router.post(prefix_api + '/Usertype/create', async function(req, res) {
    var result = await (createUsertype(req, res))
    var message, status
    if (result === 'Token incorrecto') {
        res.status(403)
        status = 'error'
    } else if (result === 'Tipo de usuario creado correctamente') {
        res.status(201)
        status = 'success'
    } else {
        res.status(400)
        status = 'error'
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Actualizar tipo de usario
router.put(prefix_api + '/usertype/update/:usty_ide', async function(req, res) {
    var result = await(updateUsertype(req, res))
    var message, status
    if (result === 'Token incorrecto') {
        res.status(403)
        status = 'error'
    } else if (result === 'Tipo de usuario actualizado correctamente') {
        res.status(201)
        status = 'success'
    } else {
        res.status(400)
        status = 'error'
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Borrar tipo de usario
router.delete(prefix_api + '/usertype/delete/:usty_ide', async function(req, res) {
    var result = await(deleteUsertype(req, res))
    var message, status
    if (result === 'Token incorrecto') {
        res.status(403)
        status = 'error'
    } else if (result === 'Tipo de usuario eliminado correctamente') {
        res.status(203)
        status = 'success'
    } else {
        res.status(400)
        status = 'error'
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});
//Obtener todos los tipo de usario
router.get(prefix_api + '/usertype/getAll', async function(req, res) {
	var result = await(listUsertype(req, res))
    var message, status
    res.status(200)
    status = 'success'
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});

//Obtener un tipo de usario especifico
router.get(prefix_api + '/usertype/getById/:usty_ide', async function(req, res) {
	var usty_ide = req.params.usty_ide;
	var result = await(getUsertypeById(req, usty_ide))
    var message, status
    res.status(200)
    status = 'success'
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});


module.exports = router;