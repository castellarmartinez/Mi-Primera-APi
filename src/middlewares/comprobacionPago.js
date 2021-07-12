const { obtenerMediosDePago } = require("../models/mediosPago");

// Funciones para la creación de los middlewares

function formatoNuevo(medioIngresado){
    const numeroDeParametros = Object.keys(medioIngresado).length;
    const {medio} = medioIngresado;
    const parametrosValidos = medio;
    const existe = obtenerMediosDePago().some((element) => (element.medio === medio))
    const valido = !existe && numeroDeParametros === 1 && parametrosValidos;

    return valido;
}

function formatoModificacion(medioIngresado, opcion){
    const numeroDeParametros = Object.keys(medioIngresado).length;
    const {medio} = medioIngresado;
    const parametrosValidos = medio;
    const idExiste = obtenerMediosDePago().some((element) => (element.opcion == opcion))
    const nombreExiste = obtenerMediosDePago().some((element) => (element.medio === medio))
    const valido = idExiste && !nombreExiste && numeroDeParametros === 1 && parametrosValidos;
    
    return valido;
}

function formatoEliminacion(opcion){
    const existe = obtenerMediosDePago().some((element) => (element.opcion == opcion))

    return existe;
}

// Middlewares

const medioValido = (req, res, next) => {
    const medioIngresado = req.body;

    if(formatoNuevo(medioIngresado)){
        next();
    }
    else{
        res.status(400).send('El medio de pago no se pudo agregar.\n' + 
        'Verifique que los parámetros sean válidos y que el nombre del medio de pago no exista.');
    }
}

const modificarValido = (req, res, next) => {
    const medio = req.body;
    const opcion = req.params.id;

    if(formatoModificacion(medio, opcion)){
        next();
    }
    else{
        res.status(400).send('El medio de pago no se pudo modificar.\n' +
        'Verifique que la opción que intenta modificar existe y el nombre del medio de pago no exista.');
    }
}

const eliminarValido = (req, res, next) => {
    const opcion = req.params.id;

    if(formatoEliminacion(opcion)){
        next();
    }
    else{
        res.status(400).send('El medio de pago que intenta eliminar no existe.\n' +
        'Verifique que la opcion de pago exista.');
    }
}

const cambiarValido = (req, res, next) => {
    const {opcion} = req.query;

    if(formatoEliminacion(opcion)){
        next();
    }
    else{
        res.status(400).send('El medio de pago al que intenta cambiar no existe.\n' +
        'Verifique que los parámetros sean correctos.');
    }
}

module.exports = {medioValido, modificarValido, eliminarValido, cambiarValido}