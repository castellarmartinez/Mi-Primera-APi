const listaUsuarios = 
[
    {
        nombre: 'David Castellar',
        usuario: 'ddcastellar',
        contrasena: 'xh93fKY1',
        email: 'dd.castellar@nubelar.com',
        telefono: 9543486,
        administrador: true
    }
]

const obtenerUsuarios = () => {
    return listaUsuarios;
}

const mostrarUsuarios = () => {
    const usuarios = obtenerUsuarios();
    const usuariosYnombres = usuarios.map((element) => {
        return {nombre: element.nombre, usuario: element.usuario, administrador: element.administrador}
    })

    return usuariosYnombres;
}

const agregarUsuarios = (usuario) => {
    usuario.administrador = false;
    listaUsuarios.push(usuario);
}

const eliminarUsuarios = (index) => {
    listaUsuarios.splice(index, 1);
}

const obtenerEsteUsuario = (user) => {
    const listaUsuarioID = listaUsuarios.map((element) => (element.usuario))
    const indice = listaUsuarioID.indexOf(user)
    const usuarioRequerido = listaUsuarios[indice];

    return usuarioRequerido;  
}

module.exports = {obtenerUsuarios, mostrarUsuarios, agregarUsuarios, eliminarUsuarios, 
    obtenerEsteUsuario};
