const { obtenerEsteProducto, obtenerProductos } = require("../models/productos")

// Funciones usadas para la creación de los middlewares

function comprobarID(idIngresado){
    const indicativoDR = idIngresado.slice(0, 2);
    const indicativoNumerico = idIngresado.slice(2);
    const valido = indicativoDR !== 'DR' || isNaN(indicativoNumerico) || 
    indicativoNumerico <= 0 || obtenerEsteProducto(idIngresado);

    return !valido;
}

function comprobarProducto(producto){
    const numeroDeParametros = Object.keys(producto).length;
    const {nombre, precio} = producto;
    const parametrosValidos = nombre && precio;
    const precioMayorQueCero = precio > 0;
    const nombreExiste = obtenerProductos().some((element) => element.nombre === nombre)
    const esValido = numeroDeParametros === 2 && parametrosValidos && precioMayorQueCero
    && !nombreExiste;

    return esValido;
}

function comprobarExiste(idIngresado){
    const listaID = obtenerProductos().map((element) => (element.id))
    const producto = listaID.indexOf(idIngresado)
    const valido = producto !== -1;

    return valido;
}

// Middlewares

const productoExiste = (req, res, next) => {
    const idIngresado =  req.params.id;

    if(comprobarExiste(idIngresado)){
         next()
    }
    else{
        res.status(400).send('El producto que solicita no existe. ' + 
        'Verifique que haya un producto registrado con ese id.')
    }
}

const idValido = (req, res, next) => {
    const idIngresado = req.params.id;

    if(comprobarID(idIngresado)){
        next()
    }
    else{
        res.status(405).send('El id no es válido, ya sea porque otro producto lo tiene registrado, ' +
         'o porque no cumple las reglas.');
    }
}

const productoValido = (req, res, next) => {
    const producto = req.body;

    if(comprobarProducto(producto)){
        next();
    }
    else{
        res.status(400).send('El producto no se pudo agregar. ' + 
        'Verifique que no haya otro producto con el mismo nombre y que el precio sea mayor que cero.')
    }
}

module.exports = {productoExiste, idValido, productoValido}