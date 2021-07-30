const express = require('express');
const {obtenerMediosDePago, agregarMediosDePago, modificarMediosDePago, eliminarMediosDePago} = 
require('../models/mediosPago')
const {autenticacionAdmin, autenticacionUsuario} = require('../middlewares/autenticacion');
const { medioValido, modificarValido, eliminarValido } = require('../middlewares/comprobacionPago');

const router = express.Router();

/**
 * @swagger
 * /mediosdepago/lista:
 *  get:
 *      tags: [Medios de pago]
 *      summary: Obtener todos los medios de pago que soporta la tienda.
 *      description: Devuelve una lista con los medios de pago.
 *      responses:
 *          200:
 *              description: Operación exitosa.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/medios de pago'
 *          401:
 *              description: Se necesita permiso para realizar esa accion
 */

router.get('/lista', autenticacionUsuario, (req, res) => {
    res.json(obtenerMediosDePago())
})

/**
 * @swagger
 * /mediosdepago/agregar:
 *  post:
 *      tags: [Medios de pago]
 *      summary: Agregar un medio de pago a la tienda.
 *      description: Permite agregar un medio de pago a la tienda.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/medio nuevo'
 *      responses:
 *          201:
 *              description: El producto se agregó exitosamentea.
 *          400:
 *              description: El medio de no se pudo agregar.
 *          401:
 *              description: Se necesita permiso para realizar esa accion.
 */

router.post('/agregar', autenticacionAdmin, medioValido, (req, res) => {
    const medio = req.body;
    agregarMediosDePago(medio);

    res.status(201).send('El medio de pago se agregó exitosamente.')
})

/**
 * @swagger
 * /mediosdepago/modificar/{opcion}:
 *  put:
 *      tags: [Medios de pago]
 *      summary: Modificar un medio de pago.
 *      description: Permite la modificación de los medios de pago.
 *      parameters:
 *      -   name: "opcion"
 *          in: "path"
 *          required: true
 *          type: "integer"
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/medio nuevo'
 *      responses:
 *          200:
 *              description: Operación exitosa.
 *          400:
 *              description: El producto no se pudo modificar por información errónea del mismo.
 *          401:
 *              description: Se necesitan permisos de administrador para realizar esa operación.
 */

router.put('/modificar/:id/', autenticacionAdmin, modificarValido, (req, res) => {
    const opcion = req.params.id;
    const {medio} = req.body;
    modificarMediosDePago(medio, opcion)

    res.send('El medio de pago se modificó exitosamente.');
})

/**
 * @swagger
 * /mediosdepago/eliminar/{opcion}:
 *  delete:
 *      tags: [Medios de pago]
 *      summary: Eliminar un medio de pago.
 *      description: Permite eliminar los medios de pago.
 *      parameters:
 *      -   name: "opcion"
 *          in: "path"
 *          required: true
 *          type: "integer"
 *      responses:
 *          200:
 *              description: Operación exitosa.
 *          400:
 *              description: El producto no se pudo eliminar por información errónea del mismo.
 *          401:
 *              description: Se necesitan permisos de administrador para realizar esa operación.
 */

router.delete('/eliminar/:id/', autenticacionAdmin, eliminarValido, (req, res) => {
    const opcion = req.params.id;
    eliminarMediosDePago(opcion);

    res.send('El medio de pago se eliminó exitosamente.');
})

/**
 * @swagger
 * tags:
 *  name: Medios de pago
 *  description: Seccion de productos
 * 
 * components: 
 *  schemas:
 *      medios de pago:
 *          type: object
 *          properties:
 *              medio:
 *                  type: string
 *              opcion:
 *                  type: integer
 *          example:
 *              medio: Tarjeta de crédito
 *              opcion: 1
 */

/**
 * @swagger
 * tags:
 *  name: Medios de pago
 *  description: Seccion de productos
 * 
 * components: 
 *  schemas:
 *      medio nuevo:
 *          type: object
 *          properties:
 *              medio:
 *                  type: string
 *          example:
 *              medio: Tarjeta de débito
 */

module.exports = router;