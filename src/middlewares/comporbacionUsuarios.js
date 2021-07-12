const { obtenerUsuarios } = require("../models/usuarios");

// Funciones para crear los middlewares

function esNombre(nombre){
    const re = /^[ a-zA-Z]+$/;
    const resultado = re.test(nombre) && nombre.length >= 3 && nombre.length <= 32;

    return resultado;
}

function esUsuario(usuario){
    const re = /^[a-zA-Z0-9]+$/;
    const resultado = re.test(usuario) && isNaN(usuario.charAt(0)) && usuario.length >= 4
    && usuario.length <= 16;

    return resultado;
}

function esCorreo(email){
    const re = /\S+@\S+\.\S+/;
    const resultado = re.test(email);

    return resultado;
}

function esContrasena(contrasena){
    const resultado = contrasena.length >= 6 && contrasena.length <= 32;
    
    return resultado;
}

function esTelefono(telefono){
    const strTelefono = telefono.toString();
    const longitudValida = strTelefono.length >= 7 && strTelefono.length <= 14;
    const resultado =  longitudValida && !isNaN(telefono);

    return resultado;
}

function usuario(datosIngresados){
    const {nombre, usuario, contrasena, email, telefono} = datosIngresados;
    const numeroDeParametros = Object.keys(datosIngresados).length;
    const parametrosValidos = nombre && usuario && contrasena && email && telefono;
    const valido = parametrosValidos && numeroDeParametros === 5;

    return valido;    
}

// Middlewares

const usuarioValido = (req, res, next) => {
    const datosIngresados = req.body;

    if(!usuario(datosIngresados)){
        res.status(400).send('El usuario no se pudo registrar. \n' + 
        'Verifique que los datos de registro sean correctos.');
    }
    else if(!esNombre(datosIngresados.nombre)){
        res.status(400).send('El nombre debe tener una logitud de 3-32 caracteres' + 
        ' y sólo puede contener letras.');
    }
    else if(!esUsuario(datosIngresados.usuario)){
        res.status(400).send('El nombre de usuario debe tener una logitud de 4-16 caracteres' + 
        ' y sólo puede contener letras y números, iniciando con una letra.');
    }
    else if(!esCorreo(datosIngresados.email)){
        res.status(400).send('Se debe ingresar un correo válido');
    }
    else if(!esContrasena(datosIngresados.contrasena)){
        res.status(400).send('La contrasena debe tener una longitud de 6-32 caracteres.');
    }
    else if(!esTelefono(datosIngresados.telefono)){
        res.status(400).send('El formato para números telefónicos en colombia debe tener 7-14 dígitos.');
    }
    else{
        next();
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