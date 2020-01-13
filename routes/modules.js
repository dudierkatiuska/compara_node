
const { Router } = require('express'),
router = Router(),
general_helper = require('../config/helpers'),
{ createModule, listModule, updateModule, deleteModule, getModuleById}  = require('../controllers/Modules'),
{ createSubmodule, listSubmodule, updateSubmodule, deleteSubmodule,getSubmoduleById }  = require('../controllers/Submodules'),
bodyParser = require('body-parser'),
prefix_api = '/api'

// support parsing of application/json type post data
router.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
router.use(bodyParser.urlencoded({ extended: true }));

//Crear un nuevo module
router.post(prefix_api + '/module/create', async function(req, res) {
var result = await(createModule(req, res))
var message, status
if (result === 'Token incorrecto') {
    res.status(403)
    status = 'error'
} else if (result === 'Módulo creado correctamente') {
    res.status(201)
    status = 'success'
} else {
    res.status(400)
    status = 'error'
}
result = await(general_helper.parseResponse(result))
res.send({"message": result, "status": status});
});
//Actualizar modulo
router.put(prefix_api + '/module/update/:modu_ide', async function(req, res) {
var result = await(updateModule(req, res))
var message, status
if (result === 'Token incorrecto') {
    res.status(403)
    status = 'error'
} else if (result === 'Módulo actualizado correctamente') {
    res.status(201)
} else {
    res.status(400)
    status = 'error'
}
result = await(general_helper.parseResponse(result))
res.send({"message": result, "status": status});
});
//Borrar modulo
router.delete(prefix_api + '/module/delete/:modu_ide', async function(req, res) {
var result = await(deleteModule(req, res))
var message, status
if (result === 'Token incorrecto') {
    res.status(403)
    status = 'error'
} else if (result === 'Módulo eliminado correctamente') {
    res.status(203)
    status = 'success'
} else {
    res.status(400)
    status = 'error'
}
result = await(general_helper.parseResponse(result))
res.send({"message": result, "status": status});
});
//Obtener todos los modulos
router.get(prefix_api + '/module/getAll', async function(req, res) {
var result = await(listModule(req, res))
var message, status
res.status(200)
status = 'success'
result = await(general_helper.parseResponse(result))
res.send({"message": result, "status": status});
});
//Obtener un  modulo especifico
router.get(prefix_api + '/module/getById/:modu_ide', async function(req, res) {
var modu_ide = req.params.modu_ide;
var result = await(getModuleById(req, modu_ide))
var message, status
res.status(200)
status = 'success'
result = await(general_helper.parseResponse(result))
res.send({"message": result, "status": status});
});

//Crear un nuevo submodule
router.post(prefix_api + '/submodule/create', async function(req, res) {
var result = await (createSubmodule(req, res))
var message, status
if (result === 'Token incorrecto') {
    res.status(403)
    status = 'error'
} else if (result === 'Submódulo creado correctamente') {
    res.status(201)
    status = 'success'
} else {
    res.status(400)
    status = 'error'
}
result = await(general_helper.parseResponse(result))
res.send({"message": result, "status": status});
});
//Actualizar submodule
router.put(prefix_api + '/submodule/update/:sumo_ide', async function(req, res) {
var result = await(updateSubmodule(req, res))
var message, status
if (result === 'Token incorrecto') {
    res.status(403)
    status = 'error'
} else if (result === 'Submódulo actualizado correctamente') {
    res.status(201)
    status = 'success'
} else {
    res.status(400)
    status = 'error'
}
result = await(general_helper.parseResponse(result))
res.send({"message": result, "status": status});
});
//Borrar submodule
router.delete(prefix_api + '/submodule/delete/:sumo_ide', async function(req, res) {
var result = await(deleteSubmodule(req, res))
var message, status
if (result === 'Token incorrecto') {
    res.status(403)
    status = 'error'
} else if (result === 'Submódulo eliminado correctamente') {
    res.status(203)
    status = 'success'
} else {
    res.status(400)
    status = 'error'
}
result = await(general_helper.parseResponse(result))
res.send({"message": result, "status": status});
});
//Obtener todos los submodules
router.get(prefix_api + '/submodule/getAll', async function(req, res) {
var result = await(listSubmodule(req, res))
var message, status
res.status(200)
status = 'success'
result = await(general_helper.parseResponse(result))
res.send({"message": result, "status": status});
});
//Obtener un  submodulo especifico
router.get(prefix_api + '/submodule/getById/:sumo_ide', async function(req, res) {
var sumo_ide = req.params.sumo_ide;
var result = await(getSubmoduleById(req, sumo_ide))
var message, status
res.status(200)
status = 'success'
result = await(general_helper.parseResponse(result))
res.send({"message": result, "status": status});
});




module.exports = router;