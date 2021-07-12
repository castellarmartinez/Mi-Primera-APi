const { obtenerEsteMedio } = require('../models/mediosPago');
const {obtenerPedidos, obtenerEstePedido} = require('../models/pedidos');
const { obtenerEsteProducto } = require('../models/productos');

// Funciones para crear los middlewares

function pedidoAbierto(usuario){
    const abierto = obtenerPedidos().some((element) => 
        (element.usuario === usuario && element.estado === 'nuevo'));

    return abierto;
}


function estadoAdmin(estado){
    let estadoValido = false;

    switch(estado){
        case 'preparando':
        case 'enviando':
        case 'cancelado':
        case 'entregado':
            estadoValido = true;
            break;
        default:
            break;
    }

    return estadoValido;
}

function estadoCliente(estado){
    let estadoValido = false;

    switch(estado){
        case 'confirmado':
        case 'cancelado':
            estadoValido = true;
            break;
        default:
            break;
    }

    return estadoValido;
}

function estadoNuevoPedido(estadoIngresado){
    let valido = false;

    switch(estadoIngresado){
        case 'nuevo':
        case 'confirmado':
            valido = true;
            break;
        default:
            break;
    }

    return valido;
}

function orden(ordenIngresada){
    const existe = obtenerPedidos().some((element) => 
        (element.orden === ordenIngresada));

    return existe;
}

function unidadesEnteroMayorACero(unidades){
    const valido = unidades % 1 === 0 && unidades > 0;

    return valido;
}

function medioDePago(pago){
    const medio = obtenerEsteMedio(pago);

    return medio;
}

function datosValidos(datosIngresados){
    const {unidades, direccion, pago, estado} = datosIngresados;
    const numeroDeParametros = Object.keys(datosIngresados).length;
    const parametrosValidos = unidades && direccion && pago && estado;

    if(parametrosValidos && numeroDeParametros === 4){
        const datosValidos = unidadesEnteroMayorACero(unidades) && medioDePago(pago) &&
        estadoNuevoPedido(estado);
        
        return datosValidos;
    }
    else{
        return false;
    }
}

function eliminarValido(pedido, producto){
    const indice = pedido.descripcion.search(producto.nombre);
    const valido = indice !== -1;

    return valido;
}

// Middlewares

const tienePedidoAbierto = (req, res, next) => {
    const usuario = req.auth.user;

    if(!pedidoAbierto(usuario)){
        next()
    }
    else{
        res.status(403).send('Tiene un pedido abierto (nuevo), puede editarlo, o si lo prefiere, ' +
        'confirme o cancele ese pedido para poder realizar otro.');
    }
}

const puedeEditarPedido = (req, res, next) => {
    const usuario = req.auth.user;

    if(pedidoAbierto(usuario)){
        next()
    }
    else{
        res.status(403).send('No tiene ningún pedido abierto (nuevo) que pueda modificar.')
    }
}

const estadoValidoAdmin = (req, res, next) => {
    const {estado} = req.query;

    if(estadoAdmin(estado)){
        next();
    }
    else{
        res.status(400).send('No se ha podido cambiar el estado.\n' +
         'Verifique que el estado sea válido.')
    }
}

const estadoValidoCliente = (req, res, next) => {
    const {estado} = req.query;

    if(estadoCliente(estado)){
        next();
    }
    else{
        res.status(400).send('No se ha podido cambiar el estado.\n' +
         'Verifique que el estado sea válido.')
    }
}

const ordenExiste = (req, res, next) => {
    const {ordenId} = req.query;

    if(orden(ordenId)){
        next();
    }
    else{
        res.status(403).send('El pedido que intenta modificar no existe.')
    }
}

const hizoPedidos = (req, res, next) => {
    const usuario = req.auth.user;
    const pedidos = obtenerPedidos().filter((element) => (element.usuario === usuario));

    if(pedidos.length > 0){
        next()
    }
    else{
        res.status(403).send('Usted no ha realizado ningún pedido.')
    }
}

const pedidoValido = (req, res, next) => {
    const estePedido = req.body;

    if(datosValidos(estePedido)){
        next()
    }
    else{
        res.status(400).send('No se pudo procesar la solicitud.\n' + 
        'Verifique que las unidades sean mayor a cero, el medio de pago exista y el estado sea' + 
        ' \'nuevo\' o \'confirmado\'.')
    }
}

const adicionValida = (req, res, next) => {
    const {unidades} = req.query;

    if(unidadesEnteroMayorACero(unidades)){
        next()
    }
    else{
        res.status(400).send('La unidades a agregar deben ser mayor a cero.');
    }
}

const eliminacionValida = (req, res, next) => {
    const idProducto = req.params.id;
    const user = req.auth.user;
    const {unidades} = req.query;
    const producto = obtenerEsteProducto(idProducto);
    const pedido = obtenerEstePedido(user);

    if(!unidadesEnteroMayorACero(unidades)){
        res.status(400).send('La unidades a agregar deben ser mayor a cero.');
    }
    else if(!eliminarValido(pedido, producto)){
        res.status(405).send('No tiene ningún pedido abierto con el producto que intenta eliminar.');
    }
    else{
        next();
    }
}

const direccionValida = (req, res, next) => {
    const {direccion} = req.query;
    const parametrosValidos = direccion;

    if(parametrosValidos){
        next()
    }
    else{
        res.status(400).send('La direccion a la que intenta cambiar no es válida.');
    }
}

module.exports = {tienePedidoAbierto, puedeEditarPedido, ordenExiste, estadoValidoAdmin,
    estadoValidoCliente, hizoPedidos, pedidoValido, adicionValida, eliminacionValida, 
    direccionValida};