const express = require('express');
const {mostrarUsuarios, agregarUsuarios} = require('../models/usuarios')
const {autenticacionAdmin, intentoDeIngreso} = require('../middlewares/autenticacion');
const { usuarioRegistrado, usuarioValido } = require('../middlewares/comporbacionUsuarios');

const router = express.Router();

/**
 * @swagger
 * /usuarios/login:
 *  get:
 *      tags: [Usuarios]
 *      summary: Ingreso a todos los usuarios registrados.
 *      description: La da acceso a un usuario.
 *      parameters: []
 *      responses:
 *          "200":
 *              description: El usuarion ingresó exitosamente.
 *          "401":
 *              description: El usuario y/o contraseña no son validos.
 */

router.get('/login', intentoDeIngreso, (req, res) => {
    res.send('El usuarion ingresó exitosamente.'); 
})

/**
 * @swagger
 * /usuarios/lista:
 *  get:
 *      tags: [Usuarios]
 *      summary: Obtener las cuentas registradas (nombre, usuario, administrador).
 *      description: Devuelve una lista con los usuarios registrados.
 *      responses:
 *          200:
 *              description: Operación exitosa.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/lista de usuarios'
 *          401:
 *              description: Se necesita permiso para realizar esa accion
 */

router.get('/lista', autenticacionAdmin, (req, res) => {
    res.json(mostrarUsuarios());
})

/**
 * @swagger
 * /usuarios/registro:
 *  post:
 *      tags: [Usuarios]
 *      summary: Registrar un nuevo usuario sin privilegios de administrador.
 *      description: Permite el registro de nuevos usuarios.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/registro'
 *      responses:
 *          "200":
 *              description: Registro exitoso.
 *          "400":
 *              description: Los datos de registro no son validos.
 *          "405":
 *              description: El username y/o email ya se encuentran registrados.
 */

router.post('/registro', usuarioValido, usuarioRegistrado, (req, res) => {
    const usuarioIngresado = req.body;
    agregarUsuarios(usuarioIngresado);
    
    res.status(201).send('Usuario registrado exitosamente.');    
})

/**
 * @swagger
 * tags:
 *  name: Usuarios
 *  description: Seccion de usuarios
 * 
 * components: 
 *  schemas:
 *      lista de usuarios:
 *          type: object
 *          properties:
 *              nombre:
 *                  type: string
 *              usuario:
 *                  type: string
 *              administrador:
 *                  type: boolean
 *          example:
 *              nombre: Arnedes Olegario
 *              nombre de usuario: arneolegario
 *              administrador: false
 */

/**
 * @swagger
 * tags:
 *  name: Usuarios
 *  description: Seccion de usuarios
 * 
 * components: 
 *  schemas:
 *      registro:
 *          type: object
 *          requred:
 *              -nombre
 *              -usuario
 *              -contrasena
 *              -email
 *              -telefono
 *          properties:
 *              nombre:
 *                  type: string
 *                  description: Nombres 
 *              usuario:
 *                  type: string
 *                  description: Nombre de usuario
 *              contrasena:
 *                  type: string
 *                  description: Contrasena
 *              email:
 *                  type: string
 *                  description: Correo electronico
 *              telefono:
 *                  type: integer
 *                  description: Telefono
 *          example:
 *              nombre: Arnedes Olegario
 *              usuario: arneolegario
 *              contrasena: Deivic007
 *              email: olegario.arnedes@nebular.com
 *              telefono: 3735648623
 */

module.exports = router;