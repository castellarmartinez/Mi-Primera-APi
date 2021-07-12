const { obtenerUsuarios } = require("../models/usuarios");

// Funciones para crear los middlewares

function esNombre(nombre){
    const re = /^[ a-zA-Z]+$/;
    const resultado = re.test(nombre) && nombre.length >= 3 && nombre.length <= 32;

    return resultado;
}

function esUsuario(usuario){
    const re = /^[a-zA-Z0-9]+$/;
    const resultado = re.test(usuario) && isNaN(usuario.charAt(0)) && usuario.length >= 4;

    return resultado;
}

function esCorreo(email){
    const re = /\S+@\S+\.\S+/;
    const resultado = re.test(email);

    return resultado;
}

function esContrasena(contrasena){
    const resultado = contrasena.length >= 6;
    
    return resultado;
}

function esTelefono(telefono){
    const strTelefono = telefono.toString();
    const longitudValida = strTelefono.length == 7 || strTelefono.length == 10;
    const resultado =  longitudValida && !isNaN(telefono);

    return resultado;
}

function usuario(datosIngresados){
    const {nombre, usuario, contrasena, email, telefono} = datosIngresados;
    const numeroDeParametros = Object.keys(datosIngresados).length;
    const parametrosValidos = nombre && usuario && contrasena && email && telefono;

    if(parametrosValidos && numeroDeParametros === 5){
        const datosValidos = esNombre(nombre) && esUsuario(usuario) && esCorreo(email) &&
        esContrasena(contrasena) && esTelefono(telefono);
        
        return datosValidos;
    }
    else{
        return false;
    }
}

// Middlewares

const usuarioValido = (req, res, next) => {
    const datosIngresados = req.body;

    if(usuario(datosIngresados)){
        next();
    }
    else{
        res.status(400).send('El usuario no se pudo registrar. \n' + 
        'Verifique que los datos de registro sean correctos.');
    }
}

const usuarioRegistrado = (req, res, next) => {
    const {usuario, email} = req.body;
    const invalido = obtenerUsuarios().some((element) =>
         element.usuario === usuario || element.email === email);

    if(invalido){
        res.status(405).send('El nombre de usuario y/o correo electrónico ' + 
        'ya se encuentran registrados.');
    }
    else{
        next();
    }
}

module.exports = {usuarioValido, usuarioRegistrado};