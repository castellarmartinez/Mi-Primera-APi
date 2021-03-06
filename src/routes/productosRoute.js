const express = require('express');
const router = express.Router();
const {obtenerProductos, agregarProductos, modificarProductos, eliminarProductos,
    obtenerEsteProducto} = require('../models/productos')
const {autenticacionAdmin} = require('../middlewares/autenticacion');
const { productoExiste, idValido, productoValido } = require('../middlewares/comprobacionProductos');

/**
 * @swagger
 * /productos/lista:
 *  get:
 *      tags: [Productos]
 *      summary: Obtener todos los productos que hay en la tienda.
 *      description: Devuelve una lista con los productos.
 *      responses:
 *          200:
 *              description: Operación exitosa.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/lista productos'
 */

router.get('/lista', (req, res) => {
    res.json(obtenerProductos())
})

/**
 * @swagger
 * /productos/agregar/{productoId}:
 *  post:
 *      tags: [Productos]
 *      summary: Agregar un producto a la tienda.
 *      description: Permite la adición de un producto a la tienda.
 *      parameters:
 *      -   name: "productoId"
 *          in: "path"
 *          required: true
 *          type: "string"
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/adicion de productos'
 *      responses:
 *          201:
 *              description: El producto se agregó exitosamente.
 *          400:
 *              description: El producto no se pudo agregar por información errónea del mismo.
 *          401:
 *              description: Se necesitan permisos de administrador para realizar esa operación.
 */

router.post('/agregar/:id/', autenticacionAdmin, idValido, productoValido, (req, res) => {
    const producto = req.body;
    const id = req.params.id;
    agregarProductos(producto, id);

    res.send('El producto se agregó exitosamente.');
})

/**
 * @swagger
 * /productos/modificar/{productoId}:
 *  put:
 *      tags: [Productos]
 *      summary: Modificar un producto de la tienda.
 *      description: Permite la modificación de los productos en la tienda.
 *      parameters:
 *      -   name: "productoId"
 *          in: "path"
 *          required: true
 *          type: "string"
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/adicion de productos'
 *      responses:
 *          200:
 *              description: Operación exitosa.
 *          400:
 *              description: El producto no se pudo agregar por información errónea del mismo.
 *          401:
 *              description: Se necesitan permisos de administrador para realizar esa operación.
 */

router.put('/modificar/:id/', autenticacionAdmin, productoValido, productoExiste, (req, res) => {
    const productoModificado = req.body;
    const id = req.params.id;
    productoModificado.id = id;
    const productoOriginal = obtenerEsteProducto(id);
    modificarProductos(productoOriginal, productoModificado);

    res.send('El producto se modificó exitosamente.');
})

/**
 * @swagger
 * /productos/eliminar/{productoId}:
 *  delete:
 *      tags: [Productos]
 *      summary: Eliminar un producto de la tienda.
 *      description: Permite la eliminación de los productos de la tienda.
 *      parameters:
 *      -   name: "productoId"
 *          in: "path"
 *          required: true
 *          type: "string"
 *      responses:
 *          200:
 *              description: Operación exitosa.
 *          400:
 *              description: El el id del producto que inteta eliminar no existe.
 *          401:
 *              description: Se necesitan permisos de administrador para realizar esa operación.
 */

router.delete('/eliminar/:id/', autenticacionAdmin, productoExiste, (req, res) => {
    const id = req.params.id;
    const producto = obtenerEsteProducto(id);
    eliminarProductos(producto);

    res.send('El producto se eliminó exitosamente.');
})

/**
 * @swagger
 * tags:
 *  name: Productos
 *  description: Seccion de productos
 * 
 * components: 
 *  schemas:
 *      lista productos:
 *          type: object
 *          properties:
 *              nombre:
 *                  type: string
 *              precio:
 *                  type: integer
 *              id:
 *                  type: string
 *          example:
 *              nombre: Changua
 *              precio: 3000
 *              id: DR153
 */

/**
 * @swagger
 * tags:
 *  name: Productos
 *  description: Seccion de productos
 * 
 * components: 
 *  schemas:
 *      adicion de productos:
 *          type: object
 *          properties:
 *              nombre:
 *                  type: string
 *              precio:
 *                  type: integer
 *          example:
 *              nombre: Carimañola
 *              precio: 500
 */

module.exports = router;