'use strict'
const { Router } = require('express'),
    router = Router(),
    general_helper = require('../config/helpers'),
    { createAccess, listAccess, updateAccess, deleteAccess,getAccessById, getAccessByUserId, login, logout, register, recoverPassword}  = require('../controllers/Access'),
    prefix_api = '/api',
    email_helper = require('../config/email')


//Crear un nuevo access
// router.post(prefix_api + '/access/create', async function(req, res) {
//     var result = await(createAccess(req, res))
//     var message, status
//     if (result == 'Token incorrecto') {
//         res.status(403)
//         status = 'error'
//     } else if (result == 'Se creó el acceso correctamente') {
//         res.status(201)
//         status = 'success'
//     } else {
//         res.status(400)
//         status = 'error'
//     }
// 	res.send({"message": result, "status": status});
// });
//Actualizar access
// router.put(prefix_api + '/access/update/:acce_ide', async function(req, res) {
//     var result = await(updateAccess(req, res))
//     var message, status
//     if (result == 'Token incorrecto') {
//         res.status(403)
//         status = 'error'
//     } else if (result == 'Se actualizó el acceso correctamente') {
//         res.status(201)
//         status = 'success'
//     } else {
//         res.status(400)
//         status = 'error'
//     }
// 	res.send({"message": result, "status": status});
// });
//Borrar access
// router.delete(prefix_api + '/access/delete/:acce_ide', async function(req, res) {
//     var result = await(deleteAccess(req, res))
//     var message, status
//     if (result == 'Token incorrecto') {
//         res.status(403)
//         status = 'error'
//     } else if (result == 'Se eliminó el acceso correctamente') {
//         res.status(203)
//         status = 'success'
//     } else {
//         res.status(400)
//         status = 'error'
//     }
// 	res.send({"message": result, "status": status});
// });
//Obtener todos los access
// router.get(prefix_api + '/access/getAll', async function(req, res) {
//     var result = await(listAccess(req, res))
//     var message, status
//     res.status(200)
//     status = 'success'
// 	res.send({"message": result, "status": status});
// });
//Obtener un acceso especifico
// router.get(prefix_api + '/access/getById/:acce_ide', async function(req, res) {
//     var acce_ide = req.params.acce_ide;
//     var message, status
//     var result = await(getAccessById(req, acce_ide))
//     res.status(200)
//     status = 'success'
// 	res.send({"message": result, "status": status});
// });

//Obtener un acceso-usuario especifico
router.get(prefix_api + '/access/getAccessByUserId', async function(req, res) {
    var acce_user = req.params.acce_user;
    var message, status
    var result = await(getAccessByUserId(req, acce_user))
    res.status(200)
    status = 'success'
	res.send({"message": result, "status": status});
});

//login 
router.post(prefix_api + '/access/login', async function(req, res) {
    var message, status
    var result = await(login(req, res))
    if (typeof result === 'string') {
        if (result === 'El usuario o la contraseña son incorrectos' || result === 'Todos los campos son requeridos') {
            res.status(400)
            status = 'error'
        } else {
            res.status(200)
            status = 'success'
        }
    } else {
        for (var i = 0; i < result.length; i++) {
            for (var j in result[i]) {
                if (result[i][j] === 'El usuario o la contraseña son incorrectos' || result[i][j] === 'Todos los campos son requeridos') {
                    res.status(400)
                    status = 'error'
                } else {
                    res.status(200)
                    status = 'success'
                }
            }
        }
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});

//register
router.post(prefix_api + '/access/register', async function(req, res) {
    var message, status
    var result = await(register(req, res))
    if (result === 'Usuario creado correctamente') {
        res.status(200)
        status = 'success'
    } else {
        res.status(400)
        status = 'error'
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
	
});

//Cambiar contraseña
router.post(prefix_api + '/access/recoverpassword', async function(req, res) {
    var message, status
    var result = await(recoverPassword(req, res))
    if (result.includes('Nueva contraseña generada correctamente')) {
        var password = result.substring(39)
        result = result.substring(0, 39)
        var data = {}
        data.password = password
        var result_send_email = await(email_helper.sendEmail(req.body.email, 'recover_password_title', 'recover_password', data))
        res.status(200)
        status = 'success'
    } else {
        res.status(400)
        status = 'error'
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
	
});

//logout 
router.post(prefix_api + '/access/logout', async function(req, res) {
    var message, status
    var result = await(logout(req, res))
    if (result === 'Has cerrado sesión satisfactoriamente') {
        res.status(200)
        status = 'success'
    } else {
        res.status(400)
        status = 'error'
    }
    result = await(general_helper.parseResponse(result))
	res.send({"message": result, "status": status});
});

module.exports = router;