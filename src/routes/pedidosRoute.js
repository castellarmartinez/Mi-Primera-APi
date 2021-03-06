const express = require('express');
const { obtenerPedidos, generarPedido, agregarPedidos, obtenerEstePedido, modificarEstadoAdmin,
    modificarEstadoCliente, obtenerPedidosUsuario, agregarProducto, quitarProducto, 
    modificarPago, modificarDireccion} = require('../models/pedidos');
const { obtenerEsteProducto } = require('../models/productos');
const { obtenerEsteUsuario } = require('../models/usuarios');
const { obtenerEsteMedio } = require('../models/mediosPago');
const { autenticacionAdmin, autenticacionCliente } = require('../middlewares/autenticacion');
const { tienePedidoAbierto, hizoPedidos, 
    pedidoValido, puedeEditarPedido, adicionValida, eliminacionValida, direccionValida, 
    ordenExiste, estadoValidoAdmin, estadoValidoCliente } = require('../middlewares/comprobacionPedidos');
const { productoExiste } = require('../middlewares/comprobacionProductos');
const { cambiarValido } = require('../middlewares/comprobacionPago') 

const router = express.Router();

/**
 * @swagger
 * /pedidos/lista:
 *  get:
 *      tags: [Pedidos]
 *      summary: Obtener el historial de pedidos de todos los clientes.
 *      description: Devuelve una lista los pedidos.
 *      parameters: []
 *      responses:
 *          200:
 *              description: Operación exitosa.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/lista pedidos'
 *          401:
 *              description: Se necesita permiso para realizar esa accion.
 */


router.get('/lista', autenticacionAdmin, (req, res) => {
    res.send(obtenerPedidos())
})

/**
 * @swagger
 * /pedidos/historial:
 *  get:
 *      tags: [Pedidos]
 *      summary: Obtener el historial de pedidos hecho por un cliente.
 *      description: Devuelve la lista de pedidos.
 *      parameters: []
 *      responses:
 *          200:
 *              description: Operación exitosa.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/lista pedidos'
 *          401:
 *              description: Necesita estar logeado como cliente para realizar esa accion.
 */

router.get('/historial', autenticacionCliente, hizoPedidos, (req, res) => {
    const {user} = req.auth;
    const pedidos = obtenerPedidosUsuario(user);
    
    res.json(pedidos);
})

/**
 * @swagger
 * /pedidos/nuevo/{productoId}:
 *  post:
 *      tags: [Pedidos]
 *      summary: Hacer un nuevo pedido con un solo producto.
 *      description: Permite realizar un pedido.
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
 *                      $ref: '#/components/schemas/adicion pedidos'
 *      responses:
 *          201:
 *              description: Pedido creado.
 *          400:
 *              description: El pedido no se pudo procesar por información errónea del mismo.
 *          401:
 *              description: Necesita estar logeado como cliente para realizar esa accion.
 */

router.post('/nuevo/:id/', autenticacionCliente, tienePedidoAbierto, productoExiste, 
pedidoValido, (req, res) => {
    const estePedido = req.body;
    const id = req.params.id;
    const {user} = req.auth;
    const producto = obtenerEsteProducto(id);
    const usuario = obtenerEsteUsuario(user);
    const medioPago = obtenerEsteMedio(estePedido.pago);
    const pedidoNuevo = generarPedido(producto, usuario, medioPago, estePedido);

    agregarPedidos(pedidoNuevo)
    res.send('El pedido se procesó exitosamente.');
})


/**
 * @swagger
 * /pedidos/agregarproducto/{productoId}:
 *  put:
 *      tags: [Pedidos]
 *      summary: Agregar un producto nuevo al pedido. 
 *      description: Permite añadir un producto al pedido abierto.
 *      parameters:
 *      -   name: "productoId"
 *          in: "path"
 *          required: true     
 *      -   name: "unidades"
 *          in: "query"
 *          required: true     
 *      responses:
 *          200:
 *              description: Operación exitosa.
 *          400:
 *              description: El pedido no se pudo procesar por información errónea.
 *          401:
 *              description: Necesita estar logeado como cliente para realizar esa accion.
 */

router.put('/agregarproducto/:id/', autenticacionCliente, puedeEditarPedido, productoExiste, 
adicionValida, (req, res) => {
    const pedido = req.query;
    const id = req.params.id;
    const {user} = req.auth;
    const producto = obtenerEsteProducto(id);
    agregarProducto(producto, user, pedido);
    
    res.send('El producto se agregó al pedido.');
})

/**
 * @swagger
 * /pedidos/quitarproducto/{productoId}:
 *  put:
 *      tags: [Pedidos]
 *      summary: Eliminar un producto del pedido. 
 *      description: Permite suprimir un producto del pedido abierto.
 *      parameters:
 *      -   name: "productoId"
 *          in: "path"
 *          required: true     
 *      -   name: "unidades"
 *          in: "query"
 *          required: true     
 *      responses:
 *          200:
 *              description: Operación exitosa.
 *          400:
 *              description: El pedido no se pudo procesar por información errónea.
 *          401:
 *              description: Necesita estar logeado como cliente para realizar esa accion.
 *          405:
 *              description: No hay pedido abierto con el producto.
 */

router.put('/quitarproducto/:id/', autenticacionCliente, puedeEditarPedido, productoExiste, 
eliminacionValida, (req, res) => {
    const pedido = req.query;
    const id = req.params.id;
    const {user} = req.auth;
    const producto = obtenerEsteProducto(id);
    quitarProducto(producto, user, pedido);
    
    res.send('El producto se eliminó/redujo del pedido.');
})

/**
 * @swagger
 * /pedidos/cambiarpago:
 *  put:
 *      tags: [Pedidos]
 *      summary: Cambiar el medio de pago. 
 *      description: Permite al cliente cambiar el medio de pago del pedido abierto.
 *      parameters:
 *      -   name: "opcion"
 *          in: "query"
 *          required: true      
 *      responses:
 *          200:
 *              description: Operación exitosa.
 *          400:
 *              description: El pedido no se pudo procesar por información errónea.
 *          401:
 *              description: Necesita estar logeado como cliente para realizar esa accion.
 */

router.put('/cambiarpago', autenticacionCliente, puedeEditarPedido, cambiarValido, (req, res) => {
    const {opcion} = req.query;
    const {user} = req.auth;
    const pago = obtenerEsteMedio(opcion)
    modificarPago(user, pago);
    obtenerEstePedido(user);
    
    res.send('El medio de pago se cambió exitosamente');
})

/**
 * @swagger
 * /pedidos/cambiardireccion:
 *  put:
 *      tags: [Pedidos]
 *      summary: Cambiar la dirección de entrega de un pedido. 
 *      description: Permite cambiar la dirección del pedido abierto.
 *      parameters:
 *      -   name: "direccion"
 *          in: "query"
 *          required: true      
 *      responses:
 *          200:
 *              description: Operación exitosa.
 *          400:
 *              description: El pedido no se pudo procesar por información errónea.
 *          401:
 *              description: Necesita estar logeado como cliente para realizar esa accion.
 */

router.put('/cambiardireccion', autenticacionCliente, puedeEditarPedido, direccionValida, (req, res) => {
    const {direccion} = req.query;
    const {user} = req.auth;
    modificarDireccion(user, direccion);
    
    res.send('La dirección se cambió exitosamente.');
})

/**
 * @swagger
 * /pedidos/modificarestado/cliente:
 *  put:
 *      tags: [Pedidos]
 *      summary: Cambiar los estados de los pedidos siendo cliente. 
 *      description: Permite a los clientes cambiar el estado de sus pedidos.
 *      parameters:
 *      -   name: "estado"
 *          in: "query"
 *          required: true
 *          type: "array"
 *          items:
 *          schema:
 *              type: "string"
 *              enum:
 *              -   "confirmado"
 *              -   "cancelado"        
 *      responses:
 *          200:
 *              description: Operación exitosa.
 *          401:
 *              description: Se necesita permiso para realizar esa accion.
 */

 router.put('/modificarestado/cliente', autenticacionCliente, puedeEditarPedido, estadoValidoCliente, (req, res) => {
    const {estado} = req.query;
    const {user} = req.auth;
    modificarEstadoCliente(user, estado);

    res.send('El estado del pedido se modificó exitosamente.')
})

/**
 * @swagger
 * /pedidos/modificarestado/admin:
 *  put:
 *      tags: [Pedidos]
 *      summary: Cambiar los estados de los pedidos siendo administrador. 
 *      description: Permite a los administradores cambiar el estado de los pedidos.
 *      parameters:
 *      -   name: "ordenId"
 *          in: "query"
 *          required: true
 *          type: "string"
 *      -   name: "estado"
 *          in: "query"
 *          required: true
 *          type: "array"
 *          items:
 *          schema:
 *              type: "string"
 *              enum:
 *              -   "preparando"
 *              -   "enviando"
 *              -   "cancelado"
 *              -   "entregado"         
 *      responses:
 *          200:
 *              description: Operación exitosa.
 *          401:
 *              description: Necesitas estar logeado para realizar esa accion.
 */

router.put('/modificarestado/admin', autenticacionAdmin, ordenExiste, estadoValidoAdmin, (req, res) => {
    const {ordenId, estado} = req.query;
    modificarEstadoAdmin(ordenId, estado);

    res.send('El estado del pedido se modificó exitosamente.')
})

/**
 * @swagger
 * tags:
 *  name: Pedidos
 *  description: Seccion de productos
 * 
 * components: 
 *  schemas:
 *      lista pedidos:
 *          type: object
 *          properties:
 *              nombre:
 *                  type: string
 *              usuario:
 *                  type: string
 *              email:
 *                  type: string
 *              telefono:
 *                  type: integer
 *              direccion:
 *                  type: string
 *              descripcion:
 *                  type: string
 *              valor:
 *                  type: integer
 *              medioPago:
 *                  type: string
 *              orden:
 *                  type: string
 *              estado:
 *                  type: string
 *          example:
 *              nombre: Pancracio Anacleto
 *              usuario: panacleto
 *              email: señorpancracio@nubelar.com
 *              telefono: 4630107
 *              direccion: Calle los ahogados
 *              descripcion: 1xArepa 3xPandebonos
 *              valor: 36000
 *              medioPago: Efectivo
 *              orden: '#16'
 *              estado: confirmado
 */

/**
 * @swagger
 * tags:
 *  name: Pedidos
 *  description: Seccion de productos
 * 
 * components: 
 *  schemas:
 *      adicion pedidos:
 *          type: object
 *          properties:
 *              unidades:
 *                  type: string
 *              direccion:
 *                  type: string
 *              pago:
 *                  type: string
 *              estado:
 *          example:
 *              unidades: 5
 *              direccion: Barrio Chumbún
 *              pago: 2
 *              estado: confirmado
 */


module.exports = router;
