'use strict'
const { Router } = require('express'),
    router = Router(),
    general_helper = require('../config/helpers'),
    { createAccesstypeuser, listAccesstypeuser, updateAccesstypeuser, deleteAccesstypeuser, getAccesstypeuserById }  = require('../controllers/Accesstypeuser'),
    prefix_api = '/api'


// //Crear un nuevo acceso  tipo de usuario
// router.post(prefix_api + '/accesstypeuser/create', async function(req, res) {
//     var result = await(createAccesstypeuser(req, res))
//     var message, status
//     if (result === 'Token incorrecto') {
//         res.status(403)
//         status = 'error'
//     } else if (result === 'Tipo de usuario creado correctamente') {
//         res.status(201)
//         status = 'success'
//     } else {
//         res.status(400)
//         status = 'error'
//     }
//     result = await(general_helper.parseResponse(result))
//     res.send({"message": result, "status": status});
// });
//Actualizar Acceso tipo de usuario
router.put(prefix_api + '/accesstypeuser/update', async function(req, res) {
    var result = await(updateAccesstypeuser(req, res))
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
// //Borrar Acceso tipo de usuario
// router.delete(prefix_api + '/accesstypeuser/delete/:actu_ide', async function(req, res) {
//     var result = await(deleteAccesstypeuser(req, res))
//     var message, status
//     if (result === 'Token incorrecto') {
//         res.status(403)
//         status = 'error'
//     } else if (result === 'Tipo de usuario eliminado correctamente') {
//         res.status(203)
//         status = 'success'
//     } else {
//         res.status(400)
//         status = 'error'
//     }
//     result = await(general_helper.parseResponse(result))
//     res.send({"message": result, "status": status});
// });
//Obtener todos los Acceso tipo de usuario
// router.get(prefix_api + '/accesstypeuser/getAll', async function(req, res) {
//     var result = await(listAccesstypeuser(req, res))
//     var message, status
//     res.status(200)
//     status = 'success'
//     res.send({"message": result, "status": status});
    
// });
// //Obtener un Acceso tipo de usuario especifico
// router.get(prefix_api + '/accesstypeuser/getById/:actu_ide', async function(req, res) {
//     var actu_ide = req.params.actu_ide;
//     var message, status
//     var result = await(getAccesstypeuserById(req, actu_ide))
//     res.status(200)
//     status = 'success'
//     res.send({"message": result, "status": status});
    
// });


module.exports = router;