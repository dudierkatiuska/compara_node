'use strict'
const responses = {
    //Correos electrónicos
    'header' : 'Akipartes',
    'footer' : '2019. Todos los derechos reservados',
    'recover_password_title' : 'Recuperar contraseña en Akipartes',
    'recover_password_content' : `
        La nueva contraseña para acceder a Akipartes es la siguiente (Debes cambiarla por seguridad):
    `,
    //Error

    //Login
    'wrong_credentials' : 'El usuario o la contraseña son incorrectos',
    'all_required_fields' : 'Todos los campos son requeridos',
    //Logout
    'wrong_token' : 'Token inválido',
    //Registro
    'error_register' : 'Error al registrar el usuario',
    //Autenticación
    'invalid_token' : 'Token inválido',
    //Categorías
    'no_category_found' : 'Categoría no encontrada',
    'invalid_category' : 'Categoría inválida',
    'errors_deleted_category' : 'Hubo errores en la eliminación de la categoría',
    'no_category_to_show' : 'No hay ninguna categoría para mostrar',
    //Subcategorías
    'no_subcategory_found' : 'Subcategoría no encontrada',
    'invalid_subcategory' : 'Subcategoría inválida',
    'errors_deleted_subcategory' : 'Hubo errores en la eliminación de la subcategoría',
    'no_subcategory_to_show' : 'No hay ninguna subcategoría para mostrar',
    //Módulos
    'no_module_found' : 'Módulo no encontrado',
    'invalid_module' : 'Módulo inválido',
    'errors_deleted_module' : 'Hubo errores en la eliminación del módulo',
    'no_module_to_show' : 'No hay ningún módulo para mostrar',
    //Submódulos
    'no_submodule_found' : 'Submódulo no encontrado',
    'invalid_submodule' : 'Submódulo inválido',
    'errors_deleted_submodule' : 'Hubo errores en la eliminación del submódulo',
    'no_submodule_to_show' : 'No hay ningún submódulo para mostrar',
    //Permisos crud
    'no_permission_crud_found' : 'Permiso crud no encontrado',
    'invalid_permission_crud' : 'Permiso crud inválido',
    'errors_deleted_permission_crud' : 'Hubo errores en la eliminación del permiso crud',
    'no_permission_crud_to_show' : 'No hay ningún permiso crud para mostrar',
    //Permisos 
    'no_permission_found' : 'Permiso no encontrado',
    'invalid_permission' : 'Permiso inválido',
    'errors_deleted_permission' : 'Hubo errores en la eliminación del permiso',
    'no_permission_to_show' : 'No hay ningún permiso para mostrar',
    //Categorías del usuario
    'no_usercategory_found' : 'Categoría del usuario no encontrada',
    'invalid_usercategory' : 'Categoría del usuario inválida',
    'errors_deleted_usercategory' : 'Hubo errores en la eliminación de la categoría del usuario',
    'no_usercategory_to_show' : 'No hay ninguna categoría del usuario para mostrar',
    //Usuario
    'no_user_found' : 'Usuario no encontrado',
    'invalid_user' : 'Usuario inválido',
    'errors_deleted_user' : 'Hubo errores en la eliminación del usuario',
    'no_user_to_show' : 'No hay ningún usuario para mostrar',
    //Tipos de usuario
    'no_typeuser_found' : 'Tipo de usuario no encontrado',
    'invalid_typeuser' : 'Tipo de usuario inválido',
    'errors_deleted_typeuser' : 'Hubo errores en la eliminación del tipo de usuario',
    'no_typeuser_to_show' : 'No hay ningún tipo de usuario para mostrar',
    //Acceso-Tipos de usuario
    'no_typeuser_found' : 'Tipo de usuario no encontrado',
    'invalid_typeuser' : 'Tipo de usuario inválido',
    'no_typeuser_to_show' : 'No hay ningún tipo de usuario para mostrar',
    //Configuración
    'no_settings_found' : 'Configuración no encontrada',
    'invalid_settings' : 'Configuración inválida',
    'errors_deleted_settings' : 'Hubo errores en la eliminación de la configuración',
    'no_settings_to_show' : 'No hay ninguna configuración para mostrar',
    //Ciudades
    'no_city_found' : 'Ciudad no encontrada',
    'invalid_city' : 'Ciudad inválida',
    'errors_deleted_city' : 'Hubo errores en la eliminación de la ciudad',
    'no_city_to_show' : 'No hay ninguna ciudad para mostrar',
    //Productos
    'no_product_to_show' : 'No hay ningún producto para mostrar',
    'no_productsearch_to_show' : 'No hay ninguna búsqueda para mostrar',
    //Producto favorito
    'no_favoriteproduct_found' : 'Producto favorito del usuario no encontrado',
    'invalid_favoriteproduct' : 'Producto favorito del usuario inválido',
    'no_favoriteproduct_to_show' : 'No hay ningún producto favorito del usuario para mostrar',
    //Tienda
    'no_store_found' : 'Tienda no encontrada',
    'invalid_store' : 'Tienda inválida',
    'no_store_to_show' : 'No hay ninguna tienda para mostrar',
    
    //Éxito

    //Categorías
    'category_created' : 'Categoría creada correctamente',
    'category_updated' : 'Categoría actualizada correctamente',
    'category_deleted' : 'Categoría eliminada correctamente',
    //Subcategorías
    'subcategory_created' : 'Subcategoría creada correctamente',
    'subcategory_updated' : 'Subcategoría actualizada correctamente',
    'subcategory_deleted' : 'Subcategoría eliminada correctamente',
    //Módulos
    'module_created' : 'Módulo creado correctamente',
    'module_updated' : 'Módulo actualizado correctamente',
    'module_deleted' : 'Módulo eliminado correctamente',
    //Submódulos
    'submodule_created' : 'Submódulo creado correctamente',
    'submodule_updated' : 'Submódulo actualizado correctamente',
    'submodule_deleted' : 'Submódulo eliminado correctamente',
    //Permisos crud
    'permission_crud_created' : 'Permiso crud creado correctamente',
    'permission_crud_updated' : 'Permiso crud actualizado correctamente',
    'permission_crud_deleted' : 'Permiso crud eliminado correctamente',
    //Permisos c
    'permission_created' : 'Permiso creado correctamente',
    'permission_updated' : 'Permiso actualizado correctamente',
    'permission_deleted' : 'Permiso eliminado correctamente',
     //Categorías del usuario
     'usercategory_created' : 'Categorías del usuario creadas correctamente',
     'usercategory_updated' : 'Categorías del usuario actualizadas correctamente',
     'usercategory_deleted' : 'Categoría del usuario eliminada correctamente',
     //Usuario
     'user_created' : 'Usuario creado correctamente',
     'user_updated' : 'Usuario actualizado correctamente',
     'user_deleted' : 'Usuario eliminado correctamente',
     //Tipos de usuario
     'typeuser_created' : 'Tipo de usuario creado correctamente',
     'typeuser_updated' : 'Tipo de usuario actualizado correctamente',
     'typeuser_deleted' : 'Tipo de usuario eliminado correctamente',
    //Acceso-Tipos de usuario
     'typeuser_updated' : 'Tipo de usuario actualizado correctamente',
     //Configuración
     'settings_created' : 'Configuración creada correctamente',
     'settings_updated' : 'Configuración actualizada correctamente',
     'settings_deleted' : 'Configuración eliminada correctamente',
     //Recuperación de contraseña
     'recover_password' : 'Nueva contraseña generada correctamente',
    //Ciudades
    'city_created' : 'Ciudad creada correctamente',
    'city_updated' : 'Ciudad actualizada correctamente',
    'city_deleted' : 'Ciudad eliminada correctamente',
    //Producto
    'popularseach_update' : 'Se actualizó la búsqueda popular correctamente',
    //Producto Favorito
    'favoriteproduct_created' : 'Productos favoritos creados correctamente',
    'cavoriteproduct_updated' : 'Productos favoritos del usuario actualizados correctamente',
    'favoriteproduct_deleted' : 'Producto favorito del usuario eliminado correctamente',
    //Tienda
    'store_created' : 'Tienda creada correctamente',
    'store_updated' : 'Tienda actualizada correctamente',
    'store_deleted' : 'Tienda eliminada correctamente',
    //Logout
    'logout_successfully': 'Has cerrado sesión satisfactoriamente',

}

function getKeyResponse(value)
{
    for (var i in responses) {
        if (responses[i] === value) {
            return i
        }
    }
    return false
}

function getValueResponse(key)
{
    for (var i in responses) {
        if (i === key) {
            return responses[i]
        }
    }
    return false
}

module.exports.responses = responses
module.exports.getKeyResponse = getKeyResponse
module.exports.getValueResponse = getValueResponse