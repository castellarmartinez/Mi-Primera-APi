let listaPedidos = [];

const obtenerPedidos = () => {
    ordenarPedidos();

    return listaPedidos;
}

const agregarPedidos = (pedidoNuevo) => {
    listaPedidos.push(pedidoNuevo)
}

const agregarProducto = (producto, usuario, pedido) => {
    const pedidoEditable = obtenerEstePedido(usuario);
    modificarDescripcion(pedidoEditable, pedido, producto);
    pedidoEditable.valor += producto.precio * pedido.unidades;

    return pedidoEditable;
}

const quitarProducto = (producto, usuario, pedido) => {
    const pedidoEditable = obtenerEstePedido(usuario);
    pedido.unidades = -pedido.unidades;
    modificarDescripcion(pedidoEditable, pedido, producto);
    pedidoEditable.valor += producto.precio * pedido.unidades;

    return pedidoEditable;
}

const modificarDescripcion = (pedidoEditable, pedido, producto) => {
    const j = pedidoEditable.descripcion.search(producto.nombre);

    if(j === -1){
        pedidoEditable.descripcion += (' ' + pedido.unidades + 'x' + producto.nombre);
    }
    else{
        let i = j;
        while(pedidoEditable.descripcion[i] !== ' ' && pedidoEditable.descripcion[i] !== undefined) i--;

        const cantidad = pedidoEditable.descripcion.substring(i + 1, j - 1);
        const nuevaCantidad = parseInt(cantidad) + parseInt(pedido.unidades);

        if(nuevaCantidad > 0){
            const nuevaDescripcion = pedidoEditable.descripcion.substring(0, i + 1) + nuevaCantidad + 
            pedidoEditable.descripcion.substring(j - 1);
    
            pedidoEditable.descripcion = nuevaDescripcion;
        }
        else{
            const l = producto.nombre.length;
            const nuevaDescripcion = pedidoEditable.descripcion.substring(0, i) + 
            pedidoEditable.descripcion.substring(j + l + 1);
            pedido.unidades = -cantidad;
            pedidoEditable.descripcion = nuevaDescripcion;
        }
    }
}

const modificarPago = (user, pago) => {
    const pedido = obtenerEstePedido(user);
    pedido.medioPago = pago;
}

const modificarDireccion = (user, direccion) => {
    const pedido = obtenerEstePedido(user);
    pedido.direccion = direccion;
}

const modificarEstadoAdmin = (orden, estado) => {
    listaPedidos.find((element) => (element.orden === orden)).estado = estado;
}

const modificarEstadoCliente = (user, estado) => {
    const pedido = obtenerEstePedido(user);
    pedido.estado = estado;
}

const generarPedido = (producto, usuario, medioPago, estePedido) => {
    const descripcion = estePedido.unidades + 'x' + producto.nombre;
    const valor = producto.precio * estePedido.unidades;

    const pedido = {
        nombre: usuario.nombre,
        usuario: usuario.usuario,
        email: usuario.email,
        telefono: usuario.telefono,
        direccion: estePedido.direccion,
        descripcion: descripcion,
        valor: valor,
        medioPago: medioPago,
        estado: estePedido.estado,
        orden: '#' + (listaPedidos.length + 1),
    } 

    return pedido;
}

const obtenerPedidosUsuario = (user) => {
    const pedidos = obtenerPedidos().filter((element) => (element.usuario === user))

    return pedidos;
}

const obtenerEstePedido = (user) => {
    const pedidos = obtenerPedidosUsuario(user);
    const pedidoEditable = pedidos.filter((element) => (element.estado === 'nuevo'));

    return pedidoEditable[0]; //Para retornar un JSON
}

const ordenarPedidos = () => {
    const estado = [[], [], [], [], [], []];

    listaPedidos.forEach((element) =>{
        if(element.estado === 'nuevo'){
            estado[0].push(element);
        }
        if(element.estado === 'confirmado'){
            estado[1].push(element);
        }
        if(element.estado === 'preparando'){
            estado[2].push(element);
        }
        if(element.estado === 'enviando'){
            estado[3].push(element);
        }
        if(element.estado === 'cancelado'){
            estado[4].push(element);
        }
        if(element.estado === 'entregado'){
            estado[5].push(element);
        }
    })

    listaPedidos = estado[0].concat(estado[1], estado[2], estado[3], estado[4], estado[5])
}


module.exports = {obtenerPedidos, obtenerPedidosUsuario, agregarPedidos, agregarProducto, 
    quitarProducto, modificarPago, modificarDireccion, modificarEstadoAdmin, modificarEstadoCliente,
    generarPedido, obtenerEstePedido};